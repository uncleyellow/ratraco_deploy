import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { VideoCallService } from 'app/shared/services/video-call.services';
import { v4 as uuidv4 } from 'uuid';
import { io } from 'socket.io-client';
import { environment} from '../../../../shared/environment';

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
    socket: any;

    @ViewChildren('localVideo') localVideos!: QueryList<ElementRef>;
    constructor(private videoCallService: VideoCallService) {
      this.socket = io(`${environment.api.url}`);// Kết nối đến server
    }
  
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
      this.socket.on('newParticipant', (data: any) => {
        this.handleNewParticipant(data.stream, data.name);
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
      this.startCamera(); // Gọi startCamera sau khi view đã được khởi tạo
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
        
        // Gán stream của local video vào participant
        this.localStream = stream;
  
        // Thêm người tham gia đầu tiên là local participant
        const localParticipant = { id: 'localUser', name: 'You', stream, isLocal: true };
        this.participants.push(localParticipant);
  
        // Thông báo cho server khi người dùng tham gia
        this.socket.emit('joinRoom', 'You'); // Gửi tên người tham gia cho server
  
        console.log("Camera đã bật thành công!");
      } catch (error) {
        console.error("Lỗi khi bật camera:", error);
      }
    }
  
    
     // Giả sử có một hàm để xử lý người tham gia mới vào (remote user)
  handleNewParticipant(participantStream: MediaStream, participantName: string) {
    // Tạo đối tượng participant cho người tham gia mới
    const remoteParticipant = { id: participantName, name: participantName, stream: participantStream, isLocal: false };
    
    // Thêm người tham gia mới vào danh sách
    this.participants.push(remoteParticipant);
  }

  // Giả lập việc một người tham gia mới vào
  simulateNewParticipant() {
    // Giả sử có một stream từ người tham gia khác (remote)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.handleNewParticipant(stream, 'Participant 2');
      })
      .catch(err => console.error("Lỗi khi nhận stream của người tham gia mới:", err));
  }

    
}