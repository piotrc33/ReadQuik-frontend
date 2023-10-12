import { Component } from '@angular/core';
import { ExercisesStateService } from '../../services/exercises-state.service';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})
export class ExercisesComponent {

  constructor(public state: ExercisesStateService) { }
}
