import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, take, takeUntil } from 'rxjs';
import { AvailableLanguages } from 'src/app/shared/types/available-languages.t';
import { TextService } from '../../../exercises/services/text.service';
import { BookService } from '../../services/book.service';
import { AddBookFormI } from './add-book-form.i';
import { BookDataI } from 'src/app/api/model/library/book-data.i';
import { BookSegmentsI } from 'src/app/api/model/book-segments.i';
import { SegmentI } from 'src/app/api/model/segment.i';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnDestroy, OnInit {
  readonly bookService = inject(BookService);
  readonly text = inject(TextService);
  readonly fb = inject(FormBuilder);
  readonly router = inject(Router);

  readonly destroy$ = new Subject<void>();
  readonly bookForm: FormGroup<AddBookFormI> = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(4)]],
    author: ['', [Validators.required]],
    coverUrl: ['', [Validators.required]],
    language: new FormControl<AvailableLanguages>('Polish'),
    tags: this.fb.array([]),
  }) as FormGroup<AddBookFormI>;

  file?: File;

  readonly tagsSubject = new BehaviorSubject<string[]>([]);
  readonly tags$: Observable<string[]> = this.tagsSubject.asObservable();

  @ViewChild('newTagInput') newTagInput?: ElementRef;

  ngOnInit(): void {
    this.bookService.tags$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tags) => this.tagsSubject.next(tags));
  }

  fileChanged(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.file = fileList[0];
    }
  }

  upload(): void {
    let fileReader: FileReader = new FileReader();
    fileReader.onload = () => {
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
          ...this.bookForm.getRawValue(),
          totalSegments: segments.length,
        };
        const newBookSegments: BookSegmentsI = {
          segments,
        };

        this.bookService
          .addBook(newBookData, newBookSegments)
          .pipe(take(1))
          .subscribe();
        this.router.navigate(['/library']);
      }
    };

    if (this.file) {
      fileReader.readAsText(this.file);
    }
  }

  get tagsFormArray(): FormArray<FormControl<string>> {
    return this.bookForm.controls['tags'];
  }

  handlePill(tag: string): void {
    const index: number = this.tagsFormArray.value.indexOf(tag);

    if (index !== -1) {
      this.tagsFormArray.removeAt(index);
      return;
    }
    if (this.tagsFormArray.value.length >= 4) return;
    this.tagsFormArray.push(this.fb.nonNullable.control(tag));
  }

  isTagClickable(tag: string): boolean {
    const index: number = this.tagsFormArray.value.indexOf(tag);
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

  clearInput(): void {
    if (this.newTagInput) {
      this.newTagInput.nativeElement.value = '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
