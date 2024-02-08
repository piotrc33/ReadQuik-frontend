import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BookService } from 'src/app/features/library/services/book.service';
import { CurrentExerciseService } from 'src/app/shared/services/current-exercise.service';
import { ExercisesProgressStateService } from 'src/app/shared/services/exercises-progress-state.service';
import { ReadingDataService } from 'src/app/shared/services/reading-data.service';
import { ResultsService } from 'src/app/shared/services/results.service';
import { SubscriptionContainer } from 'src/app/utils/subscription-container';
import { ExercisesStateService } from '../../services/exercises-state.service';
import { InstructionsService } from '../../services/instructions.service';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
})
export class ExercisesComponent implements OnInit, AfterViewChecked, OnDestroy {
  readonly bookService = inject(BookService);
  readonly readingDataService = inject(ReadingDataService);

  instructionsOpened: boolean = false;
  readonly instructions$ = this.instructionService.getExerciseInstructions();

  subs = new SubscriptionContainer();

  constructor(
    public readonly state: ExercisesStateService,
    public readonly resultsService: ResultsService,
    public readonly progressState: ExercisesProgressStateService,
    public readonly currentExerciseService: CurrentExerciseService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly instructionService: InstructionsService,
    private readonly cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.resultsService.updateRecentResults();

    this.currentExerciseService.initialExerciseNumberAction$.next();

    this.subs.add = this.currentExerciseService.currentExercise$.subscribe(
      (val) => {
        const cookieValue = this.cookieService.get(`instruction${val}Opened`);
        const instructionsOpenedInPast = cookieValue
          ? JSON.parse(cookieValue)
          : false;
        if (!instructionsOpenedInPast) {
          this.showInstructionsAndSetCookie();
        }
      }
    );
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
      `instruction${this.currentExerciseService.exerciseNumber()}Opened`,
      'true',
      2
    );
  }

  ngOnDestroy(): void {
    this.subs.dispose();
  }
}
