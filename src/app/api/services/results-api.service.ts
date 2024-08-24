import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { baseUrl } from 'src/app/shared/variables';
import { RecentResultI } from '../model/progress/recent-result.i';
import { ResultI } from '../model/progress/result.i';

@Injectable({
  providedIn: 'root',
})
export class ResultsApiService {
  readonly #http = inject(HttpClient);

  getRecentResults(): Observable<RecentResultI[]> {
    return this.#http.get<RecentResultI[]>(`${baseUrl}/results/recent-results`);
  }

  getAllResults(): Observable<ResultI[]> {
    return this.#http.get<ResultI[]>(`${baseUrl}/results/all-results`);
  }
}
