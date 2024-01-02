import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { filter, merge } from 'rxjs';
import { Exercise } from '../../model/exercise';
import { TextService } from '../../services/text.service';

@Component({
  selector: 'exercise7',
  templateUrl: './exercise7.component.html',
  styleUrls: ['./exercise7.component.scss'],
})
export class Exercise7Component extends Exercise implements AfterViewInit
{
  readonly textService = inject(TextService);
  readonly el = inject(ElementRef);

  exerciseTextElement?: HTMLElement;
  textBox?: DOMRect;
  panelBox?: DOMRect;
  override finished$ = merge(
    this.keyService.forwardingPress$,
    this.state.next$
  ).pipe(filter(() => this.isLastPage()));

  constructor() {
    super();
    this.subs.add = this.finished$.subscribe(() => this.state.finish());
  }

  ngAfterViewInit(): void {
    this.exerciseTextElement = this.el.nativeElement.querySelector('.text');
    this.textBox = this.exerciseTextElement?.getBoundingClientRect();
  }

  override handleNextFragment(): void {
    super.handleNextFragment();
    this.nextPage();
  }

  isLastPage(): boolean {
    const result = this.textBox!.bottom < this.panelBox!.height;
    this.textBox = this.exerciseTextElement?.getBoundingClientRect();
    return result;
  }

  nextPage() {
    this.panelBox = this.state.panelContentElement?.getBoundingClientRect();
    this.state.pageYPosition -= this.panelBox!.height;
  }
}
