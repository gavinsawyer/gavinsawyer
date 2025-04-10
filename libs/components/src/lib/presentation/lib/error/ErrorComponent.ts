/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser, NgTemplateOutlet }                                                                                                                      from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, computed, type ElementRef, inject, model, type ModelSignal, PLATFORM_ID, type Signal, signal, viewChild } from "@angular/core";
import { toObservable, toSignal }                                                                                                                                   from "@angular/core/rxjs-interop";
import { ContainerDirective, ElevatedDirective, FlexboxContainerDirective, WarningDirective, WellRoundedDirective }                                                 from "@bowstring/directives";
import { type Symbol }                                                                                                                                              from "@bowstring/interfaces";
import loadSymbol                                                                                                                                                   from "@bowstring/symbols";
import { delayWhen, map, Observable, type Observer, switchMap, type TeardownLogic, timer }                                                                          from "rxjs";
import { fromPromise }                                                                                                                                              from "rxjs/internal/observable/innerFrom";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[class.openOrClosing]":              "openOrClosing$()",
      "[class.open]":                       "openModelWithTransform$()",
      "[style.--bowstring--error--height]": "height$()",
    },
    hostDirectives:  [
      {
        directive: ElevatedDirective,
        inputs:    [
          "level",
          "materialOpacity",
        ],
      },
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
      { directive: WarningDirective },
      {
        directive: WellRoundedDirective,
        inputs:    [ "level" ],
      },
    ],
    imports:         [ NgTemplateOutlet ],
    selector:        "bowstring--error",
    styleUrl:        "ErrorComponent.sass",
    templateUrl:     "ErrorComponent.html",

    standalone: true,
  },
)
export class ErrorComponent {

  constructor() {
    afterRender(
      (): void => this.wellRoundedDirective.htmlElementRef$.set(this.htmlDivElementRef$()),
    );
  }

  private readonly platformId: NonNullable<unknown>                       = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly htmlDivElementRef$: Signal<ElementRef<HTMLDivElement>> = viewChild.required<ElementRef<HTMLDivElement>>("htmlDivElement");

  protected readonly containerDirective: ContainerDirective = inject<ContainerDirective>(ContainerDirective);
  protected readonly height$: Signal<number | undefined>    = isPlatformBrowser(this.platformId) ? toSignal<number>(
    toObservable<ElementRef<HTMLDivElement>>(this.htmlDivElementRef$).pipe<number>(
      switchMap<ElementRef<HTMLDivElement>, Observable<number>>(
        ({ nativeElement: htmlElement }: ElementRef<HTMLDivElement>): Observable<number> => new Observable<number>(
          (dimensionsObserver: Observer<number>): TeardownLogic => {
            const resizeObserver: ResizeObserver = new ResizeObserver(
              ([ { target: element } ]: Array<ResizeObserverEntry>): void => dimensionsObserver.next(element.clientHeight),
            );

            resizeObserver.observe(htmlElement);

            return (): void => resizeObserver.disconnect();
          },
        ),
      ),
    ),
  ) : signal<undefined>(undefined);

  public readonly openModelWithTransform$: Signal<boolean | undefined> = computed<boolean | undefined>(
    (): boolean | undefined => {
      const open: "" | boolean | `${ boolean }` | undefined = this.openModel$();

      if (open === undefined)
        return undefined;

      return open === "" || open === true || open === "true" || open !== "false" && false;
    },
  );

  protected readonly openOrClosing$: Signal<boolean | undefined> = isPlatformBrowser(this.platformId) ? toSignal<boolean | undefined>(
    toObservable<boolean | undefined>(this.openModelWithTransform$).pipe<boolean | undefined, boolean | undefined>(
      delayWhen<boolean | undefined>(
        (open?: boolean): Observable<number> => open ? timer(0) : timer(180),
      ),
      map<boolean | undefined, boolean | undefined>(
        (): boolean | undefined => this.openModelWithTransform$(),
      ),
    ),
  ) : signal<undefined>(undefined);
  protected readonly wellRoundedDirective: WellRoundedDirective  = inject<WellRoundedDirective>(WellRoundedDirective);
  protected readonly xmarkSymbol$: Signal<Symbol | undefined>    = toSignal<Symbol>(
    fromPromise<Symbol>(
      loadSymbol("Xmark"),
    ),
  );

  public readonly openModel$: ModelSignal<"" | boolean | `${ boolean }` | undefined> = model<"" | boolean | `${ boolean }` | undefined>(
    false,
    { alias: "open" },
  );

}
