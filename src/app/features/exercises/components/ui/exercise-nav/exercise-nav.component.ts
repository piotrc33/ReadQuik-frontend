import { Component, Input } from '@angular/core';

@Component({
  selector: 'exercise-nav',
  templateUrl: './exercise-nav.component.html',
  styleUrls: ['./exercise-nav.component.scss']
})
export class ExerciseNavComponent {
  @Input()
  totalUnlocked: number = 1;
}
