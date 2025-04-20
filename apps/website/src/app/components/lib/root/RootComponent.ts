/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { DOCUMENT, isPlatformBrowser }                                                                                            from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Injector, LOCALE_ID, PLATFORM_ID, type Signal, type TemplateRef, viewChild } from "@angular/core";
import { toObservable, toSignal }                                                                                                 from "@angular/core/rxjs-interop";
import { AppCheck, type AppCheckTokenResult, getLimitedUseToken }                                                                 from "@angular/fire/app-check";
import { RouterOutlet, type Routes }                                                                                              from "@angular/router";
import type * as brandLib                                                                                                         from "@bowstring/brand";
import { type RouteComponent }                                                                                                    from "@bowstring/components";
import { CanvasDirective, FlexboxContainerDirective }                                                                             from "@bowstring/directives";
import { BOWSTRING_ROUTES, BRAND, ENVIRONMENT, GIT_INFO_PARTIAL, PACKAGE_VERSION, PROJECT_NAME, PROJECT_ROUTES }                  from "@bowstring/injection-tokens";
import { Environment }                                                                                                            from "@bowstring/interfaces";
import { ConnectivityService, ErrorsService, ResponsivityService }                                                                from "@bowstring/services";
import { type GitInfo }                                                                                                           from "git-describe";
import { type Observable, startWith, switchMap }                                                                                  from "rxjs";
import { PROJECT_LOCALE_IDS }                                                                                                     from "../../../injection tokens";
import { type ProjectLocaleId }                                                                                                   from "../../../types";


// noinspection CssUnknownProperty
@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[style.--bowstring--root--brand-font-family]": "brandLib.fontFamily",
      "[style.--bowstring--root--brand-title-font]":  "brandLib.titleFont",
    },
    hostDirectives:  [
      { directive: CanvasDirective },
      {
        directive: FlexboxContainerDirective,
        inputs:    [
          "alignContent",
          "alignItems",
          "flexDirection",
          "flexWrap",
          "gapColumn",
          "gapRow",
          "justifyContent",
        ],
      },
    ],
    selector:        "bowstring-website--root",
    standalone:      false,
    styleUrl:        "RootComponent.sass",
    templateUrl:     "RootComponent.html",
  },
)
export class RootComponent {

  private readonly appCheck: AppCheck                  = inject<AppCheck>(AppCheck);
  private readonly document: Document                  = inject<Document>(DOCUMENT);
  private readonly environment: Environment            = inject<Environment>(ENVIRONMENT);
  private readonly injector: Injector                  = inject<Injector>(Injector);
  private readonly platformId: NonNullable<unknown>    = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly routerOutlet$: Signal<RouterOutlet> = viewChild.required<RouterOutlet>(RouterOutlet);

