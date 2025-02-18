import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FuseScrollbarModule } from "@fuse/directives/scrollbar";
import { MaterialModule } from "app/material/material.module";
import { SharedModule } from "app/shared/shared.module";
import { NgxFileDropModule } from "ngx-file-drop";
import { MeetingRoomComponent } from "./videoCall.component";
import { videoCallRoutes } from "./videoCall.routing";

@NgModule({
    declarations: [
        MeetingRoomComponent,
    ],
    imports     : [
        RouterModule.forChild(videoCallRoutes),
        SharedModule,
        NgxFileDropModule,
        MaterialModule,
        ReactiveFormsModule,
        FuseScrollbarModule
    ]
})
export class VideoCallModule
{
}
