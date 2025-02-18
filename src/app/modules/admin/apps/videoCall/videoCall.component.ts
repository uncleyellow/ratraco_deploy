import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VideoCallService } from 'app/shared/services/video-call.services';

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
    peerConnections: any = {};
    @ViewChild('localVideo') localVideo!: ElementRef;

    constructor(private videoCallService: VideoCallService) {}
  
    ngOnInit(): void {
      // Khởi tạo kết nối WebRTC và lấy stream của camera/microphone
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        this.localStream = stream;
      });
  
      // Lắng nghe danh sách người tham gia
      this.videoCallService.participants$.subscribe((participants) => {
        this.participants = participants;
      });
  
      // Tham gia phòng
      const roomId = 'meetingRoom1'; // ID phòng
      const participant = { id: 'user1', name: 'User 1' }; // Thông tin người tham gia
      this.videoCallService.joinRoom(roomId, participant);
    }

    ngAfterViewInit() {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          this.localVideo.nativeElement.srcObject = stream;
          this.localVideo.nativeElement.play();
        })
        .catch(error => console.error("Lỗi camera:", error));
    }
    
    toggleCamera(): void {
      if (this.localStream) {
        this.isCameraOn = !this.isCameraOn;
        this.localStream.getTracks().forEach(track => {
          if (track.kind === 'video') {
            track.enabled = this.isCameraOn;
          }
        });
      }
    }
  
    toggleMic(): void {
      if (this.localStream) {
        this.isMicOn = !this.isMicOn;
        this.localStream.getTracks().forEach(track => {
          if (track.kind === 'audio') {
            track.enabled = this.isMicOn;
          }
        });
      }
    }
  
    shareScreen(): void {
      if (this.isScreenSharing) {
        // Dừng chia sẻ màn hình
        this.isScreenSharing = false;
      } else {
        // Chia sẻ màn hình
        navigator.mediaDevices.getDisplayMedia({ video: true }).then((screenStream) => {
          this.localStream?.getTracks().forEach(track => track.stop());  // Dừng video hiện tại
          this.localStream = screenStream;
          this.isScreenSharing = true;
        });
      }
    }
  
    startRecording(): void {
      if (this.isRecording) {
        // Dừng ghi hình
        this.isRecording = false;
      } else {
        // Bắt đầu ghi hình
        this.isRecording = true;
      }
    }


    async startCamera() {
      try {
        // Lấy quyền truy cập camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    
        // Gán stream vào thẻ video
        const videoElement = document.getElementById('localVideo') as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.play();
        } else {
          console.error("Không tìm thấy thẻ video để hiển thị camera!");
        }
    
        console.log("Camera đã bật thành công!");
      } catch (error) {
        console.error("Lỗi khi bật camera:", error);
      }
    }
    
}