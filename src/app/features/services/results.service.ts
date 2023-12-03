import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { RecentResultI } from 'src/app/api/model/recent-result.i';
import { baseUrl } from 'src/app/shared/variables';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private http: HttpClient) { }

  recentResults$ = new ReplaySubject<RecentResultI[]>(1)

  updateRecentResults() {
    const url = `${baseUrl}/results/recent-results`;
    this.http.get<RecentResultI[]>(url).subscribe(results => this.recentResults$.next(results));
  }
}
