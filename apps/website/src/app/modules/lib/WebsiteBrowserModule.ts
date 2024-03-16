import { IMAGE_LOADER, ImageLoaderConfig }                                                       from "@angular/common";
import { Injector, NgModule }                                                                    from "@angular/core";
import { Analytics, getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from "@angular/fire/analytics";
import { FirebaseApp, initializeApp, provideFirebaseApp }                                        from "@angular/fire/app";
import { AppCheck, initializeAppCheck, provideAppCheck }                                         from "@angular/fire/app-check";
import { Auth, getAuth, provideAuth }                                                            from "@angular/fire/auth";
import { Firestore, getFirestore, provideFirestore }                                             from "@angular/fire/firestore";
import { ReactiveFormsModule }                                                                   from "@angular/forms";
import { BrowserModule, provideClientHydration }                                                 from "@angular/platform-browser";
import { RouterModule }                                                                          from "@angular/router";
import { BannerComponent, HeaderComponent, routes as portfolioRoutes }                           from "@gavinsawyer/components";
import { ENVIRONMENT, GIT_INFO, PACKAGE_VERSION }                                                from "@gavinsawyer/injection-tokens";
import { AppCheckOptionsService }                                                                from "@gavinsawyer/services";
import { gitInfo }                                                                               from "../../../.git-info";
import { packageVersion }                                                                        from "../../../.package-version";
import { environment }                                                                           from "../../../environment";
import { AsideComponent, RootComponent, routes as websiteRoutes }                                from "../../components";


@NgModule({
  bootstrap:    [
    RootComponent,
  ],
  declarations: [
    RootComponent,
  ],
  imports:      [
    AsideComponent,
    BannerComponent,
    BrowserModule,
    provideAnalytics(
      (): Analytics => getAnalytics(),
    ),
    provideAppCheck(
      (injector: Injector): AppCheck => initializeAppCheck(
        undefined,
        injector.get(AppCheckOptionsService).appCheckOptions,
      ),
    ),
    provideAuth(
      (): Auth => getAuth(),
    ),
    provideFirebaseApp(
      (): FirebaseApp => initializeApp(environment.firebase),
    ),
    provideFirestore(
      (): Firestore => getFirestore(),
    ),
    ReactiveFormsModule,
    RouterModule.forRoot(
      [
        ...websiteRoutes,
        ...portfolioRoutes,
      ],
      {
        bindToComponentInputs:     true,
        initialNavigation:         "enabledBlocking",
        scrollPositionRestoration: "enabled",
      },
    ),
    HeaderComponent,
  ],
  providers:    [
    {
      provide:  ENVIRONMENT,
      useValue: environment,
    },
    {
      provide:  GIT_INFO,
      useValue: gitInfo,
    },
    {
      provide:  IMAGE_LOADER,
      useValue: (imageLoaderConfig: ImageLoaderConfig): string => "/assets/" + (imageLoaderConfig.loaderParams?.["type"] === "Focus Icon" ? "icons/focus/" + imageLoaderConfig.src.replace(
        /\s+/g,
        "-",
      ) + ".svg" : imageLoaderConfig.loaderParams?.["type"] === "Icon" ? "icons/" + imageLoaderConfig.src.replace(
        /\s+/g,
        "-",
      ) + ".svg" : imageLoaderConfig.loaderParams?.["type"] === "Photo" ? "photos/" + [
        imageLoaderConfig.src.replace(
          /\s+/g,
          "-",
        ),
        (imageLoaderConfig.width || imageLoaderConfig.loaderParams?.["maxWidth"]) + "px",
        "webp",
      ].join(".") : ""),
    },
    {
      provide:  PACKAGE_VERSION,
      useValue: packageVersion,
    },
    provideClientHydration(),
    ScreenTrackingService,
    UserTrackingService,
  ],
})
export class WebsiteBrowserModule {
}
