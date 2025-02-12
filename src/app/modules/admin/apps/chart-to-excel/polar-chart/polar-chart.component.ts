import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-polar-chart',
  templateUrl: './polar-chart.component.html',
  styleUrls: ['./polar-chart.component.scss']
})
export class PolarChartComponent implements OnChanges {
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

  //   let categories: string[] = [];
  //   let series: { name: string; data: number[] }[] = [];

  //   if (isContainerType) {
  //     // Nếu dữ liệu theo loại vận chuyển
  //     categories = rawData.map(item => item.Column1);
  //     series = [{
  //       name: 'Chỉ tiêu',
  //       data: rawData.map(item => parseFloat(item["Chỉ tiêu"] || '0'))
  //     }];
  //   } else {
  //     // Nếu dữ liệu theo thời gian
  //     categories = ['1 + 2', ...Object.keys(rawData[0]).filter(key => key !== 'Column1' && key !== '1 + 2')];
  //     series = rawData.map(row => ({
  //       name: row.Column1,
  //       data: categories.map(label => parseFloat(row[label] || '0'))
  //     }));
  //   }
  //   const colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#546E7A"];
  //   // Cấu hình biểu đồ Area
  //   const chartOptions: ApexCharts.ApexOptions = {
  //     chart: { height: 400, type: 'area', zoom: { enabled: false } },
  //     dataLabels: { enabled: true },
  //     stroke: { curve: 'smooth' },
  //     xaxis: { categories: categories, 
  //       title: { 
  //         text: isContainerType ? 'Loại vận chuyển' : 'Tháng',
  //         offsetY: 70,  // Đẩy chữ xuống xa hơn khỏi biểu đồ
  //         style: { fontSize: '14px', fontWeight: 'bold', color: '#333' }
  //       },
  //       position: 'bottom', 
  //       axisBorder: { show: true }, // Hiển thị đường kẻ trục X rõ ràng
  //       axisTicks: { show: true }   // Hiển thị vạch đánh dấu trên trục X
  //      },      yaxis: { title: { text: 'Giá trị' } },
  //     legend: { position: 'top' },
  //     colors: colors, // Gán danh sách màu sắc
  //     series: series
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

    const rawData = this.chartData[0]; // Lấy object đầu tiên
    const categories = Object.keys(rawData).filter(key => key !== "Column1"); // Lấy danh sách năm
    const seriesData = categories.map(year => this.parseNumber(rawData[year])); // Lấy giá trị doanh thu

    const chartOptions: ApexCharts.ApexOptions = {
        chart: { height: 400, type: 'area' },
        dataLabels: { enabled: true },
        stroke: { curve: 'smooth' },
        xaxis: { 
            categories: categories, 
            title: { text: 'Năm' }
        },
        yaxis: { title: { text: 'Doanh Thu' } },
        legend: { position: 'top' },
        colors: ["#008FFB", "#00E396"],
        series: [
            {
                name: 'Doanh Thu',
                data: seriesData
            }
        ]
    };

    if (this.chart) {
        this.chart.updateOptions(chartOptions);
    } else {
        this.chart = new ApexCharts(this.chartContainer.nativeElement, chartOptions);
        this.chart.render();
    }

     // Đảm bảo biểu đồ không bị vỡ layout
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
