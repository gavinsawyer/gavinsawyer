/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser }                                             from "@angular/common";
import { inject, Injectable, PLATFORM_ID, signal, type Signal }          from "@angular/core";
import { toSignal }                                                      from "@angular/core/rxjs-interop";
import { Database, type DataSnapshot, onValue, ref }                     from "@angular/fire/database";
import { map, Observable, type Observer, startWith, type TeardownLogic } from "rxjs";


@Injectable({ providedIn: "root" })
export class ConnectivityService {

  private readonly database: Database               = inject<Database>(Database);
  private readonly platformId: NonNullable<unknown> = inject<NonNullable<unknown>>(PLATFORM_ID);

  public readonly connected$: Signal<boolean> = isPlatformBrowser(this.platformId) ? toSignal<boolean>(
    new Observable<DataSnapshot>(
      (dataSnapshotObserver: Observer<DataSnapshot>): TeardownLogic => onValue(
        ref(
          this.database,
          ".info/connected",
        ),
        (dataSnapshot: DataSnapshot): void => dataSnapshotObserver.next(dataSnapshot),
      ),
    ).pipe<boolean, boolean>(
      map<DataSnapshot, boolean>(
        (dataSnapshot: DataSnapshot): boolean => dataSnapshot.val(),
      ),
      startWith<boolean, [ false ]>(false),
    ),
    { requireSync: true },
  ) : signal<false>(false);

}
