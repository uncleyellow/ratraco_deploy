import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts';
@Component({
  selector: 'app-mixed-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class MixedChartComponent implements OnChanges {
  @Input() chartData: any[] = []; // Nhận dữ liệu từ cha
  @Input() dataHeaderTable;
  nameHeaderTable;
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef; // Gắn với phần tử HTML


  private chart: ApexCharts | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chartData && changes.chartData.currentValue) {
      this.renderChart();
    }
  }

  renderChart(): void {
    // Add header table names for each condition

    if(this.dataHeaderTable === "TXep"){
      this.nameHeaderTable = "vạn tấn";
    }

    if(this.dataHeaderTable === "DTkm"){

      this.nameHeaderTable = "Đoàn tầu. km";
    }
    if(this.dataHeaderTable === "TKMTT"){
      this.nameHeaderTable = "Vạn tấn.km TT";
    }
    if(this.dataHeaderTable === "Don/do"){
      this.nameHeaderTable = "lượt";
    }
    if(this.dataHeaderTable === "XRN"){
      this.nameHeaderTable = "Xuất Rỗng";
    }
    if(this.dataHeaderTable === "NRN"){
      this.nameHeaderTable = "Nhập Rỗng";
    }
    if(this.dataHeaderTable === "tyleRN"){
      this.nameHeaderTable = "Tỷ lệ Rỗng";
    }
    if(this.dataHeaderTable === "MB"){
      this.nameHeaderTable = "Miền Bắc";
    }
    if(this.dataHeaderTable === "MT"){
      this.nameHeaderTable = "Miền Trung";
    }
    if(this.dataHeaderTable === "MN"){
      this.nameHeaderTable = "Miền Nam";
    
    }

    if(this.dataHeaderTable === "d"){
        this.nameHeaderTable = "Triệu đồng";
    }
    if (!this.chartData) return;

    let categories: string[] = [];
    let series: any[] = [];
    let chartOptions: ApexCharts.ApexOptions;

    // Trường hợp 1: Array of objects

    if (this.chartData.length > 1) {
        const rawData = this.chartData;
        categories = Object.keys(rawData[0]).filter(key => key !== 'Column1');
    
        series = rawData.map((row, index) => ({
            name: row.Column1, // Tên series là giá trị của 'Column1'
            data: categories.map(year => row[year]), // Dữ liệu của từng dòng
        }));
    
        chartOptions = {
            chart: { 
                height: 400, 
                type: 'bar'
            },
            colors: [ "#2196F3","#ED7D31", "#FF8C00", "#9C27B0", "#FF5722", "#795548"], // Màu cho từng dòng
            plotOptions: { 
                bar: { 
                    borderRadius: 4, 
                    columnWidth: '60%',
                    distributed: false, // Mỗi dòng có 1 màu, không phải từng cột
                    dataLabels: { 
                        position: "top" 
                    }
                }
            },
            legend: {
                show: true,
                position: 'bottom'
            },
            xaxis: {
                categories: categories // Nhãn trục X
            }
        };
    }
    
    
    // Trường hợp 2: Single series with multiple columns
     if (this.chartData.length === 1) {
        const rawData = this.chartData;
        categories = Object.keys(rawData[0]).filter(key => key !== 'Column1');
        series = rawData.map((row, index) => ({
            name: row.Column1,
            data: categories.map(year => row[year]),
        }));

        chartOptions = {
            chart: { 
                height: 400, 

                type: 'bar'
            },
            theme: {
                monochrome: {
                    enabled: false
                }
            },
            plotOptions: { 
                bar: { 
                    borderRadius: 4, 
                    columnWidth: '60%',
                    dataLabels: { 
                        position: "top"
                    },
                    distributed: true
                }
            },
            colors: ["#4CAF50", "#2196F3", "#ED7D31", "#9C27B0", "#FF5722", "#795548"],
            legend: {
                show: false
            }
        };
    }

    // Common options for both cases
    const commonOptions: ApexCharts.ApexOptions = {
        xaxis: { 
            categories: categories,
            title: { 
                text: 'Năm',
                style: { fontSize: '14px', fontWeight: 'bold', color: '#333' },
                offsetY: 100,
                offsetX: 0
            }
        },
        yaxis: { 
            title: { 
                text: "Giá trị (" + this.nameHeaderTable + ")",
                style: { fontSize: '12px', fontWeight: 'bold', color: '#333' },
                offsetX: -5
            },
            labels: {
                formatter: (val: number) => val.toLocaleString('vi-VN') + ''
            }
        },
        legend: { position: 'bottom' },
        dataLabels: { 
            offsetY: -20,
            enabled: true,
            style: {
                fontSize: '12px',
                colors: ['#333']
            },
            formatter: (val: number) => val.toLocaleString('vi-VN') + ''
        },
        tooltip: {
            y: {
                formatter: (val: number) => val.toLocaleString('vi-VN')
            }
        },
        colors: chartOptions.colors,  // Thêm nhiều màu hơn
        series: series
    };

    // Merge options
    const finalOptions = { ...chartOptions, ...commonOptions };

    if (this.chart) {
        this.chart.updateOptions(finalOptions);
    } else {
        this.chart = new ApexCharts(this.chartContainer.nativeElement, finalOptions);
        this.chart.render();
    }

    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
}



/**
 * Xử lý chuyển đổi số từ string sang số đúng format
 */
private parseNumber(value: string | number | null): number {
    if (value === null || value === undefined) return 0;
    let strValue = value.toString().trim();

    if (strValue.includes(',')) {
        // Case: number has decimal point (using comma in Vietnamese format)
        // Example: "1.234,567" -> 1234.567
        return parseFloat(strValue.replace(/\./g, '').replace(',', '.'));
    } else {
        // Case: whole number with thousand separators
        // Example: "1.000.000" -> 1000000
        return parseFloat(strValue.replace(/\./g, ''));
    }
}





}
