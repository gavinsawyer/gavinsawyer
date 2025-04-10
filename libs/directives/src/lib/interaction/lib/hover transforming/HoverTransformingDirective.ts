/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { DOCUMENT, isPlatformBrowser }                                                                                          from "@angular/common";
import { computed, Directive, type ElementRef, inject, PLATFORM_ID, type Signal, signal, type WritableSignal }                  from "@angular/core";
import { toObservable, toSignal }                                                                                               from "@angular/core/rxjs-interop";
import { combineLatestWith, delayWhen, filter, fromEvent, map, merge, type Observable, startWith, switchMap, takeUntil, timer } from "rxjs";


@Directive(
  {
    host: {
      "[class.focusedOrUnfocusing]":                                           "focusedOrUnfocusing$()",
      "[class.focused]":                                                       "focused$()",
      "[class.pressedOrUnpressing]":                                           "pressedOrUnpressing$()",
      "[class.pressed]":                                                       "pressed$()",
      "[class.transformedOrUntransforming]":                                   "transformedOrUntransforming$()",
      "[class.transformed]":                                                   "transformed$()",
      "[style.--bowstring--hover-transforming-directive--last-translation-x]": "lastTranslationX$()",
      "[style.--bowstring--hover-transforming-directive--last-translation-y]": "lastTranslationY$()",
      "[style.--bowstring--hover-transforming-directive--translation-x]":      "translationX$()",
      "[style.--bowstring--hover-transforming-directive--translation-y]":      "translationY$()",
    },

    standalone: true,
  },
)
export class HoverTransformingDirective {

  private readonly document: Document               = inject<Document>(DOCUMENT);
  private readonly platformId: NonNullable<unknown> = inject<NonNullable<unknown>>(PLATFORM_ID);

  public readonly htmlElementRef$: WritableSignal<ElementRef<HTMLElement> | undefined> = signal<undefined>(undefined);

  private readonly translation$: Signal<{ "x": number, "y": number } | undefined> = isPlatformBrowser(this.platformId) ? toSignal<{ "x": number, "y": number } | undefined>(
    toObservable<ElementRef<HTMLElement> | undefined>(this.htmlElementRef$).pipe<ElementRef<HTMLElement>, { "x": number, "y": number } | undefined>(
      filter<ElementRef<HTMLElement> | undefined, ElementRef<HTMLElement>>(
        (htmlElementRef?: ElementRef<HTMLElement>): htmlElementRef is ElementRef<HTMLDivElement> => !!htmlElementRef,
      ),
      switchMap<ElementRef<HTMLElement>, Observable<{ "x": number, "y": number } | undefined>>(
        ({ nativeElement: htmlElement }: ElementRef<HTMLElement>): Observable<{ "x": number, "y": number } | undefined> => fromEvent<PointerEvent>(
          window,
          "pointermove",
        ).pipe<PointerEvent, { "x": number, "y": number } | undefined>(
          filter<PointerEvent>(
            ({ pointerType }: PointerEvent): boolean => pointerType === "mouse",
          ),
          map<PointerEvent, { "x": number, "y": number } | undefined>(
            (
              {
                x,
                y,
              }: PointerEvent): { "x": number, "y": number } | undefined => {
              if (!htmlElement.contains(this.document.elementFromPoint(
                x,
                y,
              )))
                return undefined;

              const domRect: DOMRect | undefined = htmlElement.getBoundingClientRect();

              if (!domRect || x < domRect.left || x > domRect.right || y < domRect.top || y > domRect.bottom)
                return undefined;

              return {
                x: ((2 * ((x - domRect.left) / domRect.width)) - 1) / 8,
                y: ((2 * ((y - domRect.top) / domRect.height)) - 1) / 8,
              };
            },
          ),
        ),
      ),
    ),
  ) : signal<undefined>(undefined);

