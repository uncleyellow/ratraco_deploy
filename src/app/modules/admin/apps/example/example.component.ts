/* eslint-disable @angular-eslint/component-selector */
import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent
{ 
  trackUrl: string = '';
  downloadLink: string | null = null;

    /**
     * Constructor
     */
    constructor(
      private http: HttpClient
    )
    {

    }
    fetchDownloadLink() {
      if (!this.trackUrl) {
        alert('Vui lòng nhập link SoundCloud!');
        return;
      }
  
      const apiUrl = `https://soundcloudmp3.org/download?url=${this.trackUrl}`;
      
      this.http.get(apiUrl).subscribe((response: any) => {
        if (response && response.download_url) {
          this.downloadLink = response.download_url;
        } else {
          alert('Không tìm thấy link tải!');
        }
      });
    }
    
    
}
