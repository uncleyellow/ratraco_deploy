import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
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
import { Observable, startWith, map } from "rxjs";
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-chart-to-excel',
  templateUrl: './chart-to-excel.component.html',
  styleUrls: ['./chart-to-excel.component.scss'],
})
export class ChartToExcelComponent implements OnInit{
  chartTables: number[] = [1]; // Ban đầu có 1 biểu đồ
  commentData
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

  searchControl = new FormControl();
  options = [
    { value: 'sheetb0', label: 'Nhận xét 1' },
    { value: 'sheetb1', label: 'Nhận xét 2' },
  ];
  selectedTable: string = '';
  filteredOptions!: Observable<{ value: string, label: string }[]>;

  selected;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  constructor(
    private excelService: GoogleSheetsService,
    private cdr: ChangeDetectorRef
  ) {

  }
  ngOnInit(): void {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? this._filter(value) : this.options))
    );
  }
  addNewTable() {
    if (this.chartTables.length < 3) {
      this.chartTables.push(this.chartTables.length + 1);
    }
  }
  private _filter(value: string): { value: string, label: string }[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.label.toLowerCase().includes(filterValue));
  }
  removeTable(index: number) {
    this.chartTables.splice(index, 1);
  }
  displayFn(option?: { value: string, label: string }): string {
    return option ? option.label : '';
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedValue = event.option.value; // Lấy giá trị từ option đã chọn
    this.selectedTable = selectedValue.value;
    debugger
    this.getCommentData(this.selectedTable)
  }

  getCommentData(item){
    if(item === 'sheetb0'){
      this.excelService.getSheetData('sheetcmt0').subscribe((response: any) => {
        this.commentData = response.data; // Lấy mảng từ API response
        console.log(this.commentData);
      });
    }
  }
}

