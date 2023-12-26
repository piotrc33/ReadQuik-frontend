import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pill',
  templateUrl: './pill.component.html',
  styleUrls: ['./pill.component.scss'],
})
export class PillComponent {
  @Input()
  clickable: boolean = false;

  @Output()
  clicked = new EventEmitter<void>();

  @Input()
  isActive: boolean = false;

  handleClick() {
    if (!this.clickable) return;
    this.clicked.emit();
    this.isActive = !this.isActive;
  }
}
