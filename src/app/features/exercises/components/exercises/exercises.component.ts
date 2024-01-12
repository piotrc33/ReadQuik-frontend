import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ExercisesProgressStateService } from 'src/app/features/services/exercises-progress-state.service';
import { ResultsService } from 'src/app/features/services/results.service';
import { ExercisesStateService } from '../../services/exercises-state.service';
import { InstructionsService } from '../../services/instructions.service';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
})
export class ExercisesComponent implements OnInit, AfterViewChecked {
  instructionsOpened: boolean = false;
  readonly instructions$ = this.instructionService.getExerciseInstructions();

  constructor(
    public state: ExercisesStateService,
    private readonly router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    public resultsService: ResultsService,
    private readonly instructionService: InstructionsService,
    public readonly progressState: ExercisesProgressStateService
  ) {
    const exerciseNumber = Number(router.url.split('/').pop());
    if (exerciseNumber) {
      this.state.currentExercise = exerciseNumber;
    } else {
      this.state.currentExercise = this.state.lastPracticed;
      this.router.navigate([`exercises/${this.state.lastPracticed}`]);
    }

    resultsService.updateRecentResults();
  }

  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.state.currentExercise = Number(e.url.split('/').pop());
        if (e.url === '/exercises')
          this.router.navigate([`exercises/${this.state.lastPracticed}`]);
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

  showInstructions() {
    this.instructionsOpened = true;
  }
}
