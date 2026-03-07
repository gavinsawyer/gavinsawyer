/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { DOCUMENT }                                                                           from "@angular/common";
import { inject, Injectable }                                                                 from "@angular/core";
import { toObservable }                                                                       from "@angular/core/rxjs-interop";
import { ViewportService }                                                                    from "@bowstring/core";
import { mergeWith, Observable, type Observer, scan, startWith, Subject, type TeardownLogic } from "rxjs";


@Injectable({ providedIn: "root" })
export class GlassMaskIdTickService {

  private readonly document: Document               = inject<Document>(DOCUMENT);
  private readonly tickedSubject: Subject<void>     = new Subject<void>();
  private readonly viewportService: ViewportService = inject<ViewportService>(ViewportService);

  public readonly glassMaskIdTickObservable: Observable<0 | 1> = this.tickedSubject.asObservable().pipe<void | number | undefined, 0 | 1, 0 | 1>(
    mergeWith<void, [ void, number | undefined, number | undefined ]>(
      new Observable<void>(
        (bodyDimensionsObserver: Observer<void>): TeardownLogic => {
          bodyDimensionsObserver.next();

          const resizeObserver: ResizeObserver = new ResizeObserver((): void => bodyDimensionsObserver.next());

          resizeObserver.observe(this.document.body);

          return (): void => resizeObserver.disconnect();
        },
      ),
      toObservable<number | undefined>(this.viewportService.scrollLeft$),
      toObservable<number | undefined>(this.viewportService.scrollTop$),
    ),
    scan<void | number | undefined, 0 | 1>(
      (accumulator: 0 | 1): 0 | 1 => accumulator ? 0 : 1,
      0,
    ),
    startWith<0 | 1, [ 0 ]>(0),
  );

  public tick(): void {
    setTimeout((): void => this.tickedSubject.next());
  }

}
