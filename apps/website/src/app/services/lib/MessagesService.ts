/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { inject, Injectable, type Signal }                                               from "@angular/core";
import { toSignal }                                                                      from "@angular/core/rxjs-interop";
import { type User }                                                                     from "@angular/fire/auth";
import { collection, collectionData, type CollectionReference, Firestore, query, where } from "@angular/fire/firestore";
import { AuthenticationService, RxSsrService }                                           from "@bowstring/services";
import { catchError, map, Observable, of, switchMap }                                    from "rxjs";
import { type MessageDocument }                                                          from "../../interfaces";


@Injectable({ providedIn: "root" })
export class MessagesService {

  private readonly authenticationService: AuthenticationService = inject<AuthenticationService>(AuthenticationService);
  private readonly firestore: Firestore                         = inject<Firestore>(Firestore);
  private readonly rxSsrService: RxSsrService                   = inject<RxSsrService>(RxSsrService);

  public readonly messageDocument$: Signal<MessageDocument | undefined> = toSignal<MessageDocument | undefined>(
    this.authenticationService.userObservable.pipe<MessageDocument | undefined>(
      this.rxSsrService.wrap<User, MessageDocument | undefined>(
        switchMap<User, Observable<MessageDocument | undefined>>(
          ({ uid: userId }: User): Observable<MessageDocument | undefined> => collectionData<MessageDocument>(
            query<MessageDocument, MessageDocument>(
              collection(
                this.firestore,
                "messages",
              ) as CollectionReference<MessageDocument, MessageDocument>,
              where(
                "userId",
                "==",
                userId,
              ),
            ),
          ).pipe<Array<MessageDocument> | undefined, MessageDocument | undefined>(
            catchError<Array<MessageDocument>, Observable<undefined>>((): Observable<undefined> => of<undefined>(undefined)),
            map<Array<MessageDocument> | undefined, MessageDocument | undefined>((bagDocuments?: Array<MessageDocument>): MessageDocument | undefined => bagDocuments?.[0]),
          ),
        ),
        "0198a002-2278-75af-98c6-efe4fbddd0ea",
      ),
    ),
  );

}
