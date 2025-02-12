import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { GoogleSheetsService } from "app/shared/services/excel.services";
import { MixedChartComponent } from "../bar-chart/bar-chart.component";
import { LineBarChartComponent } from "../line-bar-chart/line-bar-chart.component";
import { LineChartComponent } from "../line-chart/line-chart.component";
import { PieChartComponent } from "../pie-chart/pie-chart.component";
import { PolarChartComponent } from "../polar-chart/polar-chart.component";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Observable, startWith, map } from "rxjs";

@Component({
    selector: 'app-chart-table',
    templateUrl: './chart-table.component.html',
    styleUrls: ['./chart-table.component.scss'],
  })


export class ChartTableComponent implements OnInit{
  commentData
  dataHeaderTable
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
    searchControl = new FormControl();
    options = [
      { value: 'sheetb0', label: 'Tổng doanh thu' },
      { value: 'sheetb1', label: 'Tổng chêch lệnh' },
      // { value: 'test', label: 'Test' },
      { value: 'sheetb2', label: 'chi phí điều hành' },
      { value: 'sheetb3', label: 'Tấn Xếp hàng hóa' },
      { value: 'sheetb4', label: 'Đoàn tàu.km' },
      { value: 'sheetb5', label: 'Tấn km tổng trọng' },
      { value: 'sheetb6', label: 'Xe dồn/dỡ' },
      { value: 'sheetb7', label: 'Doanh Thu Nội địa' },
      { value: 'sheetb8', label: 'Doanh Thu Quốc tế' },
      { value: 'sheetb9', label: 'Sản lượng Xuất Khẩu' },
      { value: 'sheetb10', label: 'Sản lượng nhập khẩu' },
      { value: 'sheetb11', label: 'Tỷ lệ rỗng nặng' },
      { value: 'sheetb12', label: 'Doanh thu NHKH Cây Xoài' },
      { value: 'sheetb13', label: 'Lợi nhuận NHKS Cây Xoài' },
      { value: 'sheetb14', label: 'Doanh thu RLG' },
      { value: 'sheetb15', label: 'Lợi nhuận RLG' },
      { value: 'sheetb16', label: 'Doanh thu RSL' },
      { value: 'sheetb17', label: 'Lợi nhuận RSL' },
      { value: 'sheetb18', label: 'Doanh thu RTV' },
      { value: 'sheetb19', label: 'Lợi nhuận RTV' },
      { value: 'sheetb20', label: 'Doanh thu RTD' },
      { value: 'sheetb21', label: 'Lợi nhuận RTD' },
      { value: 'sheetb22', label: 'Doanh thu Greenline' },
      { value: 'sheetb23', label: 'Lợi nhuận Greenline' },
      { value: 'sheetb24', label: 'Trung tâm vận tải miền Bắc' },
      { value: 'sheetb25', label: 'Trung tâm vận tải miền Trung' },
      { value: 'sheetb26', label: 'Trung tâm vận tải miền Nam' },
      { value: 'sheetb27', label: 'Sản lượng 2023' },
      { value: 'sheetb28', label: 'Sản lượng 2024' },
      { value: 'sheetb29', label: 'Sản lượng 2025' },
      { value: 'full', label: 'Tổng hợp' },
      { value: 'runPlan', label: 'Kế hoạch chạy tàu' }
    ];
    
