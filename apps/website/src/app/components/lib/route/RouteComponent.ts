/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { ChangeDetectionStrategy, Component, inject, Injector, input, type InputSignal, type OnInit, type Signal, type TemplateRef, viewChild } from "@angular/core";
import { toObservable, toSignal }                                                                                                               from "@angular/core/rxjs-interop";
import { Meta }                                                                                                                                 from "@angular/platform-browser";
import { RouterOutlet, type Routes }                                                                                                            from "@angular/router";
import { PROJECT_ROUTES }                                                                                                                       from "@bowstring/injection-tokens";
import { combineLatestWith, map, type Observable, of, startWith, switchMap }                                                                    from "rxjs";
import { projectRoutesProvider }                                                                                                                from "../routes";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers:       [ projectRoutesProvider ],
    template:        "",

    standalone: true,
  },
)
export class RouteComponent
  implements OnInit {

  private readonly aboveTemplateRef$Self: Signal<TemplateRef<never> | undefined>     = viewChild<TemplateRef<never>>("aboveTemplate");
  private readonly bannerTemplateRef$Self: Signal<TemplateRef<never> | undefined>    = viewChild<TemplateRef<never>>("bannerTemplate");
  private readonly belowTemplateRef$Self: Signal<TemplateRef<never> | undefined>     = viewChild<TemplateRef<never>>("belowTemplate");
  private readonly inspectorTemplateRef$Self: Signal<TemplateRef<never> | undefined> = viewChild<TemplateRef<never>>("inspectorTemplate");

  protected readonly injector: Injector                              = inject<Injector>(Injector);
  protected readonly meta: Meta                                      = inject<Meta>(Meta);
  protected readonly projectRoutes: Routes                           = inject<Routes>(PROJECT_ROUTES);
  protected readonly routerOutlet$: Signal<RouterOutlet | undefined> = viewChild<RouterOutlet>(RouterOutlet);

  public readonly aboveTemplateRef$: Signal<TemplateRef<never> | undefined>     = toSignal<TemplateRef<never> | undefined>(
    toObservable(this.aboveTemplateRef$Self).pipe<[ TemplateRef<never> | undefined, TemplateRef<never> | undefined ], TemplateRef<never> | undefined>(
      combineLatestWith<TemplateRef<never> | undefined, [ TemplateRef<never> | undefined ]>(
        toObservable<RouterOutlet | undefined>(this.routerOutlet$).pipe<TemplateRef<never> | undefined>(
          switchMap<RouterOutlet | undefined, Observable<TemplateRef<never> | undefined>>(
            (routerOutlet?: RouterOutlet): Observable<TemplateRef<never> | undefined> => routerOutlet?.activateEvents.asObservable().pipe<RouteComponent | undefined, TemplateRef<never> | undefined>(
              startWith<RouteComponent, [ RouteComponent | undefined ]>(routerOutlet?.isActivated ? routerOutlet.component as RouteComponent : undefined),
              switchMap<RouteComponent | undefined, Observable<TemplateRef<never> | undefined>>(
                (routeComponent?: RouteComponent): Observable<TemplateRef<never> | undefined> => routeComponent ? toObservable<TemplateRef<never> | undefined>(
                  routeComponent.aboveTemplateRef$,
                  { injector: this.injector },
                ) : of<undefined>(undefined),
              ),
            ) || of<undefined>(undefined),
          ),
        ),
      ),
      map<[ TemplateRef<never> | undefined, TemplateRef<never> | undefined ], TemplateRef<never> | undefined>(
        (
          [
            aboveTemplateRefSelf,
            aboveTemplateRefChild,
          ]: [ TemplateRef<never> | undefined, TemplateRef<never> | undefined ],
        ): TemplateRef<never> | undefined => aboveTemplateRefChild || aboveTemplateRefSelf,
      ),
    ),
  );
  public readonly bannerTemplateRef$: Signal<TemplateRef<never> | undefined>    = toSignal<TemplateRef<never> | undefined>(
    toObservable(this.bannerTemplateRef$Self).pipe<[ TemplateRef<never> | undefined, TemplateRef<never> | undefined ], TemplateRef<never> | undefined>(
      combineLatestWith<TemplateRef<never> | undefined, [ TemplateRef<never> | undefined ]>(
        toObservable<RouterOutlet | undefined>(this.routerOutlet$).pipe<TemplateRef<never> | undefined>(
          switchMap<RouterOutlet | undefined, Observable<TemplateRef<never> | undefined>>(
            (routerOutlet?: RouterOutlet): Observable<TemplateRef<never> | undefined> => routerOutlet?.activateEvents.asObservable().pipe<RouteComponent | undefined, TemplateRef<never> | undefined>(
              startWith<RouteComponent, [ RouteComponent | undefined ]>(routerOutlet?.isActivated ? routerOutlet.component as RouteComponent : undefined),
              switchMap<RouteComponent | undefined, Observable<TemplateRef<never> | undefined>>(
                (routeComponent?: RouteComponent): Observable<TemplateRef<never> | undefined> => routeComponent ? toObservable<TemplateRef<never> | undefined>(
                  routeComponent.bannerTemplateRef$,
                  { injector: this.injector },
                ) : of<undefined>(undefined),
              ),
            ) || of<undefined>(undefined),
          ),
        ),
      ),
      map<[ TemplateRef<never> | undefined, TemplateRef<never> | undefined ], TemplateRef<never> | undefined>(
        (
          [
            bannerTemplateRefSelf,
            bannerTemplateRefChild,
          ]: [ TemplateRef<never> | undefined, TemplateRef<never> | undefined ],
        ): TemplateRef<never> | undefined => bannerTemplateRefChild || bannerTemplateRefSelf,
      ),
    ),
  );
  public readonly belowTemplateRef$: Signal<TemplateRef<never> | undefined>     = toSignal<TemplateRef<never> | undefined>(
    toObservable(this.belowTemplateRef$Self).pipe<[ TemplateRef<never> | undefined, TemplateRef<never> | undefined ], TemplateRef<never> | undefined>(
      combineLatestWith<TemplateRef<never> | undefined, [ TemplateRef<never> | undefined ]>(
        toObservable<RouterOutlet | undefined>(this.routerOutlet$).pipe<TemplateRef<never> | undefined>(
          switchMap<RouterOutlet | undefined, Observable<TemplateRef<never> | undefined>>(
            (routerOutlet?: RouterOutlet): Observable<TemplateRef<never> | undefined> => routerOutlet?.activateEvents.asObservable().pipe<RouteComponent | undefined, TemplateRef<never> | undefined>(
              startWith<RouteComponent, [ RouteComponent | undefined ]>(routerOutlet?.isActivated ? routerOutlet.component as RouteComponent : undefined),
              switchMap<RouteComponent | undefined, Observable<TemplateRef<never> | undefined>>(
                (routeComponent?: RouteComponent): Observable<TemplateRef<never> | undefined> => routeComponent ? toObservable<TemplateRef<never> | undefined>(
                  routeComponent.belowTemplateRef$,
                  { injector: this.injector },
                ) : of<undefined>(undefined),
              ),
            ) || of<undefined>(undefined),
          ),
        ),
      ),
      map<[ TemplateRef<never> | undefined, TemplateRef<never> | undefined ], TemplateRef<never> | undefined>(
        (
          [
            belowTemplateRefSelf,
            belowTemplateRefChild,
          ]: [ TemplateRef<never> | undefined, TemplateRef<never> | undefined ],
        ): TemplateRef<never> | undefined => belowTemplateRefChild || belowTemplateRefSelf,
      ),
    ),
  );
  public readonly descriptionInput$: InputSignal<string>                        = input.required<string>({ alias: "description" });
  public readonly inspectorTemplateRef$: Signal<TemplateRef<never> | undefined> = toSignal<TemplateRef<never> | undefined>(
    toObservable(this.inspectorTemplateRef$Self).pipe<[ TemplateRef<never> | undefined, TemplateRef<never> | undefined ], TemplateRef<never> | undefined>(
      combineLatestWith<TemplateRef<never> | undefined, [ TemplateRef<never> | undefined ]>(
        toObservable<RouterOutlet | undefined>(this.routerOutlet$).pipe<TemplateRef<never> | undefined>(
          switchMap<RouterOutlet | undefined, Observable<TemplateRef<never> | undefined>>(
            (routerOutlet?: RouterOutlet): Observable<TemplateRef<never> | undefined> => routerOutlet?.activateEvents.asObservable().pipe<RouteComponent | undefined, TemplateRef<never> | undefined>(
              startWith<RouteComponent, [ RouteComponent | undefined ]>(routerOutlet?.isActivated ? routerOutlet.component as RouteComponent : undefined),
              switchMap<RouteComponent | undefined, Observable<TemplateRef<never> | undefined>>(
                (routeComponent?: RouteComponent): Observable<TemplateRef<never> | undefined> => routeComponent ? toObservable<TemplateRef<never> | undefined>(
                  routeComponent.inspectorTemplateRef$,
                  { injector: this.injector },
                ) : of<undefined>(undefined),
              ),
            ) || of<undefined>(undefined),
          ),
        ),
      ),
      map<[ TemplateRef<never> | undefined, TemplateRef<never> | undefined ], TemplateRef<never> | undefined>(
        (
          [
            inspectorTemplateRefSelf,
            inspectorTemplateRefChild,
          ]: [ TemplateRef<never> | undefined, TemplateRef<never> | undefined ],
        ): TemplateRef<never> | undefined => inspectorTemplateRefChild || inspectorTemplateRefSelf,
      ),
    ),
  );

  public ngOnInit(): void {
    this.meta.updateTag(
      {
        name:    "description",
        content: this.descriptionInput$(),
      },
    );
  }

}
