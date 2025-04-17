/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser }                                                                                  from "@angular/common";
import { inject, Injectable, PLATFORM_ID }                                                                    from "@angular/core";
import { type AppCheck, type AppCheckToken, CustomProvider, initializeAppCheck, ReCaptchaEnterpriseProvider } from "@angular/fire/app-check";
import { ENVIRONMENT }                                                                                        from "@bowstring/injection-tokens";
import { Environment }                                                                                        from "@bowstring/interfaces";
import { FirebaseAppService }                                                                                 from "./FirebaseAppService";


@Injectable({ providedIn: "root" })
export class AppCheckService {

  private readonly environment: Environment               = inject<Environment>(ENVIRONMENT);
  private readonly firebaseAppService: FirebaseAppService = inject<FirebaseAppService>(FirebaseAppService);
  private readonly platformId: NonNullable<unknown>       = inject<NonNullable<unknown>>(PLATFORM_ID);

  public readonly appCheck: AppCheck = initializeAppCheck(
    this.firebaseAppService.firebaseApp,
    isPlatformBrowser(this.platformId) ? {
      isTokenAutoRefreshEnabled: true,
      provider:                  new ReCaptchaEnterpriseProvider(this.environment.apis.recaptcha.siteKey),
    } : {
      isTokenAutoRefreshEnabled: false,
      provider:                  new CustomProvider(
        {
          getToken: async (): Promise<AppCheckToken> => ({
            token:            process.env[`APP_CHECK_TOKEN_${ this.environment.app.toUpperCase() }`] as string,
            expireTimeMillis: Date.now(),
          }),
        },
      ),
    },
  );

}
