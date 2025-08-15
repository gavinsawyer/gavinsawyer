/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { DOCUMENT, isPlatformBrowser }                                                                                                     from "@angular/common";
import { Directive, type ElementRef, inject, output, OutputEmitterRef, PLATFORM_ID, type Signal, signal, type WritableSignal }             from "@angular/core";
import { toObservable, toSignal }                                                                                                          from "@angular/core/rxjs-interop";
import { delayWhen, filter, fromEvent, map, merge, Observable, type Observer, startWith, switchMap, takeUntil, type TeardownLogic, timer } from "rxjs";


// noinspection CssUnknownProperty
@Directive(
  {
    host: {
      "[class.focusedOrUnfocusing]":                                           "focusedOrUnfocusing$()",
      "[class.focused]":                                                       "focused$()",
      "[class.pressedOrUnpressing]":                                           "pressedOrUnpressing$()",
      "[class.pressed]":                                                       "pressed$()",
      "[class.transformedOrUntransforming]":                                   "transformedOrUntransforming$()",
      "[class.transformed]":                                                   "transformed$()",
      "[style.--bowstring--hover-transforming-directive--last-translation-x]": "lastTranslation$()?.x",
      "[style.--bowstring--hover-transforming-directive--last-translation-y]": "lastTranslation$()?.y",
      "[style.--bowstring--hover-transforming-directive--translation-x]":      "translation$().x",
      "[style.--bowstring--hover-transforming-directive--translation-y]":      "translation$().y",
    },

    standalone: true,
  },
)
export class HoverTransformingDirective {

  private readonly document: Document               = inject<Document>(DOCUMENT);
  private readonly platformId: NonNullable<unknown> = inject<NonNullable<unknown>>(PLATFORM_ID);

  public readonly htmlElementRef$: WritableSignal<ElementRef<HTMLElement> | undefined> = signal<undefined>(undefined);

