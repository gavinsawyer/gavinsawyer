/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { DOCUMENT, isPlatformBrowser }                                                                                                           from "@angular/common";
import { afterRender, inject, Injectable, PLATFORM_ID, signal, type Signal, type WritableSignal }                                                from "@angular/core";
import { toSignal }                                                                                                                              from "@angular/core/rxjs-interop";
import { type FirebaseError }                                                                                                                    from "@angular/fire/app";
import { Auth, createUserWithEmailAndPassword, onIdTokenChanged, signInAnonymously, signInWithEmailAndPassword, type User, type UserCredential } from "@angular/fire/auth";
import { Functions, httpsCallable, type HttpsCallableResult }                                                                                    from "@angular/fire/functions";
import { getAuthErrorMessage }                                                                                                                   from "@bowstring/firebase-interop";
import { ADMIN_AUTH }                                                                                                                            from "@bowstring/injection-tokens";
import { createUserWithPasskey, type FirebaseWebAuthnError, signInWithPasskey, verifyUserWithPasskey }                                           from "@firebase-web-authn/browser";
import { type Auth as AdminAuth, type UserRecord as AdminUserRecord }                                                                            from "firebase-admin/auth";
import { distinctUntilChanged, filter, from, Observable, type Observer, of, switchMap, tap, type TeardownLogic }                                 from "rxjs";
import { ErrorsService }                                                                                                                         from "./ErrorsService";
import { RxSsrService }                                                                                                                          from "./RxSsrService";


@Injectable({ providedIn: "root" })
export class AuthenticationService {

  constructor() {
    afterRender(
      (): void => {
        const hasWebAuthn: boolean = this.document.defaultView ? "PublicKeyCredential" in this.document.defaultView : false;

        if (hasWebAuthn) {
          this.document.defaultView?.PublicKeyCredential.isConditionalMediationAvailable().then<void, never>(
            (conditionalMediationAvailable: boolean): void => this.hasWebAuthnConditionalMediation$.set(conditionalMediationAvailable),
          );
          this.document.defaultView?.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then<void, never>(
            (userVerifyingPlatformAuthenticatorAvailable: boolean): void => this.hasWebAuthnUserVerifyingPlatformAuthenticator$.set(userVerifyingPlatformAuthenticatorAvailable),
          );
        } else {
          this.hasWebAuthnConditionalMediation$.set(false);
          this.hasWebAuthnUserVerifyingPlatformAuthenticator$.set(false);
        }

        this.hasWebAuthn$.set(hasWebAuthn);
      },
    );
  }

  private readonly adminAuth: AdminAuth | null      = inject<AdminAuth>(
    ADMIN_AUTH,
    { optional: true },
  );
  private readonly auth: Auth                       = inject<Auth>(Auth);
  private readonly document: Document               = inject<Document>(DOCUMENT);
  private readonly errorsService: ErrorsService     = inject<ErrorsService>(ErrorsService);
  private readonly functions: Functions             = inject<Functions>(Functions);
  private readonly platformId: NonNullable<unknown> = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly rxSsrService: RxSsrService       = inject<RxSsrService>(RxSsrService);

