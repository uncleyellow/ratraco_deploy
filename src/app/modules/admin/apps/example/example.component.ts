/* eslint-disable @angular-eslint/component-selector */
import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ExampleComponent {
  soundcloudUrl: string = '';
  youtubeUrl: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;
  downloadLink: string | null = null;

  constructor(private http: HttpClient) {}

  fetchDownloadSoundCloud() {
    this.downloadMusic(this.soundcloudUrl, 'soundcloud');
  }

  fetchDownloadYouTube() {
    this.downloadMusic(this.youtubeUrl, 'youtube');
  }

  private downloadMusic(url: string, type: 'soundcloud' | 'youtube') {
    if (!url.trim()) {
      this.errorMessage = 'Vui lòng nhập link!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.downloadLink = null;

    const apiUrl = `https://ratracobeexcel-production.up.railway.app/download/${type}?url=${url}`;

    this.http.get(apiUrl, {
      responseType: 'blob',
      withCredentials: true // Gửi cookies từ trình duyệt lên server
    }).subscribe({
      next: (blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        this.downloadLink = downloadUrl;

        // Tạo thẻ <a> để tải file
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${type}.mp3`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        
        // Hiển thị thông báo với SweetAlert2
        Swal.fire({
          title: "Tải nhạc thành công! Chị Vân Anh Nghe nhạc vui vẻ 🎵",
          width: 600,
          padding: "3em",
          color: "#716add",
          background: "#fff url(/images/trees.png)",
          backdrop: `
            rgba(0,0,123,0.4)
            url("https://i.gifer.com/origin/fd/fdf70f5f4989f9c08f033da50c38170e_w200.gif")
            left top
            no-repeat
          `
        });
      },
      error: () => {
        this.errorMessage = `Lỗi tải nhạc từ ${type}! Vui lòng thử lại.`;
        Swal.fire({
          title: "Lỗi tải nhạc!",
          text: "Vui lòng kiểm tra lại link.",
          icon: "error",
          confirmButtonText: "OK"
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
