import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { RecentResultI } from 'src/app/api/model/progress/recent-result.i';
import { ResultsService } from 'src/app/shared/services/results.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'recent-results',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslocoModule, RouterModule],
  templateUrl: './recent-results.component.html',
  styleUrl: './recent-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentResultsComponent implements OnInit {
  readonly #resultsService = inject(ResultsService);

  ngOnInit(): void {
    this.#resultsService.loadRecentResultsAction$.next();
  }

  get recentResults(): RecentResultI[] {
    return this.#resultsService.recentResults();
  }
}
