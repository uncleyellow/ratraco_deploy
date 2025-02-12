import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { ChartToExcelComponent } from './chart-to-excel.component';
import { chartToExcelRoutes } from './chart-to-excel.routing';
import { NgxFileDropModule } from 'ngx-file-drop';

import { MaterialModule } from 'app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MixedChartComponent } from './bar-chart/bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { PolarChartComponent } from './polar-chart/polar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { LineBarChartComponent } from './line-bar-chart/line-bar-chart.component';
import { ChartTableComponent } from './chart-table/chart-table.component';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';

@NgModule({
    declarations: [
        ChartToExcelComponent,
        MixedChartComponent,
        PieChartComponent,
        PolarChartComponent,
        LineChartComponent,
        LineBarChartComponent,
        ChartTableComponent
    ],
    imports     : [
        RouterModule.forChild(chartToExcelRoutes),
        SharedModule,
        NgxFileDropModule,
        MaterialModule,
        ReactiveFormsModule,
        FuseScrollbarModule
    ]
})
export class ChartToExcelModule
{
}
