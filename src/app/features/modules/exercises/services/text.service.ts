import { Injectable } from '@angular/core';
import { BookService } from '../../library/services/book.service';
import { firstValueFrom, take } from 'rxjs';

@Injectable()
export class TextService {
  bookFragmentsWithNewlines: string[] = [];
  bookText: string = '';
  wordFragments: string[] = [];
  private bookFragments: string[] = [];

  constructor(private bookService: BookService) {
    this.getBookData();
  }

  getBookData() {
    this.bookService
      .getBook('6547dc278aa6bb7f43f85f71')
      .pipe(take(1))
      .subscribe((res) => {
        this.bookText = res.text;
        console.log(this.bookText);
        this.initializeFragments();
      });
  }

  initializeFragments(): void {
    this.bookFragments = this.splitByNewlines(this.bookText);
    this.wordFragments = this.bookFragments.filter(
      (frag) => !this.isNewline(frag)
    );

    let fragments: string[] = [];
    let piped: string = this.bookText.replace(/[,.?!;…]+/g, '$&|');
    piped = piped.replace(/\S+$/gm, '$&|');
    piped = piped.replace(/(?<!^)—/gm, '$&|');
    fragments = this.splitByNewlines(piped);
    fragments = this.splitByPipes(fragments);
    fragments = this.splitLongFragments(fragments);
    this.bookFragmentsWithNewlines = [...fragments];
    fragments = this.removeNewlines(fragments);
    this.wordFragments = fragments;
    console.log(this.wordFragments);
  }

  getBookFragmentsWithNewlines(): string[] {
    return this.bookFragmentsWithNewlines;
  }

  getWordFragments(): string[] {
    return this.wordFragments;
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
