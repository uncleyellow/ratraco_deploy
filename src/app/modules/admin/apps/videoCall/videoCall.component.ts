// videoCall.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { VideoCallService } from 'app/shared/services/video-call.services';
import { v4 as uuidv4 } from 'uuid';

interface Participant {
  id: string;
  name: string;
  stream: MediaStream;
  isLocal: boolean;
  peerConnection?: RTCPeerConnection;
}

@Component({
  selector: 'app-meeting-room',
  templateUrl: './videoCall.component.html',
  styleUrls: ['./videoCall.component.scss']
})
export class MeetingRoomComponent implements OnInit, OnDestroy {
  participants: Participant[] = [];
  localStream: MediaStream | null = null;
  isCameraOn = true;
  isMicOn = true;
  isScreenSharing = false;
  isRecording = false;
  private roomId = 'meetingRoom1';
  private userId = uuidv4();

  constructor(private videoCallService: VideoCallService) {}

  async ngOnInit(): Promise<void> {
    try {
      // Khởi tạo local stream
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      // Thêm local participant
      const localParticipant: Participant = {
        id: this.userId,
        name: 'You',
        stream: this.localStream,
        isLocal: true
      };
      this.participants.push(localParticipant);

      // Tham gia phòng
      this.videoCallService.joinRoom(this.roomId, {
        id: this.userId,
        name: 'You'
      });
      debugger
      // Lắng nghe người tham gia mới
      this.videoCallService.onNewParticipant().subscribe(async (newParticipant) => {
        if (newParticipant.id !== this.userId) {
          const peerConnection = await this.createPeerConnection(newParticipant.id);
          
          const participant: Participant = {
            ...newParticipant,
            stream: new MediaStream(),
            isLocal: false,
            peerConnection
          };
          
          this.participants.push(participant);
          
          // Bắt đầu kết nối
          if (this.localStream) {
            this.videoCallService.startCall(participant, peerConnection, this.localStream);
          }
        }
      });

      // Lắng nghe khi có người rời phòng
      this.videoCallService.onParticipantLeft().subscribe((participantId) => {
        this.participants = this.participants.filter(p => p.id !== participantId);
      });

    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }

  private async createPeerConnection(participantId: string): Promise<RTCPeerConnection> {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Xử lý ICE candidate
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.videoCallService.sendSignal({
          type: 'ice',
          data: event.candidate,
          to: participantId
        });
      }
    };

    // Xử lý khi nhận được remote stream
    peerConnection.ontrack = (event) => {
      const participant = this.participants.find(p => p.id === participantId);
      if (participant) {
        participant.stream.addTrack(event.track);
      }
    };

    return peerConnection;
  }

  async toggleCamera(): Promise<void> {
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      this.isCameraOn = !this.isCameraOn;
    }
  }

  async toggleMic(): Promise<void> {
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      this.isMicOn = !this.isMicOn;
    }
  }

  async shareScreen(): Promise<void> {
    try {
      if (this.isScreenSharing) {
        // Dừng chia sẻ màn hình
        if (this.localStream) {
          this.localStream.getTracks().forEach(track => track.stop());
        }
        // Khôi phục camera
        this.localStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        await this.updateLocalStream();
      } else {
        // Bắt đầu chia sẻ màn hình
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true 
        });
        if (this.localStream) {
          this.localStream.getTracks().forEach(track => track.stop());
        }
        this.localStream = screenStream;
        await this.updateLocalStream();
      }
      this.isScreenSharing = !this.isScreenSharing;
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  }

  private async updateLocalStream(): Promise<void> {
    // Cập nhật stream cho local participant
    const localParticipant = this.participants.find(p => p.isLocal);
    if (localParticipant && this.localStream) {
      localParticipant.stream = this.localStream;
    }

    // Cập nhật stream cho tất cả peer connections
    for (const participant of this.participants) {
      if (!participant.isLocal && participant.peerConnection && this.localStream) {
        // Xóa tất cả tracks cũ
        const senders = participant.peerConnection.getSenders();
        for (const sender of senders) {
          await participant.peerConnection.removeTrack(sender);
        }

        // Thêm tracks mới
        this.localStream.getTracks().forEach(track => {
          participant.peerConnection?.addTrack(track, this.localStream!);
        });
      }
    }
  }

  ngOnDestroy(): void {
    // Dọn dẹp streams và connections
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    this.participants.forEach(participant => {
      if (participant.peerConnection) {
        participant.peerConnection.close();
      }
      participant.stream.getTracks().forEach(track => track.stop());
    });

    // Rời phòng
    this.videoCallService.leaveRoom(this.roomId, this.userId);
  }
}