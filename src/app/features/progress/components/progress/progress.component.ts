import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Point } from 'chart.js/dist/core/core.controller';
import { Observable, map } from 'rxjs';
import { ResultsService } from 'src/app/services/results.service';
import { DataPoint, linear } from 'regression';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {
  private resultsService = inject(ResultsService);

  allResults$ = this.resultsService.getAllResults();
  points$: Observable<Point[]> = this.allResults$.pipe(
    map((results) =>
      results.map((item, index) => {
        return {
          x: index + 1,
          y: item.wpm,
        };
      })
    )
  );

  regressionPoints$: Observable<Point[]> = this.allResults$.pipe(
    map((results) => {
      const dataPoints: DataPoint[] = results.map((item, index) => [index + 1, item.wpm]);

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
