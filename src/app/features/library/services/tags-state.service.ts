import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagsStateService {
  readonly #tags = signal<string[]>([]);

  updateTags(newTags: string[]) {
    this.#tags.set(newTags);
  }

  readonly tags: Signal<string[]> = this.#tags.asReadonly();
}
