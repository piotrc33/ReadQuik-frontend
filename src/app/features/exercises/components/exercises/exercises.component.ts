import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ExercisesProgressStateService } from 'src/app/services/exercises-progress-state.service';
import { ResultsService } from 'src/app/services/results.service';
import { SubscriptionContainer } from 'src/app/utils/subscription-container';
import { ExercisesStateService } from '../../services/exercises-state.service';
import { InstructionsService } from '../../services/instructions.service';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
})
export class ExercisesComponent implements OnInit, AfterViewChecked, OnDestroy {
  instructionsOpened: boolean = false;
  readonly instructions$ = this.instructionService.getExerciseInstructions();

  subs = new SubscriptionContainer();

  constructor(
    public state: ExercisesStateService,
    private readonly router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    public resultsService: ResultsService,
    private readonly instructionService: InstructionsService,
    public readonly progressState: ExercisesProgressStateService,
    private readonly cookieService: CookieService
  ) {
    const exerciseNumber = Number(router.url.split('/').pop());
    if (exerciseNumber) {
      this.state.currentExercise$.next(exerciseNumber);
    } else {
      this.state.currentExercise$.next(this.state.lastPracticed);
      this.router.navigate([`exercises/${this.state.lastPracticed}`]);
    }

    resultsService.updateRecentResults();
  }

  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const exNum = Number(e.url.split('/').pop());
        this.state.currentExercise$.next(exNum);
        if (e.url === '/exercises')
          this.router.navigate([`exercises/${this.state.lastPracticed}`]);
      }
    });

    this.subs.add = this.state.currentExercise$.subscribe((val) => {
      const cookieValue = this.cookieService.get(
        `instruction${val}Opened`
      );
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
