import { Component} from '@angular/core';
import { ExercisesStateService } from '../../../services/exercises-state.service';

@Component({
  selector: 'app-exercise-panel',
  templateUrl: './exercise-panel.component.html',
  styleUrls: ['./exercise-panel.component.scss'],
})
export class ExercisePanelComponent {
  constructor(public state: ExercisesStateService) {}

  nextPhrase(): void {
    this.state.phraseNumber++;
    if (this.state.finished) {
      this.state.end();
    }
  }
}
