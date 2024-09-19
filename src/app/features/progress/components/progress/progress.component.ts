import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { differenceInDays, isSameDay, parseISO } from 'date-fns';
import { DataPoint, linear } from 'regression';
import { ResultsFacade } from 'src/app/shared/services/results/results.facade';
import { TimeSpanT } from './time-span.t';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {
  readonly #resultsFacade = inject(ResultsFacade);
  readonly timeSpan = signal<TimeSpanT>('all');

  updateTimeSpan(newSpan: TimeSpanT) {
    this.timeSpan.set(newSpan);
  }

  readonly points = computed(() => {
    const dateFiltered = this.#resultsFacade.allResults().filter(res => {
      switch (this.timeSpan()) {
        case 'all':
          return true;
        case 'week':
          return differenceInDays(new Date(), parseISO(res.date)) < 7;
        case 'day':
          return isSameDay(new Date(), parseISO(res.date));
      }
    });

    return dateFiltered.map((item, index) => {
      return {
        x: index + 1,
        y: item.wpm,
      };
    });
  });

  readonly regressionPoints = computed(() => {
    const dataPoints: DataPoint[] = this.points().map(point => [
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
  });
}
