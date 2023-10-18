import { Component, OnInit } from '@angular/core';
import { ExercisesStateService } from '../../services/exercises-state.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})
export class ExercisesComponent implements OnInit {

  constructor(public state: ExercisesStateService, private readonly router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(e => {
      if(e instanceof NavigationEnd) {
        if(e.url === '/exercises')
        this.router.navigate([`exercises/${this.state.lastPracticed}`]);
      }
    })
  }
}
