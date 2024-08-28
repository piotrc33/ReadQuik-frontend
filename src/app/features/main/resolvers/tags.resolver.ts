import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BookService } from '../../library/services/book.service';
import { TagsStateService } from '../../library/services/tags-state.service';
import { tap } from 'rxjs';

export const tagsResolver: ResolveFn<string[]> = () => {
  const bookService = inject(BookService);
  const tagsState = inject(TagsStateService);

  return tagsState.tags().length > 0
    ? tagsState.tags()
    : bookService.getTags().pipe(tap((tags) => tagsState.updateTags(tags)));
};
