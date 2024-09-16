import { TestBed } from '@angular/core/testing';
import { KeyboardService } from './keyboard.service';
import { Subject } from 'rxjs';

describe('KeyboardService', () => {
  let service: KeyboardService;
  let keyDownSubject: Subject<KeyboardEvent>;

  beforeEach(() => {
    keyDownSubject = new Subject<KeyboardEvent>();

    // addEventListener is being called in the service, when instantiating 'fromEvent'
    jest
      .spyOn(document, 'addEventListener')
      .mockImplementation(
        (event, callback: EventListenerOrEventListenerObject) => {
          if (event === 'keydown') {
            keyDownSubject.subscribe(callback as (e: KeyboardEvent) => void);
          }
        }
      );

    TestBed.configureTestingModule({
      providers: [KeyboardService],
    });

    service = TestBed.inject(KeyboardService);
  });

  afterEach(() => {
    keyDownSubject.complete();
    jest.clearAllMocks();
  });

  it('should emit from forwardingPress$ on space or ArrowRight or ArrowDown', () => {
    let emitted = false;
    service.forwardingPress$.subscribe(() => (emitted = true));

    keyDownSubject.next(new KeyboardEvent('keydown', { key: ' ' }));
    expect(emitted).toBe(true);

    emitted = false;
    keyDownSubject.next(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(emitted).toBe(true);

    emitted = false;
    keyDownSubject.next(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(emitted).toBe(true);
  });

  it('should not emit from forwardingPress$ on other keys', () => {
    let emitted = false;
    service.forwardingPress$.subscribe(() => (emitted = true));

    keyDownSubject.next(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(emitted).toBe(false);
  });

  it('should emit from exitPress$ on Escape key press', () => {
    let emitted = false;
    service.exitPress$.subscribe(() => (emitted = true));

    keyDownSubject.next(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(emitted).toBe(true);
  });

  it('should not emit from exitPress$ on other keys', () => {
    let emitted = false;
    service.exitPress$.subscribe(() => (emitted = true));

    keyDownSubject.next(new KeyboardEvent('keydown', { key: ' ' }));
    expect(emitted).toBe(false);
  });
});
