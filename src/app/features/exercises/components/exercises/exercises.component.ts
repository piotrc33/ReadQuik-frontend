import { Component, OnInit, inject } from '@angular/core';
import { BookService } from 'src/app/features/library/services/book.service';
import { CurrentExerciseService } from 'src/app/shared/services/current-exercise.service';
import { ExercisesProgressStateService } from 'src/app/shared/services/exercises-progress-state.service';
import { ReadingDataService } from 'src/app/shared/services/reading-data.service';
import { ResultsService } from 'src/app/shared/services/results.service';
import { ExerciseFlowService } from '../../services/exercise-flow.service';
import { ExercisesStateService } from '../../services/exercises-state.service';
import { InstructionsService } from '../../services/instructions.service';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
})
export class ExercisesComponent implements OnInit {
  readonly bookService = inject(BookService);
  readonly readingDataService = inject(ReadingDataService);
  readonly flowService = inject(ExerciseFlowService);
  readonly exerciseNumber = this.currentExerciseService.exerciseNumber;

  constructor(
    public readonly state: ExercisesStateService,
    public readonly resultsService: ResultsService,
    public readonly progressState: ExercisesProgressStateService,
    public readonly currentExerciseService: CurrentExerciseService,
    public readonly instructionService: InstructionsService
  ) {}

  ngOnInit(): void {
    this.resultsService.loadRecentResultsAction$.next();
    this.currentExerciseService.initialExerciseNumberAction$.next();
  }
}
