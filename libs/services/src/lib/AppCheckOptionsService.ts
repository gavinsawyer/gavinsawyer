/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser }                                                                     from "@angular/common";
import { inject, Injectable, PLATFORM_ID }                                                       from "@angular/core";
import { type AppCheckOptions, type AppCheckToken, CustomProvider, ReCaptchaEnterpriseProvider } from "@angular/fire/app-check";
import { ENVIRONMENT }                                                                           from "@bowstring/injection-tokens";
import { Environment }                                                                           from "@bowstring/interfaces";


@Injectable({ providedIn: "root" })
export class AppCheckOptionsService {

  private readonly environment: Environment         = inject<Environment>(ENVIRONMENT);
  private readonly platformId: NonNullable<unknown> = inject<NonNullable<unknown>>(PLATFORM_ID);

  public readonly appCheckOptions: AppCheckOptions = isPlatformBrowser(this.platformId) ? {
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
  };

}
