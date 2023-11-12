import { Component } from '@angular/core';
import { Exercise } from '../../model/exercise';
import { ExercisesStateService } from '../../services/exercises-state.service';
import { KeyboardService } from './../../services/keyboard.service';

@Component({
  selector: 'exercise1',
  templateUrl: './exercise1.component.html',
  styleUrls: ['./exercise1.component.scss'],
})
export class Exercise1Component extends Exercise {
  constructor(
    keyService: KeyboardService,
    state: ExercisesStateService,
  ) {
    super(keyService, state);
  }
}
