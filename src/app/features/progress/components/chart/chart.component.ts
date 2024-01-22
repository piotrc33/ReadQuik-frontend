import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Chart, Point } from 'chart.js';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnChanges {
  translocoService = inject(TranslocoService);

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  @Input()
  dataPoints: Point[] = [];

  @Input()
  regressionPoints: Point[] = [];

  chart?: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.chart) return;

    this.chart.destroy();
    this.createChart();
  }

  createChart() {
    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    this.chart = new Chart(ctx, {
      data: {
        datasets: [
          {
            data: this.dataPoints,
            label: this.translocoService.translate('speeds'),
            pointRadius: 10,
            backgroundColor: '#9BD0F5',
            xAxisID: 'xAxis',
            yAxisID: 'yAxis',
            type: 'scatter',
          },
          {
            data: this.regressionPoints,
            label: this.translocoService.translate('tendency'),
            pointRadius: 0,
            pointHitRadius: 0,
            borderColor: '#a3a3a3',
            xAxisID: 'xAxis',
            yAxisID: 'yAxis',
            type: 'line',
            borderDash: [6, 6],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          xAxis: {
            min: 0,
            max: this.dataPoints[this.dataPoints.length - 1].x + 0.5,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: this.translocoService.translate('trialNumber'),
            },
          },
          yAxis: {
            min: 0,
            suggestedMax: this.getMaxY() + 100,
            title: {
              display: true,
              text: this.translocoService.translate('wpmLabel'),
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: this.translocoService.translate('resultsChartTitle'),
          },
          legend: {
            display: false
          }
        },
      },
    });
  }

  getMaxY() {
    return Math.max(...this.dataPoints.map(point => point.y));
  }
}
