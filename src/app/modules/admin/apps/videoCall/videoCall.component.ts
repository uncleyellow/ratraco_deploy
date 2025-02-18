import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { VideoCallService } from 'app/shared/services/video-call.services';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-meeting-room',
  templateUrl: './videoCall.component.html',
  styleUrls: ['./videoCall.component.scss']
})
export class MeetingRoomComponent implements OnInit {
  participants: any[] = [];
  isCameraOn: boolean = true;
  isMicOn: boolean = true;
  isScreenSharing: boolean = false;
  isRecording: boolean = false;
  localStream: MediaStream | null = null;
  peerConnections: { [key: string]: RTCPeerConnection } = {};
  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
  private roomId: string = 'meetingRoom1';
  private userId: string;

  constructor(private videoCallService: VideoCallService) {
    this.userId = uuidv4();
  }

  async ngOnInit() {
    try {
      // Get local stream
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      // Join room
      this.videoCallService.joinRoom(this.roomId, {
        id: this.userId,
        name: 'You',
      });

     // Listen for new participants
     this.videoCallService.participants$.subscribe(participants => {
      // Filter out current user from participants list
      this.participants = participants.filter(p => p.id !== this.userId);
      this.handleParticipantsUpdate(this.participants);
    });

      // Handle WebRTC signaling
      this.setupSignalingHandlers();
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  }


  ngAfterViewInit() {
    // Set local stream to video element
    if (this.myVideo && this.localStream) {
      this.myVideo.nativeElement.srcObject = this.localStream;
      this.myVideo.nativeElement.muted = true; // Mute local video to prevent echo
    }
  }

private handleParticipantsUpdate(participants: any[]) {
    // Create peer connections for new participants
    participants.forEach(participant => {
      if (!this.peerConnections[participant.id]) {
        this.createPeerConnection(participant.id);
      }
    });

    // Clean up old peer connections
    Object.keys(this.peerConnections).forEach(participantId => {
      if (!participants.find(p => p.id === participantId)) {
        this.peerConnections[participantId].close();
        delete this.peerConnections[participantId];
      }
    });
  }

  private async createPeerConnection(participantId: string): Promise<RTCPeerConnection> {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        if (this.localStream) {
          peerConnection.addTrack(track, this.localStream);
        }
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.videoCallService.sendIceCandidate({
          target: participantId,
          candidate: event.candidate
        });
      }
    };

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      const participant = this.participants.find(p => p.id === participantId);
      if (participant) {
        participant.stream = event.streams[0];
      }
    };

    this.peerConnections[participantId] = peerConnection;
    
    // Create and send offer
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      this.videoCallService.sendOffer({
        target: participantId,
        sdp: offer
      });
    } catch (err) {
      console.error('Error creating offer:', err);
    }

    return peerConnection;
  }

  private async setupSignalingHandlers() {
    // Handle incoming offers
    this.videoCallService.onOffer().subscribe(async ({ from, sdp }) => {
      let peerConnection = this.peerConnections[from];
      
      if (!peerConnection) {
        peerConnection = await this.createPeerConnection(from);
      }
      
      await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      
      // Create and send answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      this.videoCallService.sendAnswer({
        target: from,
        sdp: answer
      });
    });

    // Handle incoming answers
    this.videoCallService.onAnswer().subscribe(async ({ from, sdp }) => {
      const peerConnection = this.peerConnections[from];
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });

    // Handle incoming ICE candidates
    this.videoCallService.onIceCandidate().subscribe(({ from, candidate }) => {
      const peerConnection = this.peerConnections[from];
      if (peerConnection) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  }

  // Existing methods...
}