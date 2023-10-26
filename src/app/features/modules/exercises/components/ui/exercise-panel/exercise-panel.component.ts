import { Component, ElementRef } from '@angular/core';
import { ExercisesStateService } from '../../../services/exercises-state.service';

@Component({
  selector: 'app-exercise-panel',
  templateUrl: './exercise-panel.component.html',
  styleUrls: ['./exercise-panel.component.scss'],
})
export class ExercisePanelComponent {
  constructor(public state: ExercisesStateService, private el: ElementRef) {}

  ngOnInit(): void {
    this.state.panelContentElement =
      this.el.nativeElement.querySelector('.panel-content');
  }

  handleClick(): void {
    this.state.next$.next();
  }
}
