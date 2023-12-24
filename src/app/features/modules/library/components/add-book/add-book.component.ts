import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { BookSegmentsI } from 'src/app/api/model/book-segments.i';
import { BookDataI } from '../../../../../api/model/book-data.i';
import { SegmentI } from '../../../../../api/model/segment.i';
import { TextService } from '../../../exercises/services/text.service';
import { BookService } from './../../services/book.service';
import { AddBookFormI } from './add-book-form.i';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnDestroy {
  readonly bookService = inject(BookService);
  readonly text = inject(TextService);
  readonly fb = inject(FormBuilder);
  readonly router = inject(Router);

  readonly destroy$ = new Subject<void>();
  readonly bookForm: FormGroup<AddBookFormI>;
  file: any;

  tagsSubject = new BehaviorSubject<string[]>([]);
  tags$ = this.tagsSubject.asObservable();

  @ViewChild('newTagInput') newTagInput?: ElementRef;

  constructor() {
    this.bookForm = this.fb.nonNullable.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      coverUrl: ['', [Validators.required]],
      language: ['Polish', [Validators.required]],
      tags: this.fb.array([]),
    }) as FormGroup<AddBookFormI>;

    this.bookService.tags$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tags) => this.tagsSubject.next(tags));
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
          tags: this.bookForm.controls['tags'].value,
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

  get tagsFormArray(): FormArray {
    return this.bookForm.controls['tags'] as FormArray;
  }

  handlePill(tag: string) {
    const index = this.tagsFormArray.value.indexOf(tag);

    if (index !== -1) {
      this.tagsFormArray.removeAt(index);
      return;
    }
    if (this.tagsFormArray.value.length >= 4) return;
    this.tagsFormArray.push(this.fb.control(tag));
  }

  isTagClickable(tag: string): boolean {
    const index = this.tagsFormArray.value.indexOf(tag);
    if (index === -1 && this.tagsFormArray.value.length >= 4) return false;
    return true;
  }

  addTag(newTag: string) {
    this.bookService
      .addTag(newTag)
      .pipe(takeUntil(this.destroy$))
      .subscribe((tag) => {
        this.tagsSubject.next([...this.tagsSubject.value, tag.name]);
      });
  }

  clearInput() {
    if (this.newTagInput) {
      this.newTagInput.nativeElement.value = '';
    }
  }

  checkFormValue() {
    console.log(this.bookForm.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
