import { Component } from '@angular/core';
import { take } from 'rxjs';
import { BookI } from '../../book.i';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent {
  constructor(private bookService: BookService) {}

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
        const newBook: BookI = {
          title: this.file.name,
          text: fileReader.result,
        };
        this.bookService.addBook(newBook).pipe(take(1)).subscribe(console.log);
      }
    };
    fileReader.readAsText(this.file);
  }
}
