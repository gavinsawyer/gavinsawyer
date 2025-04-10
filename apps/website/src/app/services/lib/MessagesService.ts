/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser }                                                                                                                                   from "@angular/common";
import { inject, Injectable, PLATFORM_ID, signal, type Signal }                                                                                                from "@angular/core";
import { toSignal }                                                                                                                                            from "@angular/core/rxjs-interop";
import { Auth, onIdTokenChanged, type User }                                                                                                                   from "@angular/fire/auth";
import { collection, type CollectionReference, collectionSnapshots, doc, type DocumentReference, Firestore, query, type QueryDocumentSnapshot, setDoc, where } from "@angular/fire/firestore";
import { AuthenticationService }                                                                                                                               from "@bowstring/services";
import { filter, map, Observable, type Observer, startWith, switchMap, type TeardownLogic }                                                                    from "rxjs";
import { type MessageDocument }                                                                                                                                from "../../interfaces";


@Injectable({ providedIn: "root" })
export class MessagesService {

  private readonly auth: Auth                                   = inject<Auth>(Auth);
  private readonly authenticationService: AuthenticationService = inject<AuthenticationService>(AuthenticationService);
  private readonly firestore: Firestore                         = inject<Firestore>(Firestore);

  public readonly messageDocuments$: Signal<Array<MessageDocument> | undefined> = isPlatformBrowser(inject<object>(PLATFORM_ID)) ? toSignal<Array<MessageDocument> | undefined>(
    new Observable<User | null>(
      (userObserver: Observer<User | null>): TeardownLogic => {
        userObserver.next(this.auth.currentUser);

        onIdTokenChanged(
          this.auth,
          (user: User | null): void => userObserver.next(user),
          (error: Error): never => {
            userObserver.error(error);

            throw error;
          },
          (): void => userObserver.complete(),
        );
      },
    ).pipe<User, Array<MessageDocument>, Array<MessageDocument> | undefined>(
      filter<User | null, User>(
        (user: User | null): user is User => !!user,
      ),
      switchMap<User, Observable<Array<MessageDocument>>>(
        ({ uid: userId }: User): Observable<Array<MessageDocument>> => collectionSnapshots<MessageDocument>(
          query<MessageDocument, MessageDocument>(
            collection(
              this.firestore,
              "messages",
            ) as CollectionReference<MessageDocument, MessageDocument>,
            where(
              "__name__",
              "==",
              userId,
            ),
          ),
        ).pipe<Array<MessageDocument>>(
          map<Array<QueryDocumentSnapshot<MessageDocument>>, Array<MessageDocument>>(
            (messageDocumentSnapshots: Array<QueryDocumentSnapshot<MessageDocument>>): Array<MessageDocument> => messageDocumentSnapshots.map<MessageDocument>(
              (messageDocumentSnapshot: QueryDocumentSnapshot<MessageDocument>): MessageDocument => messageDocumentSnapshot.data(),
            ),
          ),
        ),
      ),
      startWith<Array<MessageDocument>, [ undefined ]>(undefined),
    ),
    {
      requireSync: true,
    },
  ) : signal<undefined>(undefined);

  public createMessageDocument(messageDocument: MessageDocument): Promise<void> {
    return setDoc<MessageDocument, MessageDocument>(
      doc(
        this.firestore,
        "/messages/" + this.authenticationService.user$()?.uid,
      ) as DocumentReference<MessageDocument, MessageDocument>,
      messageDocument,
    );
  };

}
