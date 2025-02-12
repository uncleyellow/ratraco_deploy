import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { MaterialModule } from 'app/material/material.module';
import { ExampleComponent } from 'app/modules/admin/apps/example/example.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgxFileDropModule } from 'ngx-file-drop';

const exampleRoutes: Route[] = [
    {
        path     : '',
        component: ExampleComponent
    }
];

@NgModule({
    declarations: [
        ExampleComponent
    ],
    imports     : [
        RouterModule.forChild(exampleRoutes),
        SharedModule,
        NgxFileDropModule,
        MaterialModule,
        ReactiveFormsModule,
        FuseScrollbarModule
    ]
})
export class ExampleModule
{
}
