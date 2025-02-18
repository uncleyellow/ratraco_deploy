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
    peerConnections: any = {};
    @ViewChildren('localVideo') localVideos!: QueryList<ElementRef>;
    constructor(private videoCallService: VideoCallService) {}
  
    // ngOnInit(): void {
    //   // Khởi tạo kết nối WebRTC và lấy stream của camera/microphone
    //   navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    //     this.localStream = stream;
    //   });
  
    //   // Lắng nghe danh sách người tham gia
    //   this.videoCallService.participants$.subscribe((participants) => {
    //     this.participants = participants;
    //   });
  
    //   // Tham gia phòng
    //   const roomId = 'meetingRoom1'; // ID phòng

    //   this.videoCallService.joinRoom(roomId, this.participants);
    // }


    ngOnInit(): void {
      const uniqueId = uuidv4();
    
      // Lấy quyền truy cập vào camera/microphone
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        this.localStream = stream;
    
        // Tham gia vào phòng với thông tin participant
        this.videoCallService.joinRoom('meetingRoom1', { id: uniqueId, name: 'You', stream });
    
        // Lắng nghe sự thay đổi trong danh sách participants
        this.videoCallService.participants$.subscribe((participants) => {
          this.participants = participants;
    
          // Lặp qua danh sách participants và tạo video cho từng người
          this.participants.forEach((participant) => {
            if (participant.id !== uniqueId && !participant.videoElement) {
              // Tạo phần tử video cho participant nếu chưa có
              this.createVideoElement(participant);
            }
          });
        });
      }).catch((error) => {
        console.error('Không thể truy cập camera/microphone: ', error);
      });
    }
    
    createVideoElement(participant) {
      const videoContainer = document.createElement('div');
      videoContainer.classList.add('video-container');
      
      const videoElement = document.createElement('video');
      videoElement.srcObject = participant.stream;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.classList.add('w-full', 'h-full', 'object-cover', 'rounded-md');
    
      // Lưu lại videoElement vào participant
      participant.videoElement = videoElement;
    
      // Thêm video vào DOM
      videoContainer.appendChild(videoElement);
      document.querySelector('.video-grid').appendChild(videoContainer);
    }
    

    ngAfterViewInit(): void {
      // Lắng nghe sự thay đổi của localVideos (khi video elements được cập nhật trong DOM)
      this.localVideos.changes.subscribe(() => {
        if (this.localVideos.length > 0) {
          this.localVideos.toArray().forEach(videoElement => {
            const video: HTMLVideoElement = videoElement.nativeElement;
  
            // Đảm bảo rằng chỉ gán stream của local cho video của chính bạn
            if (!video.srcObject && this.localStream) {
              video.srcObject = this.localStream;
              video.play();
            }
          });
        }
      });
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
    
        // Kiểm tra nếu có các video element và gán stream vào từng video
        if (this.localVideos && this.localVideos.length > 0) {
          this.localVideos.toArray().forEach(videoElement => {
            const video: HTMLVideoElement = videoElement.nativeElement;
            video.srcObject = stream;
            video.play();
          });
        } else {
          console.error("Không tìm thấy thẻ video để hiển thị camera!");
        }
    
        console.log("Camera đã bật thành công!");
      } catch (error) {
        console.error("Lỗi khi bật camera:", error);
      }
    }
    

    
}