/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser }                                    from "@angular/common";
import { inject, Injectable, PLATFORM_ID }                      from "@angular/core";
import { type FirebaseApp, initializeApp, initializeServerApp } from "@angular/fire/app";
import { ENVIRONMENT }                                          from "@bowstring/injection-tokens";
import { Environment }                                          from "@bowstring/interfaces";


@Injectable({ providedIn: "root" })
export class FirebaseAppService {

  private readonly environment: Environment         = inject<Environment>(ENVIRONMENT);
  private readonly platformId: NonNullable<unknown> = inject<NonNullable<unknown>>(PLATFORM_ID);

  public readonly firebaseApp: FirebaseApp = isPlatformBrowser(this.platformId) ? initializeApp(this.environment.apis.firebase) : initializeServerApp(
    this.environment.apis.firebase,
    {},
  );

}
