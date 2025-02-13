/* eslint-disable @angular-eslint/component-selector */
import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ExampleComponent {
  soundcloudUrl: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;
  downloadLink: string | null = null;

  constructor(private http: HttpClient) {}

  fetchDownloadLink() {
    if (!this.soundcloudUrl.trim()) {
      this.errorMessage = 'Vui lòng nhập link SoundCloud!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.downloadLink = null;

    const apiUrl = `https://ratracobeexcel-production.up.railway.app/download/soundcloud?url=${this.soundcloudUrl}`;

    this.http.get(apiUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        this.downloadLink = url;

        // Tạo thẻ a để tải file
        const a = document.createElement('a');
        a.href = url;
        a.download = 'soundcloud.mp3';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.errorMessage = 'Lỗi tải nhạc! Vui lòng thử lại.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
