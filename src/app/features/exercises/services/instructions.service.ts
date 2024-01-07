import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class InstructionsService {
  readonly http = inject(HttpClient);

  getExerciseInstructions(): Observable<any> {
    return this.http
      .get<any>('assets/i18n/en.json')
      .pipe(map((val) => val.instructions));
  }
}
