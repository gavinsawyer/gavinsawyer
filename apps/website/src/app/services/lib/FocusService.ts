/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser }                                                                              from "@angular/common";
import { inject, Injectable, PLATFORM_ID, signal, type Signal }                                           from "@angular/core";
import { toSignal }                                                                                       from "@angular/core/rxjs-interop";
import { FirebaseApp }                                                                                    from "@angular/fire/app";
import { doc, docSnapshots, type DocumentReference, type DocumentSnapshot, type Firestore, getFirestore } from "@angular/fire/firestore";
import { type Focus, type PublicDocument }                                                                from "@gavinsawyer/shortcuts-api";
import { map, type Observable }                                                                           from "rxjs";


@Injectable({ providedIn: "root" })
export class FocusService {

  private readonly firebaseApp: FirebaseApp         = inject<FirebaseApp>(FirebaseApp);
  private readonly firestore: Firestore             = getFirestore(
    this.firebaseApp,
    "shortcuts-api",
  );
  private readonly platformId: NonNullable<unknown> = inject<NonNullable<unknown>>(PLATFORM_ID);

  public readonly focus$: Signal<Focus | undefined> = isPlatformBrowser(this.platformId) ? toSignal<Focus | undefined>(
    (docSnapshots<PublicDocument>(
      doc(
        this.firestore,
        "environment/public",
      ) as DocumentReference<PublicDocument, PublicDocument>,
    ) as Observable<DocumentSnapshot<PublicDocument, PublicDocument>>).pipe<Focus | undefined>(
      map<DocumentSnapshot<PublicDocument, PublicDocument>, Focus | undefined>(
        (publicDocumentSnapshot: DocumentSnapshot<PublicDocument, PublicDocument>): Focus | undefined => publicDocumentSnapshot.data()?.users["gavin"]?.focus,
      ),
    ),
  ) : signal<undefined>(undefined);

}
