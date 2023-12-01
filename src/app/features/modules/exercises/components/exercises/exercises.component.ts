import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ExercisesStateService } from '../../services/exercises-state.service';
import { BookService } from '../../../library/services/book.service';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
})
export class ExercisesComponent implements OnInit {
  constructor(
    public state: ExercisesStateService,
    private readonly router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.state.currentExercise = Number(router.url.split('/').pop());
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
        this.state.pageYPosition -= panelBox!.height;
        this.changeDetectorRef.detectChanges(); // to avoid error ExpressionChangedAfterItHasBeenCheckedError
      }
    }
  }

  submit(val: number) {
    console.log('submitted', val);
  }
}
