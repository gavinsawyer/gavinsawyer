/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { inject, Injectable, type Signal }                                    from "@angular/core";
import { toSignal }                                                           from "@angular/core/rxjs-interop";
import { FirebaseApp }                                                        from "@angular/fire/app";
import { doc, docData, type DocumentReference, type Firestore, getFirestore } from "@angular/fire/firestore";
import { RxSsrService }                                                       from "@bowstring/services";
import { type Focus, type PublicDocument }                                    from "@gavinsawyer/shortcuts-api";
import { catchError, map, type Observable, of, switchMap }                    from "rxjs";


@Injectable({ providedIn: "root" })
export class FocusService {

  private readonly firebaseApp: FirebaseApp   = inject<FirebaseApp>(FirebaseApp);
  private readonly firestore: Firestore       = getFirestore(
    this.firebaseApp,
    "shortcuts-api",
  );
  private readonly rxSsrService: RxSsrService = inject<RxSsrService>(RxSsrService);

  public readonly focus$: Signal<Focus | undefined> = toSignal<Focus | undefined>(
    of<undefined>(undefined).pipe(
      this.rxSsrService.wrap<undefined, Focus | undefined>(
        switchMap<undefined, Observable<Focus | undefined>>(
          (): Observable<Focus | undefined> => docData<PublicDocument>(
            doc(
              this.firestore,
              "environment/public",
            ) as DocumentReference<PublicDocument, PublicDocument>,
          ).pipe<PublicDocument | undefined, Focus | undefined>(
            catchError<PublicDocument | undefined, Observable<undefined>>(
              (): Observable<undefined> => of<undefined>(undefined),
            ),
            map<PublicDocument | undefined, Focus | undefined>(
              (publicDocument?: PublicDocument): Focus | undefined => publicDocument?.users["gavin"]?.focus,
            ),
          ),
        ),
        "0198a027-4c5f-71cc-a7ca-2e9aabaf5d87",
      ),
    ),
  );

}
