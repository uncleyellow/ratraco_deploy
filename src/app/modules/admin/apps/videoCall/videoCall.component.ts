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
  saveStream
  constructor(private videoCallService: VideoCallService) {}

  ngOnInit() {
    this.initializeMediaStream();
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

      // Sau khi có localStream mới join room
      this.joinRoom();
      this.setupSignalHandlers();
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }
  private setupSignalHandlers() {
    this.videoCallService.onSignalReceived().subscribe(async (data) => {
      if (!data) return;
  
      const participant = this.participants.find(p => p.id === data.from);
      
      if (data.type === 'offer') {
        if (!participant) {
          // Tạo participant mới nếu chưa có
          const peerConnection = await this.createPeerConnection(data.from);
          const newParticipant: Participant = {
            id: data.from,
            name: 'Remote User',
            stream: new MediaStream(),
            isLocal: false,
            peerConnection
          };
          this.participants.push(newParticipant);
        }
        
        // Xử lý offer
        await participant?.peerConnection?.setRemoteDescription(new RTCSessionDescription(data.data));
        const answer = await participant?.peerConnection?.createAnswer();
        await participant?.peerConnection?.setLocalDescription(answer);
        
        this.videoCallService.sendSignal({
          type: 'answer',
          data: answer,
          to: data.from
        });
      }
      
      if (data.type === 'answer' && participant) {
        await participant.peerConnection?.setRemoteDescription(new RTCSessionDescription(data.data));
      }
      
      if (data.type === 'ice' && participant) {
        await participant.peerConnection?.addIceCandidate(new RTCIceCandidate(data.data));
      }
    });
  }
  private joinRoom() {
    this.videoCallService.joinRoom(this.roomId, {
      id: this.userId,
      name: 'You'
    });
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
  
    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      const participant = this.participants.find(p => p.id === participantId);
      if (participant) {
        // Use the actual remote stream instead of creating new one
        participant.stream = event.streams[0];
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
    if (!this.localStream) {
      console.warn("⚠️ Local stream bị mất, thử lấy lại...");
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      console.log("✅ Lấy lại localStream thành công:", this.localStream);
    }
  
    const localParticipant = this.participants.find(p => p.isLocal);
    if (localParticipant) {
      localParticipant.stream = this.localStream;
    }
  
    for (const participant of this.participants) {
      if (!participant.isLocal && participant.peerConnection) {
        const senders = participant.peerConnection.getSenders();
        senders.forEach(sender => participant.peerConnection?.removeTrack(sender));
  
        this.localStream.getTracks().forEach(track => {
          participant.peerConnection?.addTrack(track, this.localStream!);
        });
      }
    }
  }
  
  

  ngOnDestroy(): void {
    debugger
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