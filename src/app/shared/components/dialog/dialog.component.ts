import { Component, ElementRef, EventEmitter, HostListener, Output, inject } from '@angular/core';
import { ExercisesStateService } from 'src/app/features/exercises/services/exercises-state.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  readonly #state = inject(ExercisesStateService);
  readonly #el = inject(ElementRef);

  @Output()
  close = new EventEmitter<void>();

  ngOnInit(): void {
    this.#state.updatePanelElement(
      this.#el.nativeElement.querySelector('.dialog-content')
    );
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey() {
    this.close.emit();
  }
}
