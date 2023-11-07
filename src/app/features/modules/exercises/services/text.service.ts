import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BookI } from '../../library/book.i';
import { BookService } from '../../library/services/book.service';
import { AppStateService } from 'src/app/features/services/app-state.service';

@Injectable()
export class TextService {
  
  wordFragments$: Observable<string[]>;
  bookFragmentsWithNewlines$: Observable<string[]>;

  constructor(private bookService: BookService, private as: AppStateService) {
    this.bookFragmentsWithNewlines$ = as.currentBook$.pipe(
      map((book: BookI) => this.getFragmentsWithNewlines(book.text)),
    );
    this.wordFragments$ = this.bookFragmentsWithNewlines$.pipe(
      map((fragments: string[]) => this.removeNewlines(fragments)),
    );
  }

  getWordFragments(book: BookI): string[] {
    const bookText = book.text;
    return this.splitByNewlines(bookText).filter(
      (frag) => !this.isNewline(frag)
    );
  }

  getFragmentsWithNewlines(text: string): string[] {
    let fragments: string[] = [];
    let piped: string = text.replace(/[,.?!;…]+/g, '$&|');
    piped = piped.replace(/\S+$/gm, '$&|');
    piped = piped.replace(/(?<!^)—/gm, '$&|');
    fragments = this.splitByNewlines(piped);
    fragments = this.splitByPipes(fragments);
    fragments = this.splitLongFragments(fragments);

    return fragments;
  }

  splitTextByNWords(text: string, n: number) {
    const words = text.split(/[^\S\r\n]/);
    const groups = [];

    for (let i = 0; i < words.length; i += n) {
      const group = words.slice(i, i + n).join(' ');
      groups.push(group);
    }

    return groups;
  }

  splitByNewlines(text: string): string[] {
    return text.split(/(\n)/);
  }

  isNewline(phrase: string): boolean {
    return /^\n+/.test(phrase);
  }

  removeNewlines(fragments: string[]): string[] {
    return fragments.filter((frag) => !this.isNewline(frag));
  }

  splitByPipes(fragments: string[]): string[] {
    let result: string[] = [];
    fragments.forEach((frag) => {
      const split = frag.split(/\|+/);
      result = result.concat(split);
    });

    result = result.filter((el) => el !== '');
    return result;
  }

  splitLongFragments(fragments: string[]): string[] {
    let result: string[] = [];
    fragments.forEach((frag) => {
      const split = this.splitTextByNWords(frag, 4);
      result = result.concat(split);
    });
    return result;
  }
}
