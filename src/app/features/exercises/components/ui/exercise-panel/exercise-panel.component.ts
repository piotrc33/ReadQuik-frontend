import { Component, inject } from '@angular/core';
import { ExerciseFlowService } from '../../../services/exercise-flow.service';
import { ExercisesStateService } from '../../../services/exercises-state.service';
import { PercentBarService } from '../../../services/percent-bar.service';
import { CurrentExerciseService } from './../../../../../shared/services/current-exercise.service';

@Component({
  selector: 'exercise-panel',
  templateUrl: './exercise-panel.component.html',
  styleUrls: ['./exercise-panel.component.scss'],
})
export class ExercisePanelComponent {
  public readonly flowService = inject(ExerciseFlowService);
  public readonly percentService = inject(PercentBarService);

  constructor(
    public state: ExercisesStateService,
    public currentExerciseService: CurrentExerciseService
  ) {}
}
