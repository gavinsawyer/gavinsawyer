/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser }                                                                      from "@angular/common";
import { afterRender, inject, Injectable, PLATFORM_ID, signal, type Signal, type WritableSignal } from "@angular/core";
import { toSignal }                                                                               from "@angular/core/rxjs-interop";
import { type FirebaseError }                                                                     from "@angular/fire/app";
import { Auth, onIdTokenChanged, signInAnonymously, type User }                                   from "@angular/fire/auth";
import { filter, Observable, type Observer, tap, type TeardownLogic }                             from "rxjs";
import { fromPromise }                                                                            from "rxjs/internal/observable/innerFrom";


@Injectable({ providedIn: "root" })
export class AuthenticationService {

  constructor() {
    afterRender(
      (): void => this.hasWebAuthn$.set(typeof PublicKeyCredential === "function"),
    );
  }

  private readonly auth: Auth                       = inject<Auth>(Auth);
  private readonly platformId: NonNullable<unknown> = inject<NonNullable<unknown>>(PLATFORM_ID);

  public readonly hasWebAuthn$: WritableSignal<boolean | undefined>                           = signal<undefined>(undefined);
  public readonly hasWebAuthnConditionalMediation$: Signal<boolean | undefined>               = isPlatformBrowser(this.platformId) ? toSignal<boolean>(fromPromise<boolean>(PublicKeyCredential.isConditionalMediationAvailable())) : signal<undefined>(undefined);
  public readonly hasWebAuthnUserVerifyingPlatformAuthenticator$: Signal<boolean | undefined> = isPlatformBrowser(this.platformId) ? toSignal<boolean>(fromPromise<boolean>(PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())) : signal<undefined>(undefined);
  public readonly user$: Signal<User | undefined>                                             = isPlatformBrowser(this.platformId) ? toSignal<User>(
    new Observable<User | null>(
      (userObserver: Observer<User | null>): TeardownLogic => onIdTokenChanged(
        this.auth,
        (user: User | null): void => userObserver.next(user),
        (error: Error): never => {
          userObserver.error(error);

          throw error;
        },
        (): void => userObserver.complete(),
      ),
    ).pipe<User | null, User>(
      tap<User | null>(
        async (user: User | null): Promise<void> => {
          if (!user)
            return signInAnonymously(this.auth).then<void, never>(
              (): void => void (0),
              (firebaseError: FirebaseError): never => {
                console.error(firebaseError.code);

                throw firebaseError;
              },
            );
        },
      ),
      filter<User | null, User>(
        (user: User | null): user is User => !!user,
      ),
    ),
  ) : signal<undefined>(undefined);

}
