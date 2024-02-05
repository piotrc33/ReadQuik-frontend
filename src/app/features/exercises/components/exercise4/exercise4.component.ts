import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit
} from '@angular/core';
import { AutoExerciseBase } from '../../model/auto-exercise-base';
import { TextService } from '../../services/text.service';

@Component({
  selector: 'exercise4',
  templateUrl: './exercise4.component.html',
  styleUrls: ['./exercise4.component.scss'],
})
export class Exercise4Component
  extends AutoExerciseBase
  implements AfterViewChecked, OnInit
{
  wordIndexes: number[] = [];

  constructor(
    public readonly textService: TextService,
    private el: ElementRef,
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    for (
      let i = 0;
      i < this.state.bookService.phrasesWithNewlines().length;
      i++
    ) {
      if (
        !this.textService.isNewline(
          this.state.bookService.phrasesWithNewlines()[i]
        )
      ) {
        this.wordIndexes.push(i);
      }
    }
  }

  ngAfterViewChecked(): void {
    if (!this.state.finished) {
      const activeElement = this.el.nativeElement.querySelector('.active');
      this.state.activeElement = activeElement;
    }
  }
}
