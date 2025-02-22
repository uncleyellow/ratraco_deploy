// videoCall.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { VideoCallService } from 'app/shared/services/video-call.services';
import { v4 as uuidv4 } from 'uuid';

interface Participant {
  id: string;
  name: string;
  stream: MediaStream | null;
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
  private roomId = 'meetingRoom1';
  private userId = uuidv4();

  constructor(
    private videoCallService: VideoCallService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeMediaStream();
    this.setupServiceListeners();
  }

  private async initializeMediaStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      const localParticipant: Participant = {
        id: this.userId,
        name: 'You',
        stream: this.localStream,
        isLocal: true
      };
      this.participants = [localParticipant];

      // Join room after getting local stream
      this.joinRoom();
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }

  private setupServiceListeners() {
    // Listen for new participants
    this.videoCallService.onNewParticipant().subscribe(async (participant) => {
      console.log('New participant joined:', participant);
      
      // Create new peer connection for the participant
      const peerConnection = await this.createPeerConnection(participant.id);
      
      // Add participant to list
      const newParticipant: Participant = {
        id: participant.id,
        name: participant.name,
        stream: null,
        isLocal: false,
        peerConnection
      };
      this.participants.push(newParticipant);

      // Initiate call to new participant
      if (this.localStream) {
        this.videoCallService.startCall(participant, peerConnection, this.localStream);
      }
    });

    // Listen for participant leaving
    this.videoCallService.onParticipantLeft().subscribe((participantId) => {
      this.participants = this.participants.filter(p => p.id !== participantId);
    });

    // Handle WebRTC signaling
    this.videoCallService.onSignalReceived().subscribe(async (data) => {
      if (!data) return;

      const participant = this.participants.find(p => p.id === data.from);
      
      switch (data.type) {
        case 'offer':
          await this.handleOffer(data, participant);
          break;
        case 'answer':
          await this.handleAnswer(data, participant);
          break;
        case 'ice':
          await this.handleIceCandidate(data, participant);
          break;
      }
    });
  }

  private async handleOffer(data: any, participant?: Participant) {
    let peerConnection: RTCPeerConnection;
    
    if (!participant) {
      peerConnection = await this.createPeerConnection(data.from);
      participant = {
        id: data.from,
        name: 'Remote User',
        stream: null,
        isLocal: false,
        peerConnection
      };
      this.participants.push(participant);
    } else {
      peerConnection = participant.peerConnection!;
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.data));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    this.videoCallService.sendSignal({
      type: 'answer',
      data: answer,
      to: data.from
    });
  }

  private async handleAnswer(data: any, participant?: Participant) {
    if (participant?.peerConnection) {
      await participant.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.data)
      );
    }
  }

  private async handleIceCandidate(data: any, participant?: Participant) {
    if (participant?.peerConnection) {
      await participant.peerConnection.addIceCandidate(
        new RTCIceCandidate(data.data)
      );
    }
  }

  private async createPeerConnection(participantId: string): Promise<RTCPeerConnection> {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.videoCallService.sendSignal({
          type: 'ice',
          data: event.candidate,
          to: participantId
        });
      }
    };

    // Handle incoming streams
    peerConnection.ontrack = (event) => {
      const participant = this.participants.find(p => p.id === participantId);
      if (participant) {
        participant.stream = event.streams[0];
        // Force change detection
        this.participants = [...this.participants];
      }
    };

    return peerConnection;
  }

  private joinRoom() {
    this.videoCallService.joinRoom(this.roomId, {
      id: this.userId,
      name: 'You'
    });
  }
  trackByParticipantId(index: number, participant: Participant): string {
    return participant.id;
  }

  leaveMeeting() {
    // Cleanup và rời phòng
    this.ngOnDestroy();
    // Chuyển hướng về trang chủ hoặc trang khác
    this.router.navigate(['/']);
  }

  private async updateLocalStream(): Promise<void> {
    if (!this.localStream) {
      console.warn("⚠️ Local stream bị mất, thử lấy lại...");
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      console.log("✅ Lấy lại localStream thành công:", this.localStream);
    }
  
    // Cập nhật stream cho local participant
    const localParticipant = this.participants.find(p => p.isLocal);
    if (localParticipant) {
      localParticipant.stream = this.localStream;
    }
  
    // Cập nhật streams cho tất cả peer connections
    for (const participant of this.participants) {
      if (!participant.isLocal && participant.peerConnection) {
        // Lấy tất cả senders hiện tại
        const senders = participant.peerConnection.getSenders();
        const tracks = this.localStream.getTracks();
  
        // Cập nhật từng track
        for (const track of tracks) {
          const sender = senders.find(s => s.track?.kind === track.kind);
          if (sender) {
            // Nếu đã có sender cho loại track này, chỉ cần thay thế track
            await sender.replaceTrack(track);
          } else {
            // Nếu chưa có sender cho loại track này, thêm mới
            participant.peerConnection.addTrack(track, this.localStream);
          }
        }
  
        // Xóa các sender không còn được sử dụng
        for (const sender of senders) {
          if (!tracks.find(t => t.kind === sender.track?.kind)) {
            participant.peerConnection.removeTrack(sender);
          }
        }
      }
    }
  }
  
  // Cập nhật phương thức shareScreen
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
      } else {
        // Bắt đầu chia sẻ màn hình
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: true // Thêm audio nếu cần
        });
        
        // Dừng các track hiện tại
        if (this.localStream) {
          this.localStream.getTracks().forEach(track => track.stop());
        }
        
        this.localStream = screenStream;
      }
      
      // Cập nhật stream
      await this.updateLocalStream();
      this.isScreenSharing = !this.isScreenSharing;
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  }
  
  // Cập nhật phương thức toggleCamera
  async toggleCamera(): Promise<void> {
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      this.isCameraOn = !this.isCameraOn;
    }
  }
  
  // Cập nhật phương thức toggleMic
  async toggleMic(): Promise<void> {
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      this.isMicOn = !this.isMicOn;
    }
  }
  // ... rest of your existing methods (toggleCamera, toggleMic, etc.) ...

  ngOnDestroy() {
    // Cleanup streams and connections
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    this.participants.forEach(participant => {
      if (participant.peerConnection) {
        participant.peerConnection.close();
      }
      if (participant.stream) {
        participant.stream.getTracks().forEach(track => track.stop());
      }
    });

    // Leave room
    this.videoCallService.leaveRoom(this.roomId, this.userId);
  }
}