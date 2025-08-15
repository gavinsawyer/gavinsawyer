/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { provideHttpClient, withFetch }                                                                                                                                                                                                                                                                                                                                                                                                                 from "@angular/common/http";
import { Injector, NgModule }                                                                                                                                                                                                                                                                                                                                                                                                                           from "@angular/core";
import { type Analytics, provideAnalytics, ScreenTrackingService, UserTrackingService }                                                                                                                                                                                                                                                                                                                                                                 from "@angular/fire/analytics";
import { type FirebaseApp, provideFirebaseApp }                                                                                                                                                                                                                                                                                                                                                                                                         from "@angular/fire/app";
import { type AppCheck, provideAppCheck }                                                                                                                                                                                                                                                                                                                                                                                                               from "@angular/fire/app-check";
import { type Auth, provideAuth }                                                                                                                                                                                                                                                                                                                                                                                                                       from "@angular/fire/auth";
import { AngularFirestoreModule }                                                                                                                                                                                                                                                                                                                                                                                                                       from "@angular/fire/compat/firestore";
import { type Database, provideDatabase }                                                                                                                                                                                                                                                                                                                                                                                                               from "@angular/fire/database";
import { type Firestore, provideFirestore }                                                                                                                                                                                                                                                                                                                                                                                                             from "@angular/fire/firestore";
import { type Functions, provideFunctions }                                                                                                                                                                                                                                                                                                                                                                                                             from "@angular/fire/functions";
import { ReactiveFormsModule }                                                                                                                                                                                                                                                                                                                                                                                                                          from "@angular/forms";
import { GoogleMapsModule }                                                                                                                                                                                                                                                                                                                                                                                                                             from "@angular/google-maps";
import { BrowserModule }                                                                                                                                                                                                                                                                                                                                                                                                                                from "@angular/platform-browser";
import { provideRouter, RouterOutlet, withComponentInputBinding, withEnabledBlockingInitialNavigation, withInMemoryScrolling }                                                                                                                                                                                                                                                                                                                          from "@angular/router";
import * as brandLib                                                                                                                                                                                                                                                                                                                                                                                                                                    from "@bowstring/brand";
import { AboveComponent, BelowComponent, BoxComponent, ButtonComponent, CaptionComponent, DividerComponent, ErrorComponent, ErrorsContainerComponent, FlexboxContainerComponent, FooterComponent, FormComponent, GridContainerComponent, HeaderComponent, HeadingGroupComponent, LabelComponent, LinkComponent, ListComponent, LogoComponent, MainComponent, NavComponent, SectionComponent, SheetComponent, SymbolComponent, TextFieldInputComponent } from "@bowstring/components";
import { ListItemDirective }                                                                                                                                                                                                                                                                                                                                                                                                                            from "@bowstring/directives";
import { BRAND, ENVIRONMENT, GIT_INFO_PARTIAL, PACKAGE_VERSION, PROJECT_NAME, PROJECT_ROUTES }                                                                                                                                                                                                                                                                                                                                                          from "@bowstring/injection-tokens";
import { FindRouteByPathPipe }                                                                                                                                                                                                                                                                                                                                                                                                                          from "@bowstring/pipes";
import { AnalyticsService, AppCheckService, AuthService, DatabaseService, FirebaseAppService, FirestoreService, FunctionsService }                                                                                                                                                                                                                                                                                                                      from "@bowstring/services";
import project                                                                                                                                                                                                                                                                                                                                                                                                                                          from "../../../../project.json";
import { gitInfoPartial }                                                                                                                                                                                                                                                                                                                                                                                                                               from "../../../.gitInfoPartial";
import { packageVersion }                                                                                                                                                                                                                                                                                                                                                                                                                               from "../../../.packageVersion";
import { environment }                                                                                                                                                                                                                                                                                                                                                                                                                                  from "../../../environment";
import { RootComponent, routes as projectRoutes }                                                                                                                                                                                                                                                                                                                                                                                                       from "../../components";
import { PROJECT_LOCALE_IDS }                                                                                                                                                                                                                                                                                                                                                                                                                           from "../../injection tokens";


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
      LogoComponent,
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
      provideAnalytics(
        (injector: Injector): Analytics => injector.get(AnalyticsService).analytics,
      ),
      provideAppCheck(
        (injector: Injector): AppCheck => injector.get(AppCheckService).appCheck,
      ),
      provideAuth(
        (injector: Injector): Auth => injector.get(AuthService).auth,
      ),
      provideDatabase(
        (injector: Injector): Database => injector.get(DatabaseService).database,
      ),
      provideFirebaseApp(
        (injector: Injector): FirebaseApp => injector.get(FirebaseAppService).firebaseApp,
      ),
      provideFirestore(
        (injector: Injector): Firestore => injector.get(FirestoreService).firestore,
      ),
      provideFunctions(
        (injector: Injector): Functions => injector.get(FunctionsService).functions,
      ),
      provideHttpClient(withFetch()),
      provideRouter(
        projectRoutes,
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
