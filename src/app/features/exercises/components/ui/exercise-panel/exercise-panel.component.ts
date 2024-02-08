import { CurrentExerciseService } from './../../../../../shared/services/current-exercise.service';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { ExercisesStateService } from '../../../services/exercises-state.service';

@Component({
  selector: 'exercise-panel',
  templateUrl: './exercise-panel.component.html',
  styleUrls: ['./exercise-panel.component.scss'],
})
export class ExercisePanelComponent implements AfterViewInit {
  constructor(
    public state: ExercisesStateService,
    public currentExerciseService: CurrentExerciseService,
    private cdr: ChangeDetectorRef
  ) {}

  handleClick(): void {
    this.state.next$.next();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}
