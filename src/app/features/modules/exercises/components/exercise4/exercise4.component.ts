import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { timer } from 'rxjs';
import { ResultsService } from 'src/app/features/services/results.service';
import { SubscriptionContainer } from 'src/app/utils/subscription-container';
import { getAverageTimeoutMs } from 'src/app/utils/utils';
import { Exercise } from '../../model/exercise';
import { ExerciseModeT } from '../../model/exercise-mode.type';
import { TextService } from './../../services/text.service';

@Component({
  selector: 'exercise4',
  templateUrl: './exercise4.component.html',
  styleUrls: ['./exercise4.component.scss'],
})
export class Exercise4Component
  extends Exercise
  implements AfterViewChecked, OnInit
{
  @Input()
  mode: ExerciseModeT = 'manual';

  wordIndexes: number[] = [];

  subsContainer = new SubscriptionContainer();
  wpmSpeed?: number;

  constructor(
    public readonly textService: TextService,
    private el: ElementRef,
    private readonly resultsService: ResultsService
  ) {
    super();
  }

  ngOnInit(): void {
    for (
      let i = 0;
      i < this.state.bookService.phrasesWithNewlines.length;
      i++
    ) {
      if (
        !this.textService.isNewline(
          this.state.bookService.phrasesWithNewlines[i]
        )
      ) {
        this.wordIndexes.push(i);
      }
    }

    this.subsContainer.add = this.resultsService.last3Avg$.subscribe((val) => {
      this.wpmSpeed = val * 1.2;
    });

    this.state.exerciseMode = this.mode;
    if (this.mode === 'auto') {
      this.startAutoTimer();
    }
  }

  startAutoTimer(): void {
    if (this.state.bookService.currentSegment === null) {
      return;
    }
    this.subsContainer.add = timer(
      getAverageTimeoutMs(
        this.state.bookService.currentSegment.text.length,
        this.state.bookService.wordPhrases.length,
        this.wpmSpeed || 200
      )
    ).subscribe(() => {
      this.handleAutoNextFragment();
    });
  }

  handleAutoNextFragment(): void {
    this.nextFragment();
    if (this.state.finished) {
      this.reset();
      this.state.exerciseMode = 'manual';
      this.state.startTime = Date.now();
    } else {
      this.startAutoTimer();
    }
  }

  reset(): void {
    this.state.phraseNumber = 0;
    this.state.pageYPosition = 0;
  }

  ngAfterViewChecked(): void {
    if (!this.state.finished) {
      const activeElement = this.el.nativeElement.querySelector('.active');
      this.state.activeElement = activeElement;
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.state.pageYPosition = 0;
    this.state.exerciseMode = 'manual';
    this.subsContainer.dispose();
  }
}
