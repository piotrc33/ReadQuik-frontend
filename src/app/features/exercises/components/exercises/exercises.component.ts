import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ExercisesProgressStateService } from 'src/app/services/exercises-progress-state.service';
import { ResultsService } from 'src/app/services/results.service';
import { SubscriptionContainer } from 'src/app/utils/subscription-container';
import { ExercisesStateService } from '../../services/exercises-state.service';
import { InstructionsService } from '../../services/instructions.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
})
export class ExercisesComponent implements OnInit, AfterViewChecked, OnDestroy {
  instructionsOpened: boolean = false;
  readonly instructions$ = this.instructionService.getExerciseInstructions();

  subs = new SubscriptionContainer();

  currentExercise: Signal<number | undefined> = toSignal(this.state.currentExercise$);

  constructor(
    public readonly state: ExercisesStateService,
    public readonly resultsService: ResultsService,
    public readonly progressState: ExercisesProgressStateService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly instructionService: InstructionsService,
    private readonly cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.resultsService.updateRecentResults();

    const exerciseNumber = Number(this.router.url.split('/').pop());
    if (exerciseNumber) {
      this.state.currentExercise$.next(exerciseNumber);
    } else {
      this.state.currentExercise$.next(this.state.lastPracticed);
      this.router.navigate([`/app/exercises/${this.state.lastPracticed}`]);
    }

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const exNum = Number(e.url.split('/').pop());
        this.state.currentExercise$.next(exNum);
        if (e.url === '/app/exercises')
          this.router.navigate([`/app/exercises/${this.state.lastPracticed}`]);
      }
    });

    this.subs.add = this.state.currentExercise$.subscribe((val) => {
      const cookieValue = this.cookieService.get(`instruction${val}Opened`);
      const instructionsOpenedInPast = cookieValue
        ? JSON.parse(cookieValue)
        : false;
      if (!instructionsOpenedInPast) {
        this.showInstructionsAndSetCookie();
      }
    });
  }

  ngAfterViewChecked(): void {
    if (!this.state.finished) {
      const actBox = this.state.activeElement?.getBoundingClientRect();
      const panelBox = this.state.panelContentElement?.getBoundingClientRect();
      if (actBox?.y! > panelBox?.y! + panelBox?.height!) {
        this.nextPage();
        this.changeDetectorRef.detectChanges(); // to avoid error ExpressionChangedAfterItHasBeenCheckedError
      }
    }
  }

  nextPage() {
    const panelBox = this.state.panelContentElement?.getBoundingClientRect();
    this.state.pageYPosition -= panelBox!.height;
  }

  showInstructionsAndSetCookie() {
    this.instructionsOpened = true;
    this.cookieService.set(
      `instruction${this.state.currentExercise$.value}Opened`,
      'true',
      2
    );
  }

  ngOnDestroy(): void {
    this.subs.dispose();
  }
}
