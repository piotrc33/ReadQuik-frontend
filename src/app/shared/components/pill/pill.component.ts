import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'pill',
  templateUrl: './pill.component.html',
  styleUrls: ['./pill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PillComponent {
  isActive = input<boolean>(false);
  clickable = input<boolean>(false);

  clicked = output();

  handleClick() {
    if (!this.clickable()) return;
    this.clicked.emit();
  }
}