  protected readonly focused$: Signal<boolean | undefined>                              = isPlatformBrowser(this.platformId) ? toSignal<boolean>(
    toObservable<ElementRef<HTMLElement> | undefined>(this.htmlElementRef$).pipe<ElementRef<HTMLElement>, boolean>(
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
    ),
  ) : signal<undefined>(undefined);
  protected readonly focusedOrUnfocusing$: Signal<boolean | undefined>                  = isPlatformBrowser(this.platformId) ? toSignal<boolean | undefined>(
    toObservable<boolean | undefined>(this.focused$).pipe<boolean | undefined, boolean | undefined>(
      delayWhen<boolean | undefined>(
        (focused?: boolean): Observable<number> => {
          if (focused === undefined)
            return timer(0);

          return focused ? timer(0) : timer(200);
        },
      ),
      map<boolean | undefined, boolean | undefined>(
        (): boolean | undefined => this.focused$(),
      ),
    ),
  ) : signal<undefined>(undefined);
  protected readonly lastTranslation$: Signal<{ "x": number, "y": number } | undefined> = isPlatformBrowser(this.platformId) ? toSignal<{ "x": number, "y": number }>(
    toObservable<{ "x": number, "y": number } | undefined>(
      this.translation$,
    ).pipe<{ "x": number, "y": number }>(
      filter<{ "x": number, "y": number } | undefined, { "x": number, "y": number }>(
        (translation?: { "x": number, "y": number }): translation is { "x": number, "y": number } => {
          if (translation === undefined)
            return false;

          return translation.x !== 0 || translation.y !== 0;
        },
      ),
    ),
  ) : signal<undefined>(undefined);
  protected readonly lastTranslationX$: Signal<number | undefined>                      = computed<number | undefined>(
    (): number | undefined => this.lastTranslation$()?.x,
  );
  protected readonly lastTranslationY$: Signal<number | undefined>                      = computed<number | undefined>(
    (): number | undefined => this.lastTranslation$()?.y,
  );
  protected readonly pressed$: Signal<boolean | undefined>                              = isPlatformBrowser(this.platformId) && this.document.defaultView ? ((): Signal<boolean | undefined> => {
    const window: Window & typeof globalThis = this.document.defaultView;

    return toSignal<boolean>(
      toObservable<ElementRef<HTMLElement> | undefined>(this.htmlElementRef$).pipe<ElementRef<HTMLElement>, boolean>(
        filter<ElementRef<HTMLElement> | undefined, ElementRef<HTMLElement>>(
          (htmlElementRef?: ElementRef<HTMLElement>): htmlElementRef is ElementRef<HTMLDivElement> => !!htmlElementRef,
        ),
        switchMap<ElementRef<HTMLElement>, Observable<boolean>>(
          ({ nativeElement: htmlElement }: ElementRef<HTMLElement>): Observable<boolean> => fromEvent<PointerEvent>(
            htmlElement,
            "pointerdown",
          ).pipe<boolean>(
            switchMap<PointerEvent, Observable<boolean>>(
              (): Observable<boolean> => merge<[ true, false, false, false ]>(
                fromEvent<PointerEvent>(
                  htmlElement,
                  "pointerenter",
                ).pipe<true, true>(
                  map<PointerEvent, true>(
                    (): true => true,
                  ),
                  takeUntil<true>(
                    fromEvent<PointerEvent>(
                      window,
                      "pointerup",
                    ),
                  ),
                ),
                fromEvent<PointerEvent>(
                  htmlElement,
                  "pointerleave",
                ).pipe<false>(
                  map<PointerEvent, false>(
                    (): false => false,
                  ),
                ),
                fromEvent<PointerEvent>(
                  htmlElement,
                  "pointerup",
                ).pipe<false>(
                  map<PointerEvent, false>(
                    (): false => false,
                  ),
                ),
                fromEvent<PointerEvent>(
                  window,
                  "scroll",
                ).pipe<false>(
                  map<PointerEvent, false>(
                    (): false => false,
                  ),
                ),
              ).pipe<boolean>(
                startWith<boolean, [ true ]>(true),
              ),
            ),
          ),
        ),
      ),
    );
  })() : signal<undefined>(undefined);
  protected readonly pressedOrUnpressing$: Signal<boolean | undefined>                  = isPlatformBrowser(this.platformId) ? toSignal<boolean | undefined>(
    toObservable<boolean | undefined>(this.pressed$).pipe<boolean | undefined, boolean | undefined>(
      delayWhen<boolean | undefined>(
        (pressed?: boolean): Observable<number> => pressed !== undefined ? pressed ? timer(0) : timer(50) : timer(0),
      ),
      map<boolean | undefined, boolean | undefined>(
        (): boolean | undefined => this.pressed$(),
      ),
    ),
  ) : signal<undefined>(undefined);
  protected readonly translationX$: Signal<number | undefined>                          = computed<number | undefined>(
    (): number | undefined => this.translation$()?.x,
  );
  protected readonly translationY$: Signal<number | undefined>                          = computed<number | undefined>(
    (): number | undefined => this.translation$()?.y,
  );
  protected readonly transformed$: Signal<boolean | undefined>                          = isPlatformBrowser(this.platformId) ? toSignal<boolean | undefined>(
    toObservable<number | undefined>(this.translationX$).pipe<[ number | undefined, number | undefined ], boolean | undefined>(
      combineLatestWith<number | undefined, [ number | undefined ]>(
        toObservable<number | undefined>(this.translationY$),
      ),
      map<[ number | undefined, number | undefined ], boolean | undefined>(
        ([ translationX, translationY ]: [ number | undefined, number | undefined ]): boolean | undefined => {
          if (translationX === undefined || translationY === undefined)
            return undefined;

          return translationX !== 0 || translationY !== 0;
        },
      ),
    ),
  ) : signal<undefined>(undefined);
  protected readonly transformedOrUntransforming$: Signal<boolean | undefined>          = isPlatformBrowser(this.platformId) ? toSignal<boolean | undefined>(
    toObservable<boolean | undefined>(this.transformed$).pipe<boolean | undefined, boolean | undefined>(
      delayWhen<boolean | undefined>(
        (transformed?: boolean): Observable<number> => transformed ? timer(0) : timer(200),
      ),
      map<boolean | undefined, boolean | undefined>(
        (): boolean | undefined => this.transformed$(),
      ),
    ),
  ) : signal<undefined>(undefined);

}
