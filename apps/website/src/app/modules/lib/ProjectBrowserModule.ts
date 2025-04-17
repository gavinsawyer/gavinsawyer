/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { provideHttpClient, withFetch }                                                                                                                                                                                                                                                                                                                                                                                                                             from "@angular/common/http";
import { Injector, NgModule }                                                                                                                                                                                                                                                                                                                                                                                                                                       from "@angular/core";
import { type Analytics, getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService }                                                                                                                                                                                                                                                                                                                                                               from "@angular/fire/analytics";
import { type FirebaseApp, provideFirebaseApp }                                                                                                                                                                                                                                                                                                                                                                                                                     from "@angular/fire/app";
import { type AppCheck, provideAppCheck }                                                                                                                                                                                                                                                                                                                                                                                                                           from "@angular/fire/app-check";
import { type Auth, getAuth, provideAuth }                                                                                                                                                                                                                                                                                                                                                                                                                          from "@angular/fire/auth";
import { AngularFirestoreModule }                                                                                                                                                                                                                                                                                                                                                                                                                                   from "@angular/fire/compat/firestore";
import { type Database, getDatabase, provideDatabase }                                                                                                                                                                                                                                                                                                                                                                                                              from "@angular/fire/database";
import { type Firestore, getFirestore, provideFirestore }                                                                                                                                                                                                                                                                                                                                                                                                           from "@angular/fire/firestore";
import { type Functions, getFunctions, provideFunctions }                                                                                                                                                                                                                                                                                                                                                                                                           from "@angular/fire/functions";
import { ReactiveFormsModule }                                                                                                                                                                                                                                                                                                                                                                                                                                      from "@angular/forms";
import { GoogleMapsModule }                                                                                                                                                                                                                                                                                                                                                                                                                                         from "@angular/google-maps";
import { BrowserModule }                                                                                                                                                                                                                                                                                                                                                                                                                                            from "@angular/platform-browser";
import { provideRouter, RouterOutlet, withComponentInputBinding, withEnabledBlockingInitialNavigation, withInMemoryScrolling }                                                                                                                                                                                                                                                                                                                                      from "@angular/router";
import * as brandLib                                                                                                                                                                                                                                                                                                                                                                                                                                                from "@bowstring/brand";
import { AboveComponent, BelowComponent, BoxComponent, ButtonComponent, CaptionComponent, DividerComponent, ErrorComponent, ErrorsContainerComponent, FlexboxContainerComponent, FooterComponent, FormComponent, GridContainerComponent, HeaderComponent, HeadingGroupComponent, LabelComponent, LinkComponent, ListComponent, MainComponent, NavComponent, routes as bowstringRoutes, SectionComponent, SheetComponent, SymbolComponent, TextFieldInputComponent } from "@bowstring/components";
import { ListItemDirective }                                                                                                                                                                                                                                                                                                                                                                                                                                        from "@bowstring/directives";
import { BOWSTRING_ROUTES, BRAND, ENVIRONMENT, GIT_INFO_PARTIAL, PACKAGE_VERSION, PROJECT_NAME, PROJECT_ROUTES }                                                                                                                                                                                                                                                                                                                                                    from "@bowstring/injection-tokens";
import { FindRouteByPathPipe }                                                                                                                                                                                                                                                                                                                                                                                                                                      from "@bowstring/pipes";
import { AppCheckService, FirebaseAppService }                                                                                                                                                                                                                                                                                                                                                                                                                      from "@bowstring/services";
import project                                                                                                                                                                                                                                                                                                                                                                                                                                                      from "../../../../project.json";
import { gitInfoPartial }                                                                                                                                                                                                                                                                                                                                                                                                                                           from "../../../.gitInfoPartial";
import { packageVersion }                                                                                                                                                                                                                                                                                                                                                                                                                                           from "../../../.packageVersion";
import { environment }                                                                                                                                                                                                                                                                                                                                                                                                                                              from "../../../environment";
import { RootComponent, routes as projectRoutes }                                                                                                                                                                                                                                                                                                                                                                                                                   from "../../components";
import { PROJECT_LOCALE_IDS }                                                                                                                                                                                                                                                                                                                                                                                                                                       from "../../injection tokens";


@NgModule(
  {
    bootstrap:    [ RootComponent ],
    declarations: [ RootComponent ],
    imports:      [
      AngularFirestoreModule.enablePersistence(),
      AboveComponent,
      BelowComponent,
      BoxComponent,
      BrowserModule,
      ButtonComponent,
      CaptionComponent,
      DividerComponent,
      ErrorComponent,
      ErrorsContainerComponent,
      FindRouteByPathPipe,
      FlexboxContainerComponent,
      FooterComponent,
      FormComponent,
      GoogleMapsModule,
      GridContainerComponent,
      HeaderComponent,
      HeadingGroupComponent,
      LabelComponent,
      LinkComponent,
      ListComponent,
      ListItemDirective,
      MainComponent,
      NavComponent,
      ReactiveFormsModule,
      RouterOutlet,
      SectionComponent,
      SheetComponent,
      SymbolComponent,
      TextFieldInputComponent,
    ],
    providers:    [
      {
        provide:  BRAND,
        useValue: brandLib,
      },
      {
        provide:  ENVIRONMENT,
        useValue: environment,
      },
      {
        provide:  GIT_INFO_PARTIAL,
        useValue: gitInfoPartial,
      },
      {
        provide:  PACKAGE_VERSION,
        useValue: packageVersion,
      },
      {
        provide:  PROJECT_LOCALE_IDS,
        useValue: [
          "en-US",
          ...Object.keys(project.i18n.locales),
        ],
      },
      {
        provide:  PROJECT_NAME,
        useValue: project.name,
      },
      {
        provide:  PROJECT_ROUTES,
        useValue: projectRoutes,
      },
      {
        provide:  BOWSTRING_ROUTES,
        useValue: bowstringRoutes,
      },
      provideAnalytics(
        (injector: Injector): Analytics => getAnalytics(injector.get(FirebaseAppService).firebaseApp),
      ),
      provideAppCheck(
        (injector: Injector): AppCheck => injector.get(AppCheckService).appCheck,
      ),
      provideAuth(
        (injector: Injector): Auth => getAuth(injector.get(FirebaseAppService).firebaseApp),
      ),
      provideDatabase(
        (injector: Injector): Database => getDatabase(injector.get(FirebaseAppService).firebaseApp),
      ),
      provideFirebaseApp(
        (injector: Injector): FirebaseApp => injector.get(FirebaseAppService).firebaseApp,
      ),
      provideFirestore(
        (injector: Injector): Firestore => getFirestore(injector.get(FirebaseAppService).firebaseApp),
      ),
      provideFunctions(
        (injector: Injector): Functions => getFunctions(injector.get(FirebaseAppService).firebaseApp),
      ),
      provideHttpClient(withFetch()),
      provideRouter(
        [
          ...projectRoutes,
          ...bowstringRoutes,
        ],
        withComponentInputBinding(),
        withEnabledBlockingInitialNavigation(),
        withInMemoryScrolling({ scrollPositionRestoration: "enabled" }),
      ),
      ScreenTrackingService,
      UserTrackingService,
    ],
  },
)
export class ProjectBrowserModule {
}
