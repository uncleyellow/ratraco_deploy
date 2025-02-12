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
    // q:any="khánh";
    selected;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;



    searchControl = new FormControl();
    options = [
      { value: 'sheetcmt0', label: 'Tổng hợp doanh thu' },
      { value: 'THCL', label: 'Tổng chêch lệnh' },
      { value: 'test', label: 'Test' },
      { value: 'TTVTHHND', label: 'Tình Hình Vận Tải Hàng Nội Địa' },
      { value: 'TTVTHHQT', label: 'Tình Hình Vận Tải Hàng Quốc Tế' },
      { value: 'TLDTVT', label: 'Tổng Lượng Dự Trữ Vận Tải' },
      { value: 'DTRTV', label: 'Doanh Thu Ròng Từ Vận Tải' },
      { value: 'LNRTV', label: 'Lợi Nhuận Ròng Từ Vận Tải' },
      { value: 'TXep', label: 'Tấn xếp' },
      { value: 'DTkm', label: 'Đoàn tàu km' },
      { value: 'TKMTT', label: 'Tấn km tổng trọng' },
      { value: 'Don/do', label: 'Lượt dồn/dỡ' },
      { value: 'DTND', label: 'Doanh Thu Nội địa' },
      { value: 'DTQT', label: 'Doanh Thu Quốc tế' },
      { value: 'XRN', label: 'Sản lượng Xuất Khẩu' },
      { value: 'NRN', label: 'Sản lượng nhập khẩu' },
      { value: 'tyleRN', label: 'Tỷ lệ rỗng nặng' },
      { value: 'DTNHKS', label: 'Doanh thu NHKH Cây Xoài' },
      { value: 'LNNHKS', label: 'Lợi nhuận NHKS Cây Xoài' },
      { value: 'DTRLG', label: 'Doanh thu RLG' },
      { value: 'LNRLG', label: 'Lợi nhuận RLG' },
      { value: 'DTRSL', label: 'Doanh thu RSL' },
      { value: 'LNRSL', label: 'Lợi nhuận RSL' },
      { value: 'DTRTD', label: 'Doanh thu RTD' },
      { value: 'LNRTD', label: 'Lợi nhuận RTD' },
      { value: 'DTGRL', label: 'Doanh thu Greenline' },
      { value: 'LNGRL', label: 'Lợi nhuận Greenline' },
      { value: 'MB', label: 'Trung tâm vận tải miền Bắc' },
      { value: 'MT', label: 'Trung tâm vận tải miền Trung' },
      { value: 'MN', label: 'Trung tâm vận tải miền Nam' },
      { value: 'SL2023', label: 'Sản lượng 2023' },
      { value: 'SL2024', label: 'Sản lượng 2024' },
      { value: 'SL2025', label: 'Sản lượng 2025' },
      { value: 'Tong_hop', label: 'Tổng hợp' },
      { value: 'KH_Chay_Tau_2025', label: 'Kế hoạch chạy tàu' }
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
        if(item === 'Tong_hop'){
          serviceMethod = this.excelService.getSheetSum();
          this.excelService.getSheetSum().subscribe((response) => {
            debugger
            this.displayedColumns = response.headers; // Cột tiêu đề
            this.dataSource = new MatTableDataSource(response.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          return
        }
        if (item === 'KH_Chay_Tau_2025') {
          serviceMethod = this.excelService.getSheetPlan2025();
          this.excelService.getSheetPlan2025().subscribe((response) => {
        
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
  
        else if (item === 'sheetcmt0') {
          this.dataHeaderTable = "d"
          this.excelService.getSheetData(item).subscribe((response: any) => {
            this.commentData = response.data; // Lấy mảng từ API response
            console.log(this.commentData);
          });
          console.log(this.commentData)
          serviceMethod = this.excelService.getSheet2b0Data();
        }
    
 



        if (serviceMethod) {
          serviceMethod.subscribe((blob) => {
            this.data = blob.data.slice(1).map((row: any[]) => {











              

              const rowObj: any = {};
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