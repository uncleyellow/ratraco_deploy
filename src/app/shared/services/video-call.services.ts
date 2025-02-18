import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment} from '../environment';

@Injectable({
  providedIn: 'root'
})
export class VideoCallService {
  private socket: any;
  // Khai báo participants$ là BehaviorSubject thay vì Observable
  private participantsSubject = new BehaviorSubject<any[]>([]); // Đảm bảo bạn khởi tạo với mảng rỗng
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
    // Gửi thông tin tham gia phòng lên server
    this.socket.emit('joinRoom', roomId, participant);
  
    // Lắng nghe stream từ các participants khác
    this.socket.on('participantStream', (stream: MediaStream, newParticipant: any) => {
      // Kiểm tra nếu participant đã có trong danh sách, nếu có thì cập nhật stream
      const currentParticipants = this.participantsSubject.getValue();
      const existingParticipantIndex = currentParticipants.findIndex(p => p.id === newParticipant.id);
  
      if (existingParticipantIndex >= 0) {
        // Nếu participant đã tồn tại, chỉ cần cập nhật stream
        currentParticipants[existingParticipantIndex].stream = stream;
      } else {
        // Nếu participant mới, thêm vào danh sách
        newParticipant.stream = stream;
        currentParticipants.push(newParticipant);
      }
  
      // Cập nhật danh sách participants
      this.participantsSubject.next([...currentParticipants]);
    });
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
