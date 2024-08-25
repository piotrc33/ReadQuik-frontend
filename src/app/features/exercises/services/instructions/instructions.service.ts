import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject, map, merge, switchMap } from 'rxjs';
import { CurrentExerciseService } from 'src/app/shared/services/current-exercise.service';

@Injectable()
export class InstructionsService {
  readonly #http = inject(HttpClient);
  readonly #currentExerciseService = inject(CurrentExerciseService);
  readonly #cookieService = inject(CookieService);

  constructor() {
    effect(() => {
      if (this.instructionsOpened()) {
        this.#cookieService.set(
          `instruction${this.#currentExerciseService.exerciseNumber()}Opened`,
          'true',
          2,
          '/'
        );
      }
    });
  }

  private readonly shouldOpenInstruction$ =
    this.#currentExerciseService.exerciseNumber$.pipe(
      map((exNum) => {
        const cookieValue: string = this.#cookieService.get(
          `instruction${exNum}Opened`
        );
        const instructionsOpenedInPast: boolean = cookieValue
          ? JSON.parse(cookieValue)
          : false;
        return !instructionsOpenedInPast;
      })
    );

  readonly openInstructionsAction$ = new Subject<boolean>();
  readonly instructionsOpened: Signal<boolean> = toSignal(
    merge(this.openInstructionsAction$, this.shouldOpenInstruction$),
    { initialValue: false }
  );

  readonly currentInstructionObject = toSignal(
    this.#currentExerciseService.exerciseNumber$.pipe(
      switchMap((exNum) => this.getCurrentExerciseInstructions(exNum))
    )
  );

  private getCurrentExerciseInstructions(exNum: number): Observable<any> {
    return this.#http
      .get<any>('assets/i18n/en.json')
      .pipe(map((val) => val.instructions['instruction' + exNum]));
  }
}
