import { Injectable, computed, signal } from '@angular/core';

@Injectable()
export class ExercisesStateService {
  readonly #panelContentElement = signal<HTMLElement | undefined>(undefined);

  readonly panelContentElement = this.#panelContentElement.asReadonly();

  updatePanelElement(panelElement: HTMLElement) {
    this.#panelContentElement.set(panelElement);
  }

  readonly panelBox = computed(() => {
    return this.#panelContentElement()?.getBoundingClientRect();
  })
}
