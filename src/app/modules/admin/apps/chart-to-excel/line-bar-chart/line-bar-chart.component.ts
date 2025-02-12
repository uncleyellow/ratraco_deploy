import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-line-bar-chart',
  templateUrl: './line-bar-chart.component.html',
  styleUrls: ['./line-bar-chart.component.scss']
})
export class LineBarChartComponent implements OnChanges {
  @Input() chartData = []; // Nhận dữ liệu từ component cha
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef; // Liên kết phần tử HTML

  private chart: ApexCharts | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chartData && changes.chartData.currentValue) {
      this.renderChart();
    }
  }

//   renderChart(): void {
//     if (!this.chartData || this.chartData.length === 0) return;

//     const rawData = this.chartData;
//     const isContainerType = rawData[0]?.Column1 === "Vận chuyển Container";

//     let chartData;

//     if (isContainerType) {
//         chartData = {
//             categories: rawData.map(item => item.Column1),
//             series: [{
//                 name: 'Chỉ tiêu',
//                 data: rawData.map(item => this.parseNumber(item["Chỉ tiêu"]))
//             }]
//         };
//     } else {
//         const categories = Object.keys(rawData[0])
//             .filter(key => key !== 'Column1' && key !== '1 + 2'); // ["2023", "2024", "2025 (dự kiến)"]

//         const series = rawData.map(row => ({
//             name: row.Column1,
//             data: categories.map(year => this.parseNumber(row[year]))
//         }));

//         chartData = { categories, series };
//     }

//     // Lấy giá trị min/max để căn chỉnh trục Y
//     
//     const allValues = chartData.series.flatMap(s => s.data);
// const maxY = Math.max(...allValues) * 1.2; // Tăng 20% để không sát mép trên
// const minY = Math.min(...allValues) < 0 
//     ? Math.min(...allValues) - (maxY * 0.2) // Đảm bảo trục âm không bị "lùn"
//     : 0; // Nếu không có số âm thì min là 0

//     const colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#546E7A"];

//     const chartOptions: ApexCharts.ApexOptions = {
//         chart: { height: 400, type: 'line', zoom: { enabled: false } },
//         dataLabels: { 
//             enabled: true, 
//             formatter: val => val.toLocaleString('vi-VN') // Hiển thị số theo format VN
//         },
//         stroke: { width: 2 },
//         xaxis: { 
//             categories: chartData.categories,
//             title: { 
//                 text: isContainerType ? 'Loại vận chuyển' : 'Năm',
//                 offsetY: 100,  
//                 style: { fontSize: '14px', fontWeight: 'bold', color: '#333' }
//             },
//             position: 'bottom', 
//             axisBorder: { show: true }, 
//             axisTicks: { show: true }
//         },
//         yaxis: { 
//             title: { text: isContainerType ? 'Số lượng' : 'Giá trị' },
//             min: minY,
//             max: maxY,
//             forceNiceScale: true 
//         },
//         plotOptions: { 
//             bar: { 
//                 borderRadius: 4, 
//                 horizontal: false, 
//                 columnWidth: '60%',
//                 dataLabels: { position: "top" },
//                 colors: {
//                     ranges: [
//                         { from: -Infinity, to: 0, color: "#FF4560" },
//                         { from: 0, to: Infinity, color: "#008FFB" }
//                     ]
//                 }
//             }
//         },
//         colors: colors,
//         series: chartData.series.map((s, index) => ({
//             ...s,
//             color: colors[index % colors.length]
//         }))
//     };

//     if (this.chart) {
//         this.chart.updateOptions(chartOptions);
//     } else {
//         this.chart = new ApexCharts(this.chartContainer.nativeElement, chartOptions);
//         this.chart.render();
//     }
// }

renderChart(): void {
  if (!this.chartData || this.chartData.length === 0) return;

  const rawData = this.chartData[0]; // Lấy object đầu tiên
  const categories = Object.keys(rawData).filter(key => key !== "Column1"); // Lấy danh sách năm
  const seriesData = categories.map(year => this.parseNumber(rawData[year])); // Lấy giá trị doanh thu

  const chartOptions: ApexCharts.ApexOptions = {
      chart: { height: 400, type: 'bar' },
      xaxis: { categories: categories, title: { 
        text: 'Năm' ,
        style: { fontSize: '12px', fontWeight: 'bold', color: '#333' },
      } 
    },
      yaxis: { title: { 
        text: 'Doanh Thu' ,
        style: { fontSize: '12px', fontWeight: 'bold', color: '#333' },
        offsetX: -5
      } 
    },
      stroke: { width: [2, 0] },
      plotOptions: { bar: { columnWidth: '50%' } },
      colors: ["#008FFB", "#00E396"],
      series: [
          {
              name: 'Giá trị',
              type: 'line',
              data: seriesData
          },
          {
              name: 'Giá trị',
              type: 'bar',
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
  const strValue = value.toString().trim();

  if (strValue.includes(',')) {
      // Số thực: Giữ nguyên, thay ',' bằng '.'
      return parseFloat(strValue.replace(',', '.'));
  } else {
      // Số nguyên: Loại bỏ dấu chấm (.)
      return parseFloat(strValue.replace('.', ''));
  }
}

}
