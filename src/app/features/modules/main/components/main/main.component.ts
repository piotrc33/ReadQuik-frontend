import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { TextService } from '../../../exercises/services/text.service';
import { ExercisesStateService } from '../../../exercises/services/exercises-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnDestroy {
  subs: Subscription[] = [];

  constructor(
    public readonly authService: AuthService,
    private router: Router,
    public text: TextService,
    readonly state: ExercisesStateService
  ) {
    this.subs.push(text.wordFragments$.subscribe(frags => {
      state.wordFragments = frags;
    }));
    this.subs.push(text.bookFragmentsWithNewlines$.subscribe(frags => {
      state.bookFragmentsWithNewlines = frags;
    }))
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
