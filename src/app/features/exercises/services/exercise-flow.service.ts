import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Observable,
  Subject,
  filter,
  map,
  merge,
  scan,
  share,
  tap,
} from 'rxjs';
import { BookService } from '../../library/services/book.service';
import { ExerciseModeT } from '../model/exercise-mode.type';
import { KeyboardService } from './keyboard.service';
import { SaveService } from './save.service';

@Injectable()
export class ExerciseFlowService {
  readonly #keyService = inject(KeyboardService);
  readonly #bookService = inject(BookService);
  readonly #saveService = inject(SaveService);

  exerciseMode: WritableSignal<ExerciseModeT> = signal('manual');
  startTime!: number;

  readonly nextAction$ = new Subject<void>();
  readonly manualMoveToNextPhrase$: Observable<void> = merge(
    this.#keyService.forwardingPress$,
    this.nextAction$
  ).pipe(
    filter(() => this.exerciseMode() === 'manual'),
    share()
  );

  readonly autoNextAction$ = new Subject<void>();
  readonly movedToNextPhrase$: Observable<void> = merge(
    this.autoNextAction$,
    this.manualMoveToNextPhrase$
  ).pipe(
    filter(() => this.exerciseOpened()),
    share()
  );

  readonly resetPhraseNumberAction$ = new Subject<void>();
  private readonly phraseNumberActions$: Observable<number> = merge(
    this.movedToNextPhrase$.pipe(map(() => 1)),
    this.resetPhraseNumberAction$.pipe(map(() => 0))
  );
  private readonly phraseNumber$: Observable<number> =
    this.phraseNumberActions$.pipe(
      scan((total, increment) => {
        if (increment === 0) return 0;
        return total + increment;
      })
    );
  readonly phraseNumber: Signal<number> = toSignal(this.phraseNumber$, {
    initialValue: 0,
  });

  completedLastPage$ = new Subject<void>();
  readonly completedManualMode$ = merge(
    this.completedLastPage$,
    this.manualMoveToNextPhrase$.pipe(
      filter(
        () => this.phraseNumber() === this.#bookService.wordPhrases().length
      )
    )
  ).pipe(
    share(),
    tap(() => {
      this.#saveService.getUserWpmAction.next(this.startTime);
    })
  );

  readonly exitAction$ = new Subject<void>();
  readonly quitExercise$ = merge(this.#keyService.exitPress$, this.exitAction$);

  private readonly closedExercise$ = merge(
    this.quitExercise$,
    this.completedManualMode$
  ).pipe(
    tap(() => {
      this.resetPhraseNumberAction$.next();
      this.exerciseMode.set('manual');
    }),
    share()
  );

  readonly completed: Signal<boolean> = toSignal(
    merge(
      this.completedManualMode$.pipe(map(() => true)),
      this.closedExercise$.pipe(map(() => false))
    ),
    {
      initialValue: false,
    }
  );

  readonly startExerciseAction$ = new Subject<void>();
  readonly exerciseOpened = toSignal(
    merge(
      this.startExerciseAction$.pipe(
        map(() => true),
        tap(() => (this.startTime = Date.now()))
      ),
      this.closedExercise$.pipe(map(() => false))
    ),
    { initialValue: false }
  );

  readonly completedAutoMode$: Observable<boolean> = merge(
    this.closedExercise$.pipe(map(() => false)),
    this.autoNextAction$
      .pipe(
        filter(
          () => this.phraseNumber() === this.#bookService.wordPhrases().length
        ),
        tap(() => this.resetPhraseNumberAction$.next()),
        map(() => true)
      )
      .pipe(
        tap(() => this.exerciseMode.set('manual')),
        share()
      )
  );
  readonly completedAutoMode: Signal<boolean> = toSignal(
    this.completedAutoMode$,
    { initialValue: false }
  );
}
