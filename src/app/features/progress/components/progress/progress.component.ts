import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Point } from 'chart.js/dist/core/core.controller';
import { differenceInDays, isSameDay, parseISO } from 'date-fns';
import { DataPoint, linear } from 'regression';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { ResultsService } from 'src/app/shared/services/results.service';
import { TimeSpanT } from './time-span.t';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {
  private readonly resultsService = inject(ResultsService);
  readonly allResults$ = this.resultsService.getAllResults();

  timeSpan$ = new BehaviorSubject<TimeSpanT>('all');

  points$: Observable<Point[]> = combineLatest([
    this.allResults$,
    this.timeSpan$,
  ]).pipe(
    map(([results, timeSpan]) => {
      const dateFiltered = results.filter(res => {
        switch(timeSpan) {
          case('all'): return true;
          case('week'): return differenceInDays(new Date(), parseISO(res.date)) < 7;
          case('day'): return isSameDay(new Date(), parseISO(res.date));
        }
      });

      return dateFiltered.map((item, index) => {
        return {
          x: index + 1,
          y: item.wpm,
        };
      });
    })
  );

  regressionPoints$: Observable<Point[]> = this.points$.pipe(
    map((results) => {
      const dataPoints: DataPoint[] = results.map(point => [
        point.x,
        point.y,
      ]);

      const result = linear(dataPoints, { order: 2 });

      const regressionLinePoints = result.points.map((item, index) => {
        return {
          x: index + 1,
          y: item[1],
        };
      });

      return regressionLinePoints;
    })
  );
}
