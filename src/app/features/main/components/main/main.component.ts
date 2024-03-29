import { Component, OnInit, inject } from '@angular/core';
import { ReadingDataService } from 'src/app/shared/services/reading-data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  private readonly readingDataService = inject(ReadingDataService);

  ngOnInit(): void {
    this.readingDataService.initialDataAction$.next();
  }
}
