/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { BreakpointObserver, type BreakpointState }             from "@angular/cdk/layout";
import { isPlatformBrowser }                                    from "@angular/common";
import { inject, Injectable, PLATFORM_ID, signal, type Signal } from "@angular/core";
import { toSignal }                                             from "@angular/core/rxjs-interop";
import { map, startWith }                                       from "rxjs";


@Injectable({ providedIn: "root" })
export class ResponsivityService {

  private readonly breakpointObserver: BreakpointObserver = inject<BreakpointObserver>(BreakpointObserver);
  private readonly platformId: NonNullable<unknown>       = inject<NonNullable<unknown>>(PLATFORM_ID);

  public readonly pastMediumBreakpoint$: Signal<boolean> = isPlatformBrowser(this.platformId) ? toSignal<boolean>(
    this.breakpointObserver.observe(`(min-width: 48rem)`).pipe<boolean, boolean>(
      map<BreakpointState, boolean>(
        ({ matches }: BreakpointState): boolean => matches,
      ),
      startWith<boolean, [ boolean ]>(this.breakpointObserver.isMatched(`(min-width: 48rem)`)),
    ),
    { requireSync: true },
  ) : signal<boolean>(this.breakpointObserver.isMatched(`(min-width: 48rem)`));
  public readonly pastSmallBreakpoint$: Signal<boolean>  = isPlatformBrowser(this.platformId) ? toSignal<boolean>(
    this.breakpointObserver.observe(`(min-width: 32rem)`).pipe<boolean, boolean>(
      map<BreakpointState, boolean>(
        ({ matches }: BreakpointState): boolean => matches,
      ),
      startWith<boolean, [ boolean ]>(this.breakpointObserver.isMatched(`(min-width: 32rem)`)),
    ),
    { requireSync: true },
  ) : signal<boolean>(this.breakpointObserver.isMatched(`(min-width: 32rem)`));

}
