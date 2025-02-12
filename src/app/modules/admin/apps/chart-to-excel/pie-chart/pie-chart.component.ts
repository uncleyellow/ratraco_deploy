import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges {
  @Input() chartData = []; // Nhận dữ liệu từ component cha
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef; // Liên kết với phần tử HTML

  private chart: ApexCharts | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chartData && changes.chartData.currentValue) {
      this.renderChart();
    }
  }

  // renderChart(): void {
  //   if (!this.chartData || this.chartData.length === 0) return;

  //   const rawData = this.chartData;
  //   const isContainerType = rawData[0]?.Column1 === "Vận chuyển Container";

  //   let labels: string[] = [];
  //   let series: number[] = [];

  //   if (isContainerType) {
  //     // Nếu dữ liệu là theo loại vận chuyển
  //     labels = rawData.map(item => item.Column1);
  //     series = rawData.map(item => parseFloat(item["Chỉ tiêu"] || '0'));
  //   } else {
  //     // Nếu dữ liệu theo thời gian, lấy tổng từng dòng
  //     labels = rawData.map(row => row.Column1);
  //     series = rawData.map(row => {
  //       return Object.keys(row)
  //         .filter(key => key !== 'Column1' && key !== '1 + 2')
  //         .reduce((sum, key) => sum + parseFloat(row[key] || '0'), 0);
  //     });
  //   }

  //   // Cấu hình biểu đồ
  //   const chartOptions: ApexCharts.ApexOptions = {
  //     chart: { height: 400, type: 'pie' },
  //     labels: labels, // Đặt tên danh mục
  //     series: series, // Dữ liệu phải là một mảng số
  //     dataLabels: { enabled: true, formatter: val => val.toLocaleString() },
  //     colors: ['#008FFB', '#FF4560', '#00E396', '#FEB019', '#775DD0'], // Màu sắc
  //     legend: { position: 'bottom' }
  //   };

  //   // Hủy biểu đồ cũ trước khi vẽ lại
  //   if (this.chart) {
  //     this.chart.destroy();
  //   }

  //   this.chart = new ApexCharts(this.chartContainer.nativeElement, chartOptions);
  //   this.chart.render();
  // }

renderChart(): void {
    if (!this.chartData || this.chartData.length === 0) return;

    const rawData = this.chartData;

    // Lấy danh sách năm từ dòng đầu tiên
    const categories = Object.keys(rawData[0]).filter(key => key !== 'Column1');

    // Lấy dữ liệu của chỉ tiêu đầu tiên (hoặc có thể chọn chỉ tiêu mong muốn)
    const firstRow = rawData[0];

    const series = categories.map(year => this.parseNumber(firstRow[year]));

    const colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#546E7A"];

    const chartOptions: ApexCharts.ApexOptions = {
        chart: { 
            height: 400, 
            type: 'pie' 
        },
        labels: categories, // Hiển thị năm làm nhãn
        colors: colors,
        legend: { position: 'bottom' },
        dataLabels: { 
            enabled: true,
            formatter: (val, opts) => {
                const value = Number(val);
                return ` ${value.toFixed(1)}%`;
            }
        },
        tooltip: {
            y: {
                formatter: (val: number) => val.toLocaleString('vi-VN')
            }
        },
        series: series // Giá trị doanh thu của từng năm
    };

    if (this.chart) {
        this.chart.updateOptions(chartOptions);
    } else {
        this.chart = new ApexCharts(this.chartContainer.nativeElement, chartOptions);
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
        // Số thực: Giữ nguyên, thay ',' bằng '.'
        return parseFloat(strValue.replace(',', '.'));
    } else {
        // Số nguyên: Loại bỏ dấu chấm (.)
        return parseFloat(strValue.replace('.', ''));
    }
}


}
