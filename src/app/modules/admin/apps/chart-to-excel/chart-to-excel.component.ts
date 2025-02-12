import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GoogleSheetsService } from 'app/shared/services/excel.services';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MixedChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { PolarChartComponent } from './polar-chart/polar-chart.component';
import { LineBarChartComponent } from './line-bar-chart/line-bar-chart.component';

@Component({
  selector: 'app-chart-to-excel',
  templateUrl: './chart-to-excel.component.html',
  styleUrls: ['./chart-to-excel.component.scss'],
})
export class ChartToExcelComponent {
  chartTables: number[] = [1]; // Ban đầu có 1 biểu đồ

  isOpen = false
  readonly dialog = inject(MatDialog);
  data: any[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  chartType: string[] = []; // Lưu danh sách các biểu đồ được chọn
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('mixedChart') mixedChart!: MixedChartComponent;
  @ViewChild('polarChart') polarChart!: PolarChartComponent;
  @ViewChild('lineChart') lineChart!: LineChartComponent;
  @ViewChild('pieChart') pieChart!: PieChartComponent;
  @ViewChild('lineBarChart') lineBarChart!: LineBarChartComponent;

  selected;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  constructor(
    private excelService: GoogleSheetsService,
    private cdr: ChangeDetectorRef
  ) {}

  addNewTable() {
    if (this.chartTables.length < 3) {
      this.chartTables.push(this.chartTables.length + 1);
    }
  }
  
  removeTable(index: number) {
    this.chartTables.splice(index, 1);
  }
}

