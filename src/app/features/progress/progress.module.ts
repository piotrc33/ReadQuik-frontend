import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressComponent } from './components/progress/progress.component';
import { ProgressRoutingModule } from './progress-routing.module';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './components/chart/chart.component';
import { TranslocoModule } from '@ngneat/transloco';



@NgModule({
  declarations: [
    ProgressComponent,
    ChartComponent,
  ],
  imports: [
    CommonModule,
    ProgressRoutingModule,
    NgChartsModule,
    TranslocoModule
  ]
})
export class ProgressModule { }
