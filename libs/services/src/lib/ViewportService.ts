/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type ViewportScrollPosition }                                    from "@angular/cdk/scrolling";
import { DOCUMENT, isPlatformBrowser }                                    from "@angular/common";
import { computed, inject, Injectable, PLATFORM_ID, signal, type Signal } from "@angular/core";
import { toSignal }                                                       from "@angular/core/rxjs-interop";
import { type Dimensions }                                                from "@bowstring/interfaces";
import { animationFrameScheduler, fromEvent, map, observeOn, startWith }  from "rxjs";


@Injectable({ providedIn: "root" })
export class ViewportService {

  private readonly document: Document                                          = inject<Document>(DOCUMENT);
  private readonly platformId: NonNullable<unknown>                            = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly dimensions$: Signal<Dimensions | undefined>                 = isPlatformBrowser(this.platformId) && this.document.defaultView?.visualViewport ? ((window: Window & typeof globalThis): Signal<Dimensions | undefined> => toSignal<Dimensions>(
    fromEvent<Event>(
      this.document.defaultView.visualViewport,
      "resize",
      { passive: true },
    ).pipe<Event | null, Dimensions, Dimensions>(
      startWith<Event, [ null ]>(null),
      map<Event | null, Dimensions>(
        (): Dimensions => ({
          height: window.innerHeight,
          width:  window.innerWidth,
        }),
      ),
      observeOn<Dimensions>(animationFrameScheduler),
    ),
  ))(this.document.defaultView) : signal<undefined>(undefined);
  private readonly scrollPosition$: Signal<ViewportScrollPosition | undefined> = isPlatformBrowser(this.platformId) && this.document.defaultView ? ((window: Window & typeof globalThis): Signal<ViewportScrollPosition | undefined> => toSignal<ViewportScrollPosition>(
    fromEvent<Event>(
      window,
      "scroll",
      { passive: true },
    ).pipe<Event | null, ViewportScrollPosition, ViewportScrollPosition>(
      startWith<Event, [ null ]>(null),
      map<Event | null, ViewportScrollPosition>(
        (): ViewportScrollPosition => ({
          left: window.scrollX,
          top:  window.scrollY,
        }),
      ),
      observeOn<ViewportScrollPosition>(animationFrameScheduler),
    ),
  ))(this.document.defaultView) : signal<undefined>(undefined);

  public readonly height$: Signal<number | undefined>     = computed<number | undefined>((): number | undefined => this.dimensions$()?.height);
  public readonly scrollLeft$: Signal<number | undefined> = computed<number | undefined>((): number | undefined => this.scrollPosition$()?.left);
  public readonly scrollTop$: Signal<number | undefined>  = computed<number | undefined>((): number | undefined => this.scrollPosition$()?.top);
  public readonly width$: Signal<number | undefined>      = computed<number | undefined>((): number | undefined => this.dimensions$()?.width);

}
