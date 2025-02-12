import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnChanges {
  @Input() chartData = []; // Nhận dữ liệu từ cha
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef; // Gắn với phần tử HTML

  private chart: ApexCharts | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chartData && changes.chartData.currentValue) {
      this.renderChart();
    }
  }

  renderChart(): void {
    if (!this.chartData || this.chartData.length === 0) return;

    const rawData = this.chartData;
    const isContainerType = rawData[0]?.Column1 === "Vận chuyển Container";

    let chartData;

    if (isContainerType) {
        chartData = {
            categories: rawData.map(item => item.Column1),
            series: [{
                name: 'Chỉ tiêu',
                data: rawData.map(item => this.parseNumber(item["Chỉ tiêu"]))
            }]
        };
    } else {
        const categories = Object.keys(rawData[0])
            .filter(key => key !== 'Column1' && key !== '1 + 2'); // Lấy danh sách năm

        const series = rawData.map(row => ({
            name: row.Column1, // Tên chỉ tiêu
            data: categories.map(year => this.parseNumber(row[year])) // Dữ liệu theo từng năm
        }));

        chartData = { categories, series };
    }

    // Lấy giá trị min/max để căn chỉnh trục Y
    const allValues = chartData.series.flatMap(s => s.data);
    const maxY = Math.max(...allValues) * 1.2; // Tăng 20% để không sát mép trên
    const minY = Math.min(...allValues) < 0 
        ? Math.min(...allValues) - (maxY * 0.2) // Đảm bảo trục âm không bị "lùn"
        : 0; // Nếu không có số âm thì min là 0

    const colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#546E7A"];

    const chartOptions: ApexCharts.ApexOptions = {
        chart: { 
            height: 400, 
            type: 'line', // 👉 Chuyển thành Line Chart
            zoom: { enabled: false }
        },
        dataLabels: { 
            enabled: true, 
            formatter: val => val.toLocaleString('vi-VN') // Hiển thị số theo format VN
        },
        stroke: { 
            width: 3, // 👉 Tăng độ dày đường kẻ
            curve: 'smooth' // 👉 Làm đường cong mượt hơn
        },
        markers: {
            size: 5, // 👉 Hiển thị điểm dữ liệu lớn hơn
            colors: colors,
            strokeWidth: 2,
            hover: { size: 7 }
        },
        xaxis: { 
            categories: chartData.categories,
            title: { 
                text: isContainerType ? 'Loại vận chuyển' : 'Năm',
                offsetY: 10,  
                style: { fontSize: '14px', fontWeight: 'bold', color: '#333' }
            },
            position: 'bottom', 
            axisBorder: { show: true }, 
            axisTicks: { show: true }
        },
        yaxis: { 
            title: { text: isContainerType ? 'Số lượng' : 'Giá trị' },
            min: minY,
            max: maxY,
            forceNiceScale: true 
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: val => val.toLocaleString('vi-VN')
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right'
        },
        colors: colors,
        series: chartData.series.map((s, index) => ({
            ...s,
            color: colors[index % colors.length]
        }))
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
