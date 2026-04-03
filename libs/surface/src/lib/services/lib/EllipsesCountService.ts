/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { isPlatformBrowser }                                    from "@angular/common";
import { inject, Injectable, PLATFORM_ID, signal, type Signal } from "@angular/core";
import { toSignal }                                             from "@angular/core/rxjs-interop";
import { interval, map, startWith }                             from "rxjs";


@Injectable({ providedIn: "root" })
export class EllipsesCountService {

  public readonly ellipsesCount$: Signal<number> = isPlatformBrowser(inject<object>(PLATFORM_ID)) ? toSignal<number>(
    interval(800).pipe<number, number>(
      map<number, number>((n: number): number => (n % 3) + 1),
      startWith<number, [ 3 ]>(3),
    ),
    { requireSync: true },
  ) : signal<3>(3);

}
