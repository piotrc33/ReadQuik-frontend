import { KeyboardService } from './../../services/keyboard.service';
import { Component } from '@angular/core';
import { TextService } from '../../services/text.service';
import { Exercise } from '../../model/exercise';

@Component({
  selector: 'exercise1',
  templateUrl: './exercise1.component.html',
  styleUrls: ['./exercise1.component.scss'],
})
export class Exercise1Component extends Exercise {

  constructor(textService: TextService, keyService: KeyboardService) {
    super(textService, keyService);
  }

  override handleForwardingKey(): void {
      this.nextFragment();
  }

  nextFragment() {
    this.phraseNumber++;
  }
}
