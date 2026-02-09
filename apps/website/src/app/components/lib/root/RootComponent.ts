/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { DOCUMENT, isPlatformBrowser }                                                                                                                              from "@angular/common";
import { ChangeDetectionStrategy, Component, effect, inject, Injector, LOCALE_ID, PLATFORM_ID, signal, type Signal, type TemplateRef, viewChild }                   from "@angular/core";
import { toObservable, toSignal }                                                                                                                                   from "@angular/core/rxjs-interop";
import { AppCheck, type AppCheckTokenResult, getLimitedUseToken }                                                                                                   from "@angular/fire/app-check";
import { RouterOutlet, type Routes }                                                                                                                                from "@angular/router";
import { type AboveComponent, type AsideComponent, type BannerComponent, type BelowComponent, type FooterComponent, type HeaderComponent, type InspectorComponent } from "@bowstring/components";
import type * as configLib                                                                                                                                          from "@bowstring/config";
import { CanvasDirective, FlexboxContainerDirective }                                                                                                               from "@bowstring/directives";
import { DateFormat }                                                                                                                                               from "@bowstring/enums";
import { CONFIG, ENVIRONMENT, GIT_INFO_PARTIAL, PACKAGE_VERSION, PROJECT_NAME, PROJECT_ROUTES, SERVICE_WORKER_REGISTRATION }                                        from "@bowstring/injection-tokens";
import { Environment }                                                                                                                                              from "@bowstring/interfaces";
import { DatePipe }                                                                                                                                                 from "@bowstring/pipes";
import { AuthenticationService, ConnectivityService, ErrorsService }                                                                                                from "@bowstring/services";
import { type GitInfo }                                                                                                                                             from "git-describe";
import { map, Observable, type Observer, of, startWith, switchMap, type TeardownLogic }                                                                             from "rxjs";
import { type RouteComponent }                                                                                                                                      from "../../";
import { PROJECT_LOCALE_IDS }                                                                                                                                       from "../../../injection tokens";
import { type ProjectLocaleId }                                                                                                                                     from "../../../types";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            { "[style.--bowstring--root--font-family]": "configLib.brand.fontFamily" },
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
    selector:        "bowstring-app--root",
    standalone:      false,
    styleUrl:        "RootComponent.sass",
    templateUrl:     "RootComponent.html",
  },
)
export class RootComponent {

  constructor() {
    effect(
      (): void => {
        const idToken: string | undefined = this.authenticationService.idToken$();

        if (idToken)
          this.serviceWorkerRegistration?.active?.postMessage(
            {
              data:      { idToken },
              eventType: "idTokenChanged",
            },
          );
      },
    );
  }

  private readonly appCheck: AppCheck                                          = inject<AppCheck>(AppCheck);
  private readonly datePipe: DatePipe                                          = inject<DatePipe>(DatePipe);
  private readonly document: Document                                          = inject<Document>(DOCUMENT);
  private readonly environment: Environment                                    = inject<Environment>(ENVIRONMENT);
  private readonly injector: Injector                                          = inject<Injector>(Injector);
  private readonly platformId: NonNullable<unknown>                            = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly routerOutlet$: Signal<RouterOutlet>                         = viewChild.required<RouterOutlet>(RouterOutlet);
  private readonly serviceWorkerRegistration: ServiceWorkerRegistration | null = inject<ServiceWorkerRegistration>(
    SERVICE_WORKER_REGISTRATION,
    { optional: true },
  );

  protected readonly aboveTemplateRef$: Signal<TemplateRef<AboveComponent> | undefined>         = toSignal<TemplateRef<AboveComponent> | undefined>(
    toObservable<RouterOutlet>(this.routerOutlet$).pipe<TemplateRef<AboveComponent> | undefined>(
      switchMap<RouterOutlet, Observable<TemplateRef<AboveComponent> | undefined>>(
        (routerOutlet: RouterOutlet): Observable<TemplateRef<AboveComponent> | undefined> => routerOutlet.activateEvents.asObservable().pipe<RouteComponent | undefined, TemplateRef<AboveComponent> | undefined>(
          startWith<RouteComponent, [ RouteComponent | undefined ]>(routerOutlet.isActivated ? routerOutlet.component as RouteComponent : undefined),
          switchMap<RouteComponent | undefined, Observable<TemplateRef<AboveComponent> | undefined>>(
            (routeComponent?: RouteComponent): Observable<TemplateRef<AboveComponent> | undefined> => routeComponent ? toObservable<TemplateRef<AboveComponent> | undefined>(
              routeComponent.aboveTemplateRef$,
              { injector: this.injector },
            ) : of<undefined>(undefined),
          ),
        ),
      ),
    ),
  );
  protected readonly asideTemplateRef$: Signal<TemplateRef<AsideComponent> | undefined>         = toSignal<TemplateRef<AsideComponent> | undefined>(
    toObservable<RouterOutlet>(this.routerOutlet$).pipe<TemplateRef<AsideComponent> | undefined>(
      switchMap<RouterOutlet, Observable<TemplateRef<AsideComponent> | undefined>>(
        (routerOutlet: RouterOutlet): Observable<TemplateRef<AsideComponent> | undefined> => routerOutlet.activateEvents.asObservable().pipe<RouteComponent | undefined, TemplateRef<AsideComponent> | undefined>(
          startWith<RouteComponent, [ RouteComponent | undefined ]>(routerOutlet.isActivated ? routerOutlet.component as RouteComponent : undefined),
          switchMap<RouteComponent | undefined, Observable<TemplateRef<AsideComponent> | undefined>>(
            (routeComponent?: RouteComponent): Observable<TemplateRef<AsideComponent> | undefined> => routeComponent ? toObservable<TemplateRef<AsideComponent> | undefined>(
              routeComponent.asideTemplateRef$,
              { injector: this.injector },
            ) : of<undefined>(undefined),
          ),
        ),
      ),
    ),
  );
  protected readonly authenticationService: AuthenticationService                               = inject<AuthenticationService>(AuthenticationService);
  protected readonly bannerTemplateRef$: Signal<TemplateRef<BannerComponent> | undefined>       = toSignal<TemplateRef<BannerComponent> | undefined>(
    toObservable<RouterOutlet>(this.routerOutlet$).pipe<TemplateRef<BannerComponent> | undefined>(
      switchMap<RouterOutlet, Observable<TemplateRef<BannerComponent> | undefined>>(
        (routerOutlet: RouterOutlet): Observable<TemplateRef<BannerComponent> | undefined> => routerOutlet.activateEvents.asObservable().pipe<RouteComponent | undefined, TemplateRef<BannerComponent> | undefined>(
          startWith<RouteComponent, [ RouteComponent | undefined ]>(routerOutlet.isActivated ? routerOutlet.component as RouteComponent : undefined),
          switchMap<RouteComponent | undefined, Observable<TemplateRef<BannerComponent> | undefined>>(
            (routeComponent?: RouteComponent): Observable<TemplateRef<BannerComponent> | undefined> => routeComponent ? toObservable<TemplateRef<BannerComponent> | undefined>(
              routeComponent.bannerTemplateRef$,
              { injector: this.injector },
            ) : of<undefined>(undefined),
          ),
        ),
      ),
    ),
  );
  protected readonly belowTemplateRef$: Signal<TemplateRef<BelowComponent> | undefined>         = toSignal<TemplateRef<BelowComponent> | undefined>(
    toObservable<RouterOutlet>(this.routerOutlet$).pipe<TemplateRef<BelowComponent> | undefined>(
      switchMap<RouterOutlet, Observable<TemplateRef<BelowComponent> | undefined>>(
        (routerOutlet: RouterOutlet): Observable<TemplateRef<BelowComponent> | undefined> => routerOutlet.activateEvents.asObservable().pipe<RouteComponent | undefined, TemplateRef<BelowComponent> | undefined>(
          startWith<RouteComponent, [ RouteComponent | undefined ]>(routerOutlet.isActivated ? routerOutlet.component as RouteComponent : undefined),
          switchMap<RouteComponent | undefined, Observable<TemplateRef<BelowComponent> | undefined>>(
            (routeComponent?: RouteComponent): Observable<TemplateRef<BelowComponent> | undefined> => routeComponent ? toObservable<TemplateRef<BelowComponent> | undefined>(
              routeComponent.belowTemplateRef$,
              { injector: this.injector },
            ) : of<undefined>(undefined),
          ),
        ),
      ),
    ),
  );
  protected readonly configLib: typeof configLib                                                = inject<typeof configLib>(CONFIG);
  protected readonly brandShortTime$: Signal<string | undefined>                                = this.configLib.brand.timeZone ? isPlatformBrowser(this.platformId) ? toSignal<string>(
    new Observable<Date>(
      (dateObserver: Observer<Date>): TeardownLogic => {
        const getTimeout: () => ReturnType<typeof setTimeout> = (): ReturnType<typeof setTimeout> => setTimeout(
          (): void => {
            dateObserver.next(new Date());

            timeout = getTimeout();
          },
          ((date: Date): number => (60 - date.getSeconds()) * 1000 - date.getMilliseconds())(new Date()),
        );

        let timeout: ReturnType<typeof setTimeout> = getTimeout();

        return (): void => clearTimeout(timeout);
      },
    ).pipe<Date, string>(
      startWith<Date>(new Date()),
      map<Date, string>(
        (date: Date): string => this.datePipe.transform(
          date,
          DateFormat.ShortTime,
          this.configLib.brand.timeZone,
        ),
      ),
    ),
    { requireSync: true },
  ) : signal<string | undefined>(
    this.datePipe.transform(
      new Date(),
      DateFormat.ShortTime,
      this.configLib.brand.timeZone,
    ),
  ) : signal<undefined>(undefined);
  protected readonly connectivityService: ConnectivityService                                   = inject<ConnectivityService>(ConnectivityService);
  protected readonly errorsService: ErrorsService                                               = inject<ErrorsService>(ErrorsService);
  protected readonly footerTemplateRef$: Signal<TemplateRef<FooterComponent> | undefined>       = toSignal<TemplateRef<FooterComponent> | undefined>(
    toObservable<RouterOutlet>(this.routerOutlet$).pipe<TemplateRef<FooterComponent> | undefined>(
      switchMap<RouterOutlet, Observable<TemplateRef<FooterComponent> | undefined>>(
        (routerOutlet: RouterOutlet): Observable<TemplateRef<FooterComponent> | undefined> => routerOutlet.activateEvents.asObservable().pipe<RouteComponent | undefined, TemplateRef<FooterComponent> | undefined>(
          startWith<RouteComponent, [ RouteComponent | undefined ]>(routerOutlet.isActivated ? routerOutlet.component as RouteComponent : undefined),
          switchMap<RouteComponent | undefined, Observable<TemplateRef<FooterComponent> | undefined>>(
            (routeComponent?: RouteComponent): Observable<TemplateRef<FooterComponent> | undefined> => routeComponent ? toObservable<TemplateRef<FooterComponent> | undefined>(
              routeComponent.footerTemplateRef$,
              { injector: this.injector },
            ) : of<undefined>(undefined),
          ),
        ),
      ),
    ),
  );
  protected readonly gitInfoPartial: Partial<GitInfo>                                           = inject<Partial<GitInfo>>(GIT_INFO_PARTIAL);
  protected readonly headerTemplateRef$: Signal<TemplateRef<HeaderComponent> | undefined>       = toSignal<TemplateRef<HeaderComponent> | undefined>(
    toObservable<RouterOutlet>(this.routerOutlet$).pipe<TemplateRef<HeaderComponent> | undefined>(
      switchMap<RouterOutlet, Observable<TemplateRef<HeaderComponent> | undefined>>(
        (routerOutlet: RouterOutlet): Observable<TemplateRef<HeaderComponent> | undefined> => routerOutlet.activateEvents.asObservable().pipe<RouteComponent | undefined, TemplateRef<HeaderComponent> | undefined>(
          startWith<RouteComponent, [ RouteComponent | undefined ]>(routerOutlet.isActivated ? routerOutlet.component as RouteComponent : undefined),
          switchMap<RouteComponent | undefined, Observable<TemplateRef<HeaderComponent> | undefined>>(
            (routeComponent?: RouteComponent): Observable<TemplateRef<HeaderComponent> | undefined> => routeComponent ? toObservable<TemplateRef<HeaderComponent> | undefined>(
              routeComponent.headerTemplateRef$,
              { injector: this.injector },
            ) : of<undefined>(undefined),
          ),
        ),
      ),
    ),
  );
  protected readonly inspectorTemplateRef$: Signal<TemplateRef<InspectorComponent> | undefined> = toSignal<TemplateRef<InspectorComponent> | undefined>(
    toObservable<RouterOutlet>(this.routerOutlet$).pipe<TemplateRef<InspectorComponent> | undefined>(
      switchMap<RouterOutlet, Observable<TemplateRef<InspectorComponent> | undefined>>(
        (routerOutlet: RouterOutlet): Observable<TemplateRef<InspectorComponent> | undefined> => routerOutlet.activateEvents.asObservable().pipe<RouteComponent | undefined, TemplateRef<InspectorComponent> | undefined>(
          startWith<RouteComponent, [ RouteComponent | undefined ]>(routerOutlet.isActivated ? routerOutlet.component as RouteComponent : undefined),
          switchMap<RouteComponent | undefined, Observable<TemplateRef<InspectorComponent> | undefined>>(
            (routeComponent?: RouteComponent): Observable<TemplateRef<InspectorComponent> | undefined> => routeComponent ? toObservable<TemplateRef<InspectorComponent> | undefined>(
              routeComponent.inspectorTemplateRef$,
              { injector: this.injector },
            ) : of<undefined>(undefined),
          ),
        ),
      ),
    ),
  );
  protected readonly projectLocaleIds: Array<ProjectLocaleId>                                   = inject<Array<ProjectLocaleId>>(PROJECT_LOCALE_IDS);
  protected readonly localeDisplayNames: Record<ProjectLocaleId, string>                        = Object.fromEntries<string>(
    this.projectLocaleIds.map<[ ProjectLocaleId, string ]>(
      (projectLocaleId: ProjectLocaleId): [ ProjectLocaleId, string ] => [
        projectLocaleId,
        new Intl.DisplayNames(
          [ String(projectLocaleId) ],
          { type: "language" },
        ).of(String(projectLocaleId)) || String(projectLocaleId),
      ],
    ),
  ) as Record<ProjectLocaleId, string>;
  protected readonly projectLocaleId: ProjectLocaleId                                           = inject<ProjectLocaleId>(LOCALE_ID);
  protected readonly projectName: string                                                        = inject<string>(PROJECT_NAME);
  protected readonly projectRoutes: Routes                                                      = inject<Routes>(PROJECT_ROUTES);
  protected readonly packageVersion: string                                                     = inject<string>(PACKAGE_VERSION);
  protected readonly subheaderTemplateRef$: Signal<TemplateRef<HeaderComponent> | undefined>    = toSignal<TemplateRef<HeaderComponent> | undefined>(
    toObservable<RouterOutlet>(this.routerOutlet$).pipe<TemplateRef<HeaderComponent> | undefined>(
      switchMap<RouterOutlet, Observable<TemplateRef<HeaderComponent> | undefined>>(
        (routerOutlet: RouterOutlet): Observable<TemplateRef<HeaderComponent> | undefined> => routerOutlet.activateEvents.asObservable().pipe<RouteComponent | undefined, TemplateRef<HeaderComponent> | undefined>(
          startWith<RouteComponent, [ RouteComponent | undefined ]>(routerOutlet.isActivated ? routerOutlet.component as RouteComponent : undefined),
          switchMap<RouteComponent | undefined, Observable<TemplateRef<HeaderComponent> | undefined>>(
            (routeComponent?: RouteComponent): Observable<TemplateRef<HeaderComponent> | undefined> => routeComponent ? toObservable<TemplateRef<HeaderComponent> | undefined>(
              routeComponent.subheaderTemplateRef$,
              { injector: this.injector },
            ) : of<undefined>(undefined),
          ),
        ),
      ),
    ),
  );

  protected async changeLocale(projectLocaleId: ProjectLocaleId): Promise<void> {
    if (isPlatformBrowser(this.platformId))
      return getLimitedUseToken(this.appCheck).then<void, never>(
        ({ token }: AppCheckTokenResult): void => void (this.document.location.href = `https://us-central1-${ this.environment.apis.firebase.projectId }.cloudfunctions.net/redirect?appCheckToken=${ encodeURI(token) }&url=${ encodeURI(`${ this.document.location.origin }/${ String(projectLocaleId) }/${ this.document.location.pathname.split("/").slice(2).join("/") }`) }`),
        (error: Error): never => {
          console.error("Something went wrong.");

          throw error;
        },
      );
  }
}
