import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { BookService } from 'src/app/features/library/services/book.service';
import { CurrentExerciseService } from 'src/app/shared/services/current-exercise.service';
import { ExercisesProgressStateService } from 'src/app/shared/services/exercises-progress-state.service';
import { ReadingDataService } from 'src/app/shared/services/reading-data.service';
import { ResultsService } from 'src/app/shared/services/results.service';
import { ExercisesStateService } from '../../services/exercises-state.service';
import { InstructionsService } from '../../services/instructions.service';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
})
export class ExercisesComponent implements OnInit, AfterViewChecked {
  readonly bookService = inject(BookService);
  readonly readingDataService = inject(ReadingDataService);

  constructor(
    public readonly state: ExercisesStateService,
    public readonly resultsService: ResultsService,
    public readonly progressState: ExercisesProgressStateService,
    public readonly currentExerciseService: CurrentExerciseService,
    public readonly instructionService: InstructionsService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.resultsService.updateRecentResults();

    this.currentExerciseService.initialExerciseNumberAction$.next();
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
}