  protected readonly focused$: Signal<boolean>                                          = toSignal<boolean>(
    toObservable<ElementRef<HTMLElement> | undefined>(this.htmlElementRef$).pipe<ElementRef<HTMLElement>, boolean, boolean>(
      filter<ElementRef<HTMLElement> | undefined, ElementRef<HTMLElement>>(
        (htmlElementRef?: ElementRef<HTMLElement>): htmlElementRef is ElementRef<HTMLDivElement> => !!htmlElementRef,
      ),
      switchMap<ElementRef<HTMLElement>, Observable<boolean>>(
        ({ nativeElement: htmlElement }: ElementRef<HTMLElement>): Observable<boolean> => fromEvent<FocusEvent>(
          htmlElement,
          "focusin",
        ).pipe<boolean>(
          switchMap<FocusEvent, Observable<boolean>>(
            (): Observable<boolean> => fromEvent<FocusEvent>(
              htmlElement,
              "focusout",
            ).pipe<false, boolean>(
              map<FocusEvent, false>(
                (): false => false,
              ),
              startWith<false, [ true ]>(true),
            ),
          ),
        ),
      ),
      startWith<boolean, [ false ]>(false),
    ),
    { requireSync: true },
  );
  protected readonly focusedOrUnfocusing$: Signal<boolean>                              = isPlatformBrowser(this.platformId) ? toSignal<boolean>(
    toObservable<boolean>(this.focused$).pipe<boolean, boolean, boolean>(
      delayWhen<boolean>(
        (focused: boolean): Observable<number> => focused ? timer(0) : timer(200),
      ),
      map<boolean, boolean>(
        (): boolean => this.focused$(),
      ),
      startWith<boolean>(this.focused$()),
    ),
    { requireSync: true },
  ) : signal<false>(false);
  protected readonly translation$: Signal<{ "x": number, "y": number }>                 = isPlatformBrowser(this.platformId) && this.document.defaultView ? ((window: Window & typeof globalThis) => toSignal<{ "x": number, "y": number }>(
    toObservable<ElementRef<HTMLElement> | undefined>(this.htmlElementRef$).pipe<ElementRef<HTMLElement>, { "x": number, "y": number }, { "x": number, "y": number }>(
      filter<ElementRef<HTMLElement> | undefined, ElementRef<HTMLElement>>(
        (htmlElementRef?: ElementRef<HTMLElement>): htmlElementRef is ElementRef<HTMLDivElement> => !!htmlElementRef,
      ),
      switchMap<ElementRef<HTMLElement>, Observable<{ "x": number, "y": number }>>(
        ({ nativeElement: htmlElement }: ElementRef<HTMLElement>): Observable<{ "x": number, "y": number }> => fromEvent<PointerEvent>(
          window,
          "pointermove",
        ).pipe<PointerEvent, { "x": number, "y": number }>(
          filter<PointerEvent>(
            ({ pointerType }: PointerEvent): boolean => pointerType === "mouse",
          ),
          map<PointerEvent, { "x": number, "y": number }>(
            (
              {
                x,
                y,
              }: PointerEvent,
            ): { "x": number, "y": number } => {
              if (!htmlElement.contains(this.document.elementFromPoint(
                x,
                y,
              )))
                return {
                  x: 0,
                  y: 0,
                };

              const domRect: DOMRect | undefined = htmlElement.getBoundingClientRect();

              if (!domRect || x < domRect.left || x > domRect.right || y < domRect.top || y > domRect.bottom)
                return {
                  x: 0,
                  y: 0,
                };

              return {
                x: ((2 * ((x - domRect.left) / domRect.width)) - 1) / 8,
                y: ((2 * ((y - domRect.top) / domRect.height)) - 1) / 8,
              };
            },
          ),
        ),
      ),
      startWith<{ "x": number, "y": number }, [ { "x": 0, "y": 0 } ]>({ x: 0, y: 0 }),
    ),
    { requireSync: true },
  ))(this.document.defaultView) : signal<{ "x": 0, "y": 0 }>({ x: 0, y: 0 });
  protected readonly lastTranslation$: Signal<{ "x": number, "y": number } | undefined> = isPlatformBrowser(this.platformId) ? toSignal<{ "x": number, "y": number }>(
    toObservable<{ "x": number, "y": number }>(this.translation$).pipe<{ "x": number, "y": number }>(
      filter<{ "x": number, "y": number }>(
        ({ x, y }: { "x": number, "y": number }): boolean => x !== 0 || y !== 0,
      ),
    ),
  ) : signal<undefined>(undefined);
  protected readonly pressed$: Signal<boolean>                                          = isPlatformBrowser(this.platformId) && this.document.defaultView ? ((window: Window & typeof globalThis): Signal<boolean> => toSignal<boolean>(
    toObservable<ElementRef<HTMLElement> | undefined>(this.htmlElementRef$).pipe<ElementRef<HTMLElement>, boolean, boolean>(
      filter<ElementRef<HTMLElement> | undefined, ElementRef<HTMLElement>>(
        (htmlElementRef?: ElementRef<HTMLElement>): htmlElementRef is ElementRef<HTMLDivElement> => !!htmlElementRef,
      ),
      switchMap<ElementRef<HTMLElement>, Observable<boolean>>(
        ({ nativeElement: htmlElement }: ElementRef<HTMLElement>): Observable<boolean> => fromEvent<PointerEvent>(
          htmlElement,
          "pointerdown",
        ).pipe<boolean>(
          switchMap<PointerEvent, Observable<boolean>>(
            (): Observable<boolean> => merge<[ true, false ]>(
              fromEvent<PointerEvent>(
                htmlElement,
                "pointerenter",
              ).pipe<true, true>(
                map<PointerEvent, true>(
                  (): true => true,
                ),
                takeUntil<true>(
                  merge<[ PointerEvent, void ]>(
                    fromEvent<PointerEvent>(
                      window,
                      "pointerup",
                    ),
                    new Observable<void>(
                      (pressedCancelledObserver: Observer<void>): TeardownLogic => this.pressedCancelled.subscribe(
                        (): void => pressedCancelledObserver.next(),
                      ).unsubscribe,
                    ),
                  ),
                ),
              ),
              merge<[ PointerEvent, PointerEvent, PointerEvent ]>(
                fromEvent<PointerEvent>(
                  htmlElement,
                  "pointerleave",
                ),
                fromEvent<PointerEvent>(
                  htmlElement,
                  "pointerup",
                ),
                fromEvent<PointerEvent>(
                  window,
                  "scroll",
                ),
              ).pipe<false>(
                map<PointerEvent, false>(
                  (): false => false,
                ),
              ),
            ).pipe<boolean, boolean>(
              startWith<boolean, [ true ]>(true),
              switchMap<boolean, Observable<boolean>>(
                (pressed: boolean): Observable<boolean> => new Observable<false>(
                  (pressedCancelledObserver: Observer<false>): TeardownLogic => this.pressedCancelled.subscribe(
                    (): void => pressedCancelledObserver.next(false),
                  ).unsubscribe,
                ).pipe<boolean>(
                  startWith<boolean>(pressed),
                ),
              ),
            ),
          ),
        ),
      ),
      startWith<boolean, [ false ]>(false),
    ),
    { requireSync: true },
  ))(this.document.defaultView) : signal<false>(false);
  protected readonly pressedOrUnpressing$: Signal<boolean>                              = isPlatformBrowser(this.platformId) ? toSignal<boolean>(
    toObservable<boolean>(this.pressed$).pipe<boolean, boolean, boolean>(
      delayWhen<boolean>(
        (pressed: boolean): Observable<number> => pressed ? timer(0) : timer(50),
      ),
      map<boolean, boolean>(
        (): boolean => this.pressed$(),
      ),
      startWith<boolean>(this.pressed$()),
    ),
    { requireSync: true },
  ) : signal<false>(false);
  protected readonly transformed$: Signal<boolean>                                      = isPlatformBrowser(this.platformId) ? toSignal<boolean>(
    toObservable<{ "x": number, "y": number }>(this.translation$).pipe<boolean, boolean>(
      map<{ "x": number, "y": number }, boolean>(
        ({ x, y }: { "x": number, "y": number }): boolean => x !== 0 || y !== 0,
      ),
      startWith<boolean, [ false ]>(false),
    ),
    { requireSync: true },
  ) : signal<false>(false);
  protected readonly transformedOrUntransforming$: Signal<boolean>                      = isPlatformBrowser(this.platformId) ? toSignal<boolean>(
    toObservable<boolean>(this.transformed$).pipe<boolean, boolean, boolean>(
      delayWhen<boolean>(
        (transformed: boolean): Observable<number> => transformed ? timer(0) : timer(200),
      ),
      map<boolean, boolean>(
        (): boolean => this.transformed$(),
      ),
      startWith<boolean>(this.transformed$()),
    ),
    { requireSync: true },
  ) : signal<false>(false);

  public readonly pressedCancelled: OutputEmitterRef<void> = output<void>();

  public cancelPressed(): void {
    this.pressedCancelled.emit();
  }

}
