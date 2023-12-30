import { Component } from '@angular/core';
import { Exercise } from '../../model/exercise';

@Component({
  selector: 'exercise1',
  templateUrl: './exercise1.component.html',
  styleUrls: ['./exercise1.component.scss'],
})
export class Exercise1Component extends Exercise {
  constructor() {
    super();
  }
}
