import { Component, OnInit } from '@angular/core';
import { Exercise } from '../../model/exercise';
import { TextService } from '../../services/text.service';
import { KeyboardService } from '../../services/keyboard.service';
import { ExercisesStateService } from '../../services/exercises-state.service';

@Component({
  selector: 'app-exercise4',
  templateUrl: './exercise4.component.html',
  styleUrls: ['./exercise4.component.scss'],
})
export class Exercise4Component extends Exercise {
  constructor(private state: ExercisesStateService, textService: TextService, keyService: KeyboardService) {
    super(textService, keyService);
  }

  override handleForwardingKey(): void {
    this.nextFragment();
    if(this.finished) {
      this.state.started = false;
    }
  }

  override nextFragment(): void {
    this.phraseNumber++;
  }
}