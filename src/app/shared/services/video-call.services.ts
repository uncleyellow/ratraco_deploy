import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment} from '../environment';

@Injectable({
  providedIn: 'root'
})
export class VideoCallService {
  private socket: any;
  private participantsSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
  participants$ = this.participantsSubject.asObservable();
  
  constructor() {
    // Kết nối với backend Socket.io
    this.socket = io(`${environment.api.url}`);
    
    // Lắng nghe cập nhật người tham gia
    this.socket.on('updateParticipants', (participants) => {
      this.participantsSubject.next(participants);
    });
  }

  joinRoom(roomId: string, participant: any): void {
    this.socket.emit('joinRoom', roomId, participant);
  }

  sendSignal(data: any): void {
    this.socket.emit('signal', data);
  }

  startCall(participant: any, peerConnection: RTCPeerConnection, localStream: MediaStream): void {
    // Thêm từng track vào RTCPeerConnection
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
    
    peerConnection.createOffer().then((offer: RTCSessionDescriptionInit) => {
      return peerConnection.setLocalDescription(offer);
    }).then(() => {
      this.sendSignal({ to: participant.id, type: 'offer', data: peerConnection.localDescription });
    });
  }

  // Nhận tín hiệu từ WebSocket
  handleSignal(signal: any, peerConnection: RTCPeerConnection): void {
    if (signal.type === 'offer') {
      peerConnection.setRemoteDescription(new RTCSessionDescription(signal.data)).then(() => {
        peerConnection.createAnswer().then((answer: RTCSessionDescriptionInit) => {
          return peerConnection.setLocalDescription(answer);
        }).then(() => {
          this.sendSignal({ to: signal.from, type: 'answer', data: peerConnection.localDescription });
        });
      });
    } else if (signal.type === 'answer') {
      peerConnection.setRemoteDescription(new RTCSessionDescription(signal.data));
    } else if (signal.type === 'ice') {
      peerConnection.addIceCandidate(new RTCIceCandidate(signal.data));
    }
  }

  // Đóng kết nối khi ngắt cuộc gọi
  closeCall(peerConnection: RTCPeerConnection): void {
    peerConnection.close();
    this.socket.emit('disconnect');
  }
}
