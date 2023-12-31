import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FiltersI } from '../../../../api/model/filters.i';

@Component({
  selector: 'filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  readonly fb = inject(FormBuilder);

  @Input() tags: string[] | null = [];

  @Output()
  filter = new EventEmitter<FiltersI>();

  readonly filterForm = this.fb.nonNullable.group({
    title: '',
    author: '',
    tags: this.fb.nonNullable.array<string>([]),
  });

  dropdownOpened = false;

  get tagsFormArray() {
    return this.filterForm.controls['tags'];
  }

  handlePill(tag: string) {
    const index = this.tagsFormArray.value.indexOf(tag);

    if (index !== -1) {
      this.tagsFormArray.removeAt(index);
      return;
    }
    this.tagsFormArray.push(this.fb.nonNullable.control(tag));
  }

  searchBooks() {
    this.filter.emit(this.filterForm.getRawValue());
  }
}
