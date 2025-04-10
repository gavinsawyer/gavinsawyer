/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser }                                    from "@angular/common";
import { inject, Injectable, PLATFORM_ID, signal, type Signal } from "@angular/core";
import { toSignal }                                             from "@angular/core/rxjs-interop";
import { interval, map, startWith }                             from "rxjs";


@Injectable({ providedIn: "root" })
export class EllipsesService {

  public readonly ellipses$: Signal<string> = isPlatformBrowser(inject<object>(PLATFORM_ID)) ? toSignal<string>(
    interval(800).pipe<string, string>(
      map<number, string>(
        (n: number): string => ".".repeat(((n + 1) % 3) + 1),
      ),
      startWith<string, [ "." ]>("."),
    ),
    { requireSync: true },
  ) : signal<string>(".");

}
