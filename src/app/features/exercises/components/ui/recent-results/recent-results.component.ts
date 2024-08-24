import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { RecentResultI } from 'src/app/api/model/progress/recent-result.i';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecentResultsState } from '../../../services/recent-results/recent-results.state';

@Component({
  selector: 'recent-results',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslocoModule, RouterModule],
  templateUrl: './recent-results.component.html',
  styleUrl: './recent-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentResultsComponent  {
  readonly #recentResultsState = inject(RecentResultsState);

  get recentResults(): RecentResultI[] {
    return this.#recentResultsState.recentResults();
  }
}
