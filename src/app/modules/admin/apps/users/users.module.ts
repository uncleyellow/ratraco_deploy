import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { NgxFileDropModule } from 'ngx-file-drop';

import { MaterialModule } from 'app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { UsersComponent } from './users.component';
import { usersRoutes } from './users.routing';

@NgModule({
    declarations: [
        UsersComponent
    ],
    imports     : [
        RouterModule.forChild(usersRoutes),
        SharedModule,
        NgxFileDropModule,
        MaterialModule,
        ReactiveFormsModule,
        FuseScrollbarModule
    ]
})
export class UsersModule
{
}