  filteredOptions!: Observable<{ value: string, label: string }[]>;
  selectedTable: string = '';
    constructor(
        private excelService: GoogleSheetsService,
        private cdr: ChangeDetectorRef,
    ){

    }
    ngOnInit(): void {
      this.filteredOptions = this.searchControl.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? this._filter(value) : this.options))
      );
        this.getSheetData(this.selected);
      }
      private _filter(value: string): { value: string, label: string }[] {
        const filterValue = value.toLowerCase();
        return this.options.filter(option => option.label.toLowerCase().includes(filterValue));
      }
    
      displayFn(option?: { value: string, label: string }): string {
        return option ? option.label : '';
      }
    
      onOptionSelected(event: MatAutocompleteSelectedEvent) {
        const selectedValue = event.option.value; // Lấy giá trị từ option đã chọn
        this.selectedTable = selectedValue.value;
        this.getSheetData(this.selectedTable);
      }

      isHeaderRow(row): boolean {
        return row["STT"] === "I" || row["STT"] === "II" || row["STT"] === "III";
      }
      
      isBoldRow(row): boolean {
        return row["STT"] && typeof row["STT"] === "number";
      }

      getSheetData(item: string) {
        let serviceMethod;
        this.dataHeaderTable = "d"
        
        if(item === 'full'){
          serviceMethod = this.excelService.getSheetData(item);
          this.excelService.getSheetData(item).subscribe((response) => {
            this.displayedColumns = response.headers; // Cột tiêu đề
            this.dataSource = new MatTableDataSource(response.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          return
        }
        if (item === 'runPlan') {
          serviceMethod = this.excelService.getSheetData(item);
          this.excelService.getSheetData(item).subscribe((response) => {
        
            // Kiểm tra response.headers có hợp lệ không
            if (!response.headers || response.headers.length === 0) {
              console.error("No headers received from API");
              return;
            }
        
            this.displayedColumns = response.headers.filter(col => col); // Loại bỏ cột undefined
            this.dataSource = new MatTableDataSource(response.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          return;
        }
      
        else if(item){
          serviceMethod = this.excelService.getSheetData(item);
        }
  
        else if (item === 'sheetb0') {
          this.dataHeaderTable = "d"
          this.excelService.getSheetData('sheetcmt0').subscribe((response: any) => {
            this.commentData = response.data; // Lấy mảng từ API response
            console.log(this.commentData);
          });
          console.log(this.commentData)
          serviceMethod = this.excelService.getSheetData(item);
          // serviceMethod = this.excelService.getSheet2b0Data();
        }

        if (serviceMethod) {
          serviceMethod.subscribe((blob) => {
            this.data = blob.data.slice(1).map((row: any[]) => {
              const rowObj = {};
              blob.data[0].forEach((header: string, index: number) => {
                const columnHeader = header.trim() !== "" ? header : `Column${index + 1}`;
    
                let value = row[index];

                // Chuyển số thập phân sai thành số nguyên
                if (typeof value === "string" && /^\d+\.\d{3}$/.test(value)) {
                  value = parseInt(value.replace('.', ''), 10); // Loại bỏ dấu "." nếu nó không phải số thập phân thực sự
                } else if (!isNaN(value) && typeof value === "string") {
                  value = parseFloat(value.replace(',', '.')); // Chuyển dấu "," thành "." cho số thập phân thực
                }
                rowObj[columnHeader] = value;
              });
              return rowObj;
            });
     
            this.displayedColumns = blob.data[0].map((header: string, index: number) =>
              header || `Column${index + 1}`
            );
      
            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
      
            // Cập nhật lại biểu đồ
            this.refreshCharts();
          });
        }
      }
      
    
      refreshCharts() {
        setTimeout(() => {
          if (this.mixedChart && this.chartType.includes('Mixed')) this.mixedChart.renderChart();
          if (this.lineChart && this.chartType.includes('Line')) this.lineChart.renderChart();
          if (this.pieChart && this.chartType.includes('Pie')) this.pieChart.renderChart();
          if (this.polarChart && this.chartType.includes('Area')) this.polarChart.renderChart();
          if (this.lineBarChart && this.chartType.includes('MixedChart')) this.lineBarChart.renderChart();
    
          this.cdr.detectChanges();
        }, 300);
      }
    
      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
    
      // Cập nhật danh sách biểu đồ được chọn
      getMultipleChartData(selectedCharts: string[]) {
        this.chartType = selectedCharts;
        
        this.refreshCharts();
      }

    formatNumber(num: number): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}