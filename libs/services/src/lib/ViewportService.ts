/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { type ViewportScrollPosition }                                    from "@angular/cdk/scrolling";
import { DOCUMENT, isPlatformBrowser }                                    from "@angular/common";
import { computed, inject, Injectable, PLATFORM_ID, signal, type Signal } from "@angular/core";
import { toSignal }                                                       from "@angular/core/rxjs-interop";
import { type Dimensions }                                                from "@bowstring/interfaces";
import { fromEvent, map, startWith }                                      from "rxjs";


@Injectable({ providedIn: "root" })
export class ViewportService {

  private readonly document: Document                                          = inject<Document>(DOCUMENT);
  private readonly platformId: NonNullable<unknown>                            = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly dimensions$: Signal<Dimensions | undefined>                 = isPlatformBrowser(this.platformId) && this.document.defaultView?.visualViewport ? ((): Signal<Dimensions | undefined> => {
    const visualViewport: VisualViewport     = this.document.defaultView.visualViewport;
    const window: Window & typeof globalThis = this.document.defaultView;

    return toSignal<Dimensions>(
      fromEvent<Event>(
        visualViewport,
        "resize",
      ).pipe<Event | null, Dimensions>(
        startWith<Event, [ null ]>(null),
        map<Event | null, Dimensions>(
          (): Dimensions => ({
            height: window.innerHeight,
            width:  window.innerWidth,
          }),
        ),
      ),
    );
  })() : signal<undefined>(undefined);
  private readonly scrollPosition$: Signal<ViewportScrollPosition | undefined> = isPlatformBrowser(this.platformId) && this.document.defaultView ? ((): Signal<ViewportScrollPosition | undefined> => {
    const window: Window & typeof globalThis = this.document.defaultView;

    return toSignal<ViewportScrollPosition>(
      fromEvent<Event>(
        window,
        "scroll",
      ).pipe<Event | null, ViewportScrollPosition>(
        startWith<Event, [ null ]>(null),
        map<Event | null, ViewportScrollPosition>(
          (): ViewportScrollPosition => ({
            left: window.scrollX,
            top:  window.scrollY,
          }),
        ),
      ),
    );
  })() : signal<undefined>(undefined);

  public readonly height$: Signal<number | undefined>     = computed<number | undefined>(
    (): number | undefined => this.dimensions$()?.height,
  );
  public readonly scrollLeft$: Signal<number | undefined> = computed<number | undefined>(
    (): number | undefined => this.scrollPosition$()?.left,
  );
  public readonly scrollTop$: Signal<number | undefined>  = computed<number | undefined>(
    (): number | undefined => this.scrollPosition$()?.top,
  );
  public readonly width$: Signal<number | undefined>      = computed<number | undefined>(
    (): number | undefined => this.dimensions$()?.width,
  );

}
