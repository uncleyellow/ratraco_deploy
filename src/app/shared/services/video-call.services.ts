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
    
    this.socket.on('signal', (data) => {
      this.signalReceived$.next(data); // Emit signal để component xử lý
    });
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