  protected readonly aboveTemplateRef$: Signal<TemplateRef<never> | undefined>  = toSignal<TemplateRef<never> | undefined>(
    toObservable<RouterOutlet>(this.routerOutlet$).pipe<TemplateRef<never> | undefined, TemplateRef<never> | undefined>(
      switchMap<RouterOutlet, Observable<TemplateRef<never> | undefined>>(
        (routerOutlet: RouterOutlet): Observable<TemplateRef<never> | undefined> => routerOutlet.activateEvents.asObservable().pipe<TemplateRef<never> | undefined, TemplateRef<never> | undefined>(
          switchMap<RouteComponent, Observable<TemplateRef<never> | undefined>>(
            ({ aboveTemplateRef$ }: RouteComponent): Observable<TemplateRef<never> | undefined> => toObservable<TemplateRef<never> | undefined>(
              aboveTemplateRef$,
              { injector: this.injector },
            ),
          ),
          startWith<TemplateRef<never> | undefined, [ TemplateRef<never> | undefined ]>((routerOutlet.component as RouteComponent).aboveTemplateRef$()),
        ),
      ),
      startWith<TemplateRef<never> | undefined, [ undefined ]>(undefined),
    ),
    { requireSync: true },
  );
  protected readonly bannerTemplateRef$: Signal<TemplateRef<never> | undefined> = toSignal<TemplateRef<never> | undefined>(
    toObservable<RouterOutlet>(this.routerOutlet$).pipe<TemplateRef<never> | undefined, TemplateRef<never> | undefined>(
      switchMap<RouterOutlet, Observable<TemplateRef<never> | undefined>>(
        (routerOutlet: RouterOutlet): Observable<TemplateRef<never> | undefined> => routerOutlet.activateEvents.asObservable().pipe<TemplateRef<never> | undefined, TemplateRef<never> | undefined>(
          switchMap<RouteComponent, Observable<TemplateRef<never> | undefined>>(
            ({ bannerTemplateRef$ }: RouteComponent): Observable<TemplateRef<never> | undefined> => toObservable<TemplateRef<never> | undefined>(
              bannerTemplateRef$,
              { injector: this.injector },
            ),
          ),
          startWith<TemplateRef<never> | undefined, [ TemplateRef<never> | undefined ]>((routerOutlet.component as RouteComponent).bannerTemplateRef$()),
        ),
      ),
      startWith<TemplateRef<never> | undefined, [ undefined ]>(undefined),
    ),
    { requireSync: true },
  );
  protected readonly belowTemplateRef$: Signal<TemplateRef<never> | undefined>  = toSignal<TemplateRef<never> | undefined>(
    toObservable<RouterOutlet>(this.routerOutlet$).pipe<TemplateRef<never> | undefined, TemplateRef<never> | undefined>(
      switchMap<RouterOutlet, Observable<TemplateRef<never> | undefined>>(
        (routerOutlet: RouterOutlet): Observable<TemplateRef<never> | undefined> => routerOutlet.activateEvents.asObservable().pipe<TemplateRef<never> | undefined, TemplateRef<never> | undefined>(
          switchMap<RouteComponent, Observable<TemplateRef<never> | undefined>>(
            ({ belowTemplateRef$ }: RouteComponent): Observable<TemplateRef<never> | undefined> => toObservable<TemplateRef<never> | undefined>(
              belowTemplateRef$,
              { injector: this.injector },
            ),
          ),
          startWith<TemplateRef<never> | undefined, [ TemplateRef<never> | undefined ]>((routerOutlet.component as RouteComponent).belowTemplateRef$()),
        ),
      ),
      startWith<TemplateRef<never> | undefined, [ undefined ]>(undefined),
    ),
    { requireSync: true },
  );
  protected readonly bowstringRoutes: Routes                                    = inject<Routes>(BOWSTRING_ROUTES);
  protected readonly brandLib: typeof brandLib                                  = inject<typeof brandLib>(BRAND);
  protected readonly connectivityService: ConnectivityService                   = inject<ConnectivityService>(ConnectivityService);
  protected readonly errorsService: ErrorsService                               = inject<ErrorsService>(ErrorsService);
  protected readonly gitInfoPartial: Partial<GitInfo>                           = inject<Partial<GitInfo>>(GIT_INFO_PARTIAL);
  protected readonly projectLocaleId: ProjectLocaleId                           = inject<ProjectLocaleId>(LOCALE_ID);
  protected readonly projectLocaleIds: Array<ProjectLocaleId>                   = inject<Array<ProjectLocaleId>>(PROJECT_LOCALE_IDS);
  protected readonly projectName: string                                        = inject<string>(PROJECT_NAME);
  protected readonly projectRoutes: Routes                                      = inject<Routes>(PROJECT_ROUTES);
  protected readonly localeDisplayNames: { [key in ProjectLocaleId]: string }   = Object.fromEntries<string>(
    this.projectLocaleIds.map<[ ProjectLocaleId, string ]>(
      (projectLocaleId: ProjectLocaleId): [ ProjectLocaleId, string ] => [
        projectLocaleId,
        new Intl.DisplayNames(
          [ String(projectLocaleId) ],
          { type: "language" },
        ).of(String(projectLocaleId)) || String(projectLocaleId),
      ],
    ),
  ) as { [key in ProjectLocaleId]: string };
  protected readonly packageVersion: string                                     = inject<string>(PACKAGE_VERSION);
  protected readonly responsivityService: ResponsivityService                   = inject<ResponsivityService>(ResponsivityService);

  protected async changeLocale(projectLocaleId: ProjectLocaleId): Promise<void> {
    if (isPlatformBrowser(this.platformId))
      return getLimitedUseToken(this.appCheck).then<void, never>(
        ({ token }: AppCheckTokenResult): void => {
          this.document.location.href = `https://us-central1-${ this.environment.apis.firebase.projectId }.cloudfunctions.net/redirect?appCheckToken=${ encodeURI(token) }&url=${ encodeURI(`${ this.document.location.origin }/${ String(projectLocaleId) }/${ this.document.location.pathname.split("/").slice(2).join("/") }`) }`;
        },
        (error: unknown): never => {
          console.error("Something went wrong.");

          throw error;
        },
      );
  }
}
