/* eslint-disable @angular-eslint/component-selector */
import { Component, ViewEncapsulation } from '@angular/core';
import { UserService } from 'app/shared/services/users.services';

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent
{ 
    videoUrl = "";

    /**
     * Constructor
     */
    constructor(
        private userServices : UserService
    )
    {

    }
    download() {
        if (this.videoUrl.trim()) {
          this.userServices.downloadAudio(this.videoUrl);
        } else {
          alert("Nhập URL YouTube hợp lệ!");
        }
    }
}
