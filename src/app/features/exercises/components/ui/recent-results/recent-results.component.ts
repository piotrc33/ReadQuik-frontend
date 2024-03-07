import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Signal } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { RecentResultI } from 'src/app/api/model/progress/recent-result.i';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'recent-results',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslocoModule],
  templateUrl: './recent-results.component.html',
  styleUrl: './recent-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentResultsComponent {
  @Input()
  recentResults?: Signal<RecentResultI[]>;
}
