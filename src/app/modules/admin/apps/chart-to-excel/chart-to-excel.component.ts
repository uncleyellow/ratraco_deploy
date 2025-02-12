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

@Component({
  selector: 'app-chart-to-excel',
  templateUrl: './chart-to-excel.component.html',
  styleUrls: ['./chart-to-excel.component.scss'],
})
export class ChartToExcelComponent implements OnInit {
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

  ngOnInit(): void {
    this.getSheetData(this.selected);
  }

  getSheetData(item: string) {
    let serviceMethod;
    if (item === 'KQSXKD') {
      serviceMethod = this.excelService.getSheet1Data();
    } else if (item === 'TTVTHHND') {
      serviceMethod = this.excelService.getSheet2Data();
    } else if (item === 'TTVTHHQT') {
      serviceMethod = this.excelService.getSheet3Data();
    }
    else if (item === 'TLDTVT') {
      serviceMethod = this.excelService.getSheet4Data();
    }
    else if (item === 'TTVTHHQTM') {
      serviceMethod = this.excelService.getSheet5Data();
    }
    else if (item === 'DTNHKS') {
      serviceMethod = this.excelService.getSheet6Data();
    }
    else if (item === 'LNNHKS') {
      serviceMethod = this.excelService.getSheet7Data();
    }
    else if (item === 'TTDTTH2024') {
      serviceMethod = this.excelService.getSheet9Data();
    }
    else if (item === 'DTRLGT2024') {
      serviceMethod = this.excelService.getSheet10Data();
    }
    else if (item === 'LNRLGT2024') {
      serviceMethod = this.excelService.getSheet11Data();
    }
    else if (item === 'TLDTCCLHVC') {
      serviceMethod = this.excelService.getSheet12Data();
    }
    else if (item === 'DTRSLT2024') {
      serviceMethod = this.excelService.getSheet13Data();
    }
    else if (item === 'LNRSLT122024') {
      serviceMethod = this.excelService.getSheet14Data();
    }
    else if (item === 'TLDTCLHVC2024') {
      serviceMethod = this.excelService.getSheet16Data();
    }
    else if (item === 'DTRTDT122024') {
      serviceMethod = this.excelService.getSheet15Data();
    }
    else if (item === 'LNRTDT122024') {
      serviceMethod = this.excelService.getSheet17Data();
    }
    else if (item === 'TTDTCLDV') {
      serviceMethod = this.excelService.getSheet18Data();
    }
    else if (item === 'DTRTV') {
      serviceMethod = this.excelService.getSheet19Data();
    }
    else if (item === 'LNRTV') {
      serviceMethod = this.excelService.getSheet23Data();
    }
    else if (item === 'TTDTTHT122024') {
      serviceMethod = this.excelService.getSheet24Data();
    }
    



    else if (item === 'THDT') {
      serviceMethod = this.excelService.getSheet2b0Data();
    }

    
    else if (item === 'THCL') {
      serviceMethod = this.excelService.getSheet2b1Data();
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


  // addNewTable(){
  //   if(!this.isOpen){
  //     this.isOpen = true
  //   }
  //   else{
  //     this.isOpen = true
  //   }
  // }


  addNewTable() {
    if (this.chartTables.length < 3) {
      this.chartTables.push(this.chartTables.length + 1);
    }
  }
  
  removeTable(index: number) {
    this.chartTables.splice(index, 1);
  }
}

