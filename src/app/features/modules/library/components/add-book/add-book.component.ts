import { Component } from '@angular/core';
import { take } from 'rxjs';
import { BookDataI } from '../../../../../api/model/book-data.i';
import { BookService } from '../../services/book.service';
import { TextService } from '../../../exercises/services/text.service';
import { SegmentI } from '../../../../../api/model/segment.i';
import { BookSegmentsI } from 'src/app/api/model/book-segments.i';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent {
  constructor(private bookService: BookService, private text: TextService) {}

  file: any;

  fileChanged(event: any): void {
    this.file = event.target.files[0];
  }

  upload(): void {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (
        this.file &&
        fileReader.result &&
        typeof fileReader.result === 'string'
      ) {
        console.log('adding book', this.file.name);
        const segments: SegmentI[] = this.text.splitTextIntoSegments(fileReader.result);
        const newBookData: BookDataI = {
          _id: '', // mongo adds id by itself
          title: this.file.name,
        };
        const newBookSegments: BookSegmentsI = {
          segments
        };

        console.log(newBookSegments);
        this.bookService.addBook(newBookData, newBookSegments).pipe(take(1)).subscribe(console.log);
      }
    };
    fileReader.readAsText(this.file);
  }
}
