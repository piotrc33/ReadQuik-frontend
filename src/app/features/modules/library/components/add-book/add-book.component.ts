import { Component } from '@angular/core';
import { take } from 'rxjs';
import { BookDataI } from '../../../../../api/model/book-data.i';
import { BookService } from '../../services/book.service';
import { TextService } from '../../../exercises/services/text.service';
import { SegmentI } from '../../../../../api/model/segment.i';
import { BookSegmentsI } from 'src/app/api/model/book-segments.i';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent {
  bookForm: FormGroup;
  file: any;

  constructor(
    private bookService: BookService,
    private text: TextService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      coverUrl: ['', [Validators.required]],
      language: ['Polish', [Validators.required]],
    });
  }

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
        const segments: SegmentI[] = this.text.splitTextIntoSegments(
          fileReader.result
        );
        const newBookData: BookDataI = {
          _id: '', // mongo adds id by itself
          title: this.bookForm.controls['title'].value,
          author: this.bookForm.controls['author'].value,
          coverUrl: this.bookForm.controls['coverUrl'].value,
          language: this.bookForm.controls['language'].value,
          tags: ['to', 'be', 'added'],
          totalSegments: segments.length,
        };
        const newBookSegments: BookSegmentsI = {
          segments,
        };

        console.log(newBookSegments);
        this.bookService
          .addBook(newBookData, newBookSegments)
          .pipe(take(1))
          .subscribe(console.log);
        this.router.navigate(['/library']);
      }
    };
    fileReader.readAsText(this.file);
  }

  checkFormValue() {
    console.log(this.bookForm.controls['title'].value);
    console.log(this.bookForm.controls['author'].value);
    console.log(this.bookForm.controls['coverUrl'].value);
    console.log(this.bookForm.controls['language'].value);
  }
}
