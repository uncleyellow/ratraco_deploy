import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment} from '../environment';

@Injectable({
  providedIn: 'root'
})
export class VideoCallService {
  private socket: Socket;
  public participants$ = new Subject<any[]>();
  private apiUrl = `${environment.api.url}`; // URL từ environment

  constructor() {
    this.socket = io(`${this.apiUrl}`);
    
    this.socket.on('updateParticipants', (participants) => {
      this.participants$.next(participants);
    });
  }

  joinRoom(roomId: string, participant: any) {
    this.socket.emit('joinRoom', roomId, participant);
  }

  sendOffer(payload: { target: string; sdp: RTCSessionDescriptionInit }) {
    this.socket.emit('offer', payload);
  }

  sendAnswer(payload: { target: string; sdp: RTCSessionDescriptionInit }) {
    this.socket.emit('answer', payload);
  }

  sendIceCandidate(payload: { target: string; candidate: RTCIceCandidate }) {
    this.socket.emit('ice-candidate', payload);
  }

  onOffer(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('offer', (data) => observer.next(data));
    });
  }

  onAnswer(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('answer', (data) => observer.next(data));
    });
  }

  onIceCandidate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('ice-candidate', (data) => observer.next(data));
    });
  }
}