// video-call.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class VideoCallService {
  private socket: Socket;
  private participantsSubject = new BehaviorSubject<any[]>([]);
  participants$ = this.participantsSubject.asObservable();

  constructor() {
    this.socket = io(environment.api.url);
    
    this.socket.on('updateParticipants', (participants) => {
      this.participantsSubject.next(participants);
    });
    
// video-call.service.ts
this.socket.on('signal', (data) => {
  this.signalReceived$.next(data); // Emit signal để component xử lý
});
    
  }
  private async handleOffer(data: any) {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });
  
    // Lưu peerConnection để có thể dùng lại khi nhận answer hoặc ICE
    this.peerConnections[data.from] = peerConnection;
  
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal({
          type: 'ice',
          data: event.candidate,
          to: data.from
        });
      }
    };
  
    peerConnection.ontrack = (event) => {
      console.log(`🎥 Nhận video từ ${data.from}`);
  
      // Tìm participant có ID tương ứng và cập nhật stream
      const participants = this.participantsSubject.getValue();
      const existingParticipant = participants.find(p => p.id === data.from);
      
      if (existingParticipant) {
        existingParticipant.stream = event.streams[0];
      } else {
        participants.push({ id: data.from, stream: event.streams[0] });
      }
  
      this.participantsSubject.next([...participants]);
    };
  
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.data));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
  
    this.sendSignal({
      type: 'answer',
      data: answer,
      to: data.from
    });
  
    console.log(`📨 Gửi answer tới ${data.from}`);
  }
  
  private async handleAnswer(data: any) {
    const peerConnection = this.peerConnections[data.from];
    if (!peerConnection) {
      console.error(`⚠️ Không tìm thấy peerConnection cho ${data.from}`);
      return;
    }
  
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.data));
    console.log(`✅ Đã đặt remote description từ ${data.from}`);
  }
  
  private async handleIceCandidate(data: any) {
    const peerConnection = this.peerConnections[data.from];
    if (!peerConnection) {
      console.error(`⚠️ Không tìm thấy peerConnection cho ${data.from}`);
      return;
    }
  
    await peerConnection.addIceCandidate(new RTCIceCandidate(data.data));
    console.log(`❄️ Đã thêm ICE Candidate từ ${data.from}`);
  }
  
  private peerConnections: { [id: string]: RTCPeerConnection } = {};

  private getPeerConnection(id: string): RTCPeerConnection | undefined {
    return this.peerConnections[id];
  }
  
  
  private signalReceived$ = new BehaviorSubject<any>(null);

  joinRoom(roomId: string, participant: any): void {
    this.socket.emit('joinRoom', roomId, participant);
  }

  leaveRoom(roomId: string, participantId: string): void {
    this.socket.emit('leaveRoom', roomId, participantId);
  }

  sendSignal(signal: any): void {
    this.socket.emit('signal', signal);
  }

  onSignalReceived(): Observable<any> {
    return this.signalReceived$.asObservable();
  }

  onNewParticipant(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('newParticipant', (participant) => {
        observer.next(participant);
      });
    });
  }

  onParticipantLeft(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('participantLeft', (participantId) => {
        observer.next(participantId);
      });
    });
  }

  startCall(participant: any, peerConnection: RTCPeerConnection, localStream: MediaStream): void {
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
    
    peerConnection.createOffer()
      .then(offer => peerConnection.setLocalDescription(offer))
      .then(() => {
        this.sendSignal({
          type: 'offer',
          data: peerConnection.localDescription,
          to: participant.id
        });
      })
      .catch(error => console.error('Error creating offer:', error));
  }
}