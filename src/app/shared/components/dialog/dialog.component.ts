import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { ExercisesStateService } from 'src/app/features/exercises/services/exercises-state.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @Output()
  close = new EventEmitter<void>();

  constructor(public state: ExercisesStateService, private el: ElementRef) {}

  ngOnInit(): void {
    this.state.panelContentElement =
      this.el.nativeElement.querySelector('.dialog-content');
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey() {
    this.close.emit();
  }
}