  public readonly hasWebAuthn$: WritableSignal<boolean | undefined>                                   = signal<undefined>(undefined);
  public readonly hasWebAuthnConditionalMediation$: WritableSignal<boolean | undefined>               = signal<undefined>(undefined);
  public readonly hasWebAuthnUserVerifyingPlatformAuthenticator$: WritableSignal<boolean | undefined> = signal<undefined>(undefined);
  public readonly idToken$: Signal<string | undefined>                                                = toSignal<string>(
    new Observable<User | null>(
      (userObserver: Observer<User | null>): TeardownLogic => {
        if (this.auth.currentUser)
          userObserver.next(this.auth.currentUser);
        else
          this.auth.authStateReady().then<void>(
            (): void => userObserver.next(this.auth.currentUser),
          );

        return onIdTokenChanged(
          this.auth,
          (user: User | null): void => userObserver.next(user),
          (error: Error): never => {
            userObserver.error(error);

            throw error;
          },
          (): void => userObserver.complete(),
        );
      },
    ).pipe<User | null, User, string>(
      distinctUntilChanged<User | null>(),
      filter<User | null, User>((user: User | null): user is User => !!user),
      this.rxSsrService.wrap<User, string>(
        switchMap<User, Observable<string>>((user: User): Observable<string> => from<Promise<string>>(user.getIdToken())),
        "0196bb78-e41c-765c-90c7-ea9ba3661398",
      ),
    ),
  );
  public readonly isAdmin$: Signal<boolean | undefined>                                               = toSignal<boolean>(
    new Observable<User | null>(
      (userObserver: Observer<User | null>): TeardownLogic => {
        if (this.auth.currentUser)
          userObserver.next(this.auth.currentUser);
        else
          this.auth.authStateReady().then<void>((): void => userObserver.next(this.auth.currentUser));

        return onIdTokenChanged(
          this.auth,
          (user: User | null): void => userObserver.next(user),
          (error: Error): never => {
            userObserver.error(error);

            throw error;
          },
          (): void => userObserver.complete(),
        );
      },
    ).pipe<User | null, User, boolean>(
      distinctUntilChanged<User | null>(),
      filter<User | null, User>((user: User | null): user is User => !!user),
      this.rxSsrService.wrap<User, boolean>(
        switchMap<User, Observable<boolean>>(
          (user: User): Observable<boolean> => user.isAnonymous ? of<false>(false) : from<Promise<boolean>>(
            this.adminAuth ? this.adminAuth.getUser(user.uid).then<boolean, never>(
              ({ customClaims }: AdminUserRecord): boolean => customClaims?.["admin"] || false,
              (error: Error): never => {
                console.error("Something went wrong.");

                throw error;
              },
            ) : httpsCallable<null, boolean>(
              this.functions,
              "getIsAdmin",
            )().then<boolean, never>(
              ({ data: isAdmin }: HttpsCallableResult<boolean>): boolean => isAdmin,
              (error: Error): never => {
                console.error("Something went wrong.");

                throw error;
              },
            ),
          ),
        ),
        "0196bb78-3747-76b4-adc4-3cf6d0f444a9",
      ),
    ),
  );
  public readonly isVerified$: Signal<boolean | undefined>                                            = toSignal<boolean>(
    new Observable<User | null>(
      (userObserver: Observer<User | null>): TeardownLogic => {
        if (this.auth.currentUser)
          userObserver.next(this.auth.currentUser);
        else
          this.auth.authStateReady().then<void>((): void => userObserver.next(this.auth.currentUser));

        return onIdTokenChanged(
          this.auth,
          (user: User | null): void => userObserver.next(user),
          (error: Error): never => {
            userObserver.error(error);

            throw error;
          },
          (): void => userObserver.complete(),
        );
      },
    ).pipe<User | null, User, boolean>(
      distinctUntilChanged<User | null>(),
      filter<User | null, User>((user: User | null): user is User => !!user),
      this.rxSsrService.wrap<User, boolean>(
        switchMap<User, Observable<boolean>>(
          (user: User): Observable<boolean> => user.isAnonymous ? of<false>(false) : from<Promise<boolean>>(
            this.adminAuth ? this.adminAuth.getUser(user.uid).then<boolean, never>(
              ({ customClaims }: AdminUserRecord): boolean => customClaims?.["verified"] || false,
              (error: Error): never => {
                console.error("Something went wrong.");

                throw error;
              },
            ) : httpsCallable<null, boolean>(
              this.functions,
              "getIsVerified",
            )().then<boolean, never>(
              ({ data: isVerified }: HttpsCallableResult<boolean>): boolean => isVerified,
              (error: Error): never => {
                console.error("Something went wrong.");

                throw error;
              },
            ),
          ),
        ),
        "0199ee42-d58c-7193-9fc0-4378c166bd9b",
      ),
    ),
  );
  public readonly userObservable: Observable<User>                                                    = new Observable<User | null>(
    (userObserver: Observer<User | null>): TeardownLogic => {
      if (this.auth.currentUser)
        userObserver.next(this.auth.currentUser);
      else
        this.auth.authStateReady().then<void>((): void => userObserver.next(this.auth.currentUser));

      return onIdTokenChanged(
        this.auth,
        (user: User | null): void => userObserver.next(user),
        (error: Error): never => {
          userObserver.error(error);

          throw error;
        },
        (): void => userObserver.complete(),
      );
    },
  ).pipe<User | null, User | null, User>(
    distinctUntilChanged<User | null>(),
    tap<User | null>(
      (user: User | null): void => {
        if (!user && isPlatformBrowser(this.platformId))
          signInAnonymously(this.auth).catch<never>(
            (firebaseError: FirebaseError): never => {
              console.error(firebaseError.code);

              throw firebaseError;
            },
          );
      },
    ),
    filter<User | null, User>((user: User | null): user is User => !!user),
  );
  public readonly user$: Signal<User | undefined>                                                     = toSignal<User>(
    this.userObservable.pipe<User>(
      this.rxSsrService.useState<User>("019672d4-6be7-75ef-b881-2cb04bc0ce7f"),
    ),
  );

  public async createUserWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    ).catch<never>(
      (firebaseError: FirebaseError): never => {
        this.errorsService.createError(getAuthErrorMessage(firebaseError));

        throw firebaseError;
      },
    );
  }
  public async createUserWithPasskey(name: string): Promise<UserCredential> {
    return createUserWithPasskey(
      this.auth,
      this.functions,
      name,
    ).catch<never>(
      (firebaseWebAuthnError: FirebaseWebAuthnError): never => {
        this.errorsService.createError(firebaseWebAuthnError.message);

        throw firebaseWebAuthnError;
      },
    );
  }
  public signInAnonymously(): Promise<void> {
    return signInAnonymously(this.auth).then<void, never>(
      (): void => void (0),
      (firebaseError: FirebaseError): never => {
        this.errorsService.createError(getAuthErrorMessage(firebaseError));

        throw firebaseError;
      },
    );
  }
  public signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.auth,
      email,
      password,
    ).catch<never>(
      (firebaseError: FirebaseError): never => {
        this.errorsService.createError(getAuthErrorMessage(firebaseError));

        throw firebaseError;
      },
    );
  }
  public signInWithPasskey(): Promise<UserCredential> {
    return signInWithPasskey(
      this.auth,
      this.functions,
    ).catch<never>(
      (firebaseWebAuthnError: FirebaseWebAuthnError): never => {
        this.errorsService.createError(firebaseWebAuthnError.code === "firebaseWebAuthn/no-op" ? "You're already signed in as this user." : firebaseWebAuthnError.message);

        throw firebaseWebAuthnError;
      },
    );
  }
  public verifyUserWithPasskey(): Promise<void> {
    return verifyUserWithPasskey(
      this.auth,
      this.functions,
    ).then<void, never>(
      (): void => void (0),
      (firebaseWebAuthnError: FirebaseWebAuthnError): never => {
        this.errorsService.createError(firebaseWebAuthnError.message);

        throw firebaseWebAuthnError;
      },
    );
  }

}
