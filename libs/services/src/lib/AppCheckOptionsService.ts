import { isPlatformBrowser }                                                           from "@angular/common";
import { inject, Injectable, PLATFORM_ID }                                             from "@angular/core";
import { AppCheckOptions, AppCheckToken, CustomProvider, ReCaptchaEnterpriseProvider } from "@angular/fire/app-check";
import { ENVIRONMENT }                                                                 from "@gavinsawyer/injection-tokens";
import { Environment }                                                                 from "@gavinsawyer/interfaces";


@Injectable({
  providedIn: "root",
})
export class AppCheckOptionsService {

  private readonly environment: Environment = inject<Environment>(ENVIRONMENT);

  public readonly appCheckOptions: AppCheckOptions = isPlatformBrowser(inject<object>(PLATFORM_ID)) ? {
    isTokenAutoRefreshEnabled: true,
    provider:                  new ReCaptchaEnterpriseProvider(this.environment.recaptchaKeyID),
  } : {
    isTokenAutoRefreshEnabled: false,
    provider:                  new CustomProvider(
      {
        getToken: (): Promise<AppCheckToken> => Promise.resolve(
          {
            token:            process.env["APP_CHECK_TOKEN_" + this.environment.project.toUpperCase()] as string,
            expireTimeMillis: Date.now(),
          },
        ),
      },
    ),
  };

}
