import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Observable,
  combineLatest,
  filter,
  map,
  merge,
  scan,
  switchMap,
  timer,
} from 'rxjs';
import { AutoExerciseBase } from '../../model/auto-exercise-base';
import { PercentBarService } from '../../services/percent-bar.service';
import { TextService } from '../../services/text.service';

@Component({
  selector: 'exercise7',
  templateUrl: './exercise7.component.html',
  styleUrls: ['./exercise7.component.scss'],
})
export class Exercise7Component
  extends AutoExerciseBase
  implements AfterViewInit
{
  readonly textService = inject(TextService);
  readonly el = inject(ElementRef);
  readonly #percentService = inject(PercentBarService);

  exerciseTextElement?: HTMLElement;
  textBox?: DOMRect;
  panelBox?: DOMRect;
  toScroll: number = 0;

  private readonly panelBox$ = timer(2).pipe(
    map(() => this.state.panelContentElement?.getBoundingClientRect())
  );
  readonly panelBoxSignal = toSignal(this.panelBox$);

  private readonly activeBox$ = this.flowService.movedToNextPhrase$.pipe(
    switchMap(() => timer(2)),
    map(() =>
      this.el.nativeElement.querySelector('.active')?.getBoundingClientRect()
    )
  );

  private readonly nextPage$: Observable<boolean> = combineLatest([
    this.activeBox$,
    this.panelBox$,
  ]).pipe(
    filter(([activeBox, panelBox]) => {
      return activeBox?.y! > panelBox?.bottom!;
    }),
    map(() => true)
  );

  private readonly pageYPosition$ = merge(
    this.flowService.manualMoveToNextPhrase$.pipe(map(() => 1)),
    this.nextPage$.pipe(map(() => 1)),
    this.flowService.completedAutoMode$.pipe(map(() => 0))
  ).pipe(
    scan((position, val) => {
      if (val === 0) return 0;
      return position - this.panelBoxSignal()?.height!;
    }, 0)
  );
  readonly pageYPosition = toSignal(this.pageYPosition$);

  private readonly pagedProgressPercent$ = this.pageYPosition$.pipe(
    map((yPos) => {
      const percent = Math.round((-yPos / this.toScroll) * 100);
      return percent > 100 ? 100 : percent;
    })
  );

  private readonly isLastPage$ = this.flowService.manualMoveToNextPhrase$.pipe(
    filter(() => this.isLastPage())
  );

  constructor() {
    super();
    this.subs.add = this.pagedProgressPercent$.subscribe((percent) => {
      this.#percentService.pagedPercent.set(percent);
    });

    this.subs.add = this.isLastPage$.subscribe(() => {
      this.flowService.completedLastPage$.next();
    });

    this.subs.add = this.flowService.completedAutoMode$.subscribe(() => {
      this.#percentService.paged.set(true);
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.#percentService.paged.set(false);
    this.#percentService.pagedPercent.set(0);
  }

  wordIndexes: number[] = [];
  override ngOnInit(): void {
    super.ngOnInit();
    for (let i = 0; i < this.phrasesWithNewlines().length; i++) {
      if (!this.textService.isNewline(this.phrasesWithNewlines()[i])) {
        this.wordIndexes.push(i);
      }
    }

    this.#percentService.paged.set(this.mode === 'manual' ? true : false);
  }

  ngAfterViewInit(): void {
    this.panelBox = this.state.panelContentElement?.getBoundingClientRect();
    this.exerciseTextElement = this.el.nativeElement.querySelector('.text');
    this.textBox = this.exerciseTextElement?.getBoundingClientRect();
    this.toScroll = this.textBox!.bottom - this.panelBox!.bottom + 360;
  }

  isLastPage(): boolean {
    this.textBox = this.exerciseTextElement?.getBoundingClientRect();
    const result = this.textBox!.bottom < this.panelBox!.bottom;
    return result;
  }
}
