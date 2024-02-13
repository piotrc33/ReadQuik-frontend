import { Component, OnDestroy, inject } from '@angular/core';
import { SubscriptionContainer } from 'src/app/utils/subscription-container';
import { ExerciseFlowService } from '../services/exercise-flow.service';
import { ExercisesStateService } from '../services/exercises-state.service';
import { KeyboardService } from '../services/keyboard.service';

@Component({
  selector: 'app-exercise',
  template: '',
})
export class Exercise implements OnDestroy {
  public readonly keyService = inject(KeyboardService);
  public readonly state = inject(ExercisesStateService);
  protected readonly flowService = inject(ExerciseFlowService);
  subs = new SubscriptionContainer();


  ngOnDestroy(): void {
    this.subs.dispose();
  }
}
