/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { isPlatformBrowser, NgTemplateOutlet }                                                                                                            from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, type ElementRef, inject, model, type ModelSignal, PLATFORM_ID, type Signal, signal, viewChild } from "@angular/core";
import { toObservable, toSignal }                                                                                                                         from "@angular/core/rxjs-interop";
import { ContainerDirective, ElevatedDirective, FlexboxContainerDirective, WarningDirective, WellRoundedDirective }                                       from "@bowstring/directives";
import { type Symbol }                                                                                                                                    from "@bowstring/interfaces";
import { RxSsrService }                                                                                                                                   from "@bowstring/services";
import loadSymbol                                                                                                                                         from "@bowstring/symbols";
import { type SymbolName }                                                                                                                                from "@bowstring/types";
import { delayWhen, from, map, Observable, type Observer, of, startWith, switchMap, type TeardownLogic, timer }                                           from "rxjs";


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
    afterRender((): void => this.wellRoundedDirective.htmlElementRef$.set(this.htmlDivElementRef$()));
  }

  private readonly htmlDivElementRef$: Signal<ElementRef<HTMLDivElement>> = viewChild.required<ElementRef<HTMLDivElement>>("htmlDivElement");
  private readonly platformId: NonNullable<unknown>                       = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly rxSsrService: RxSsrService                             = inject<RxSsrService>(RxSsrService);

  protected readonly containerDirective: ContainerDirective = inject<ContainerDirective>(ContainerDirective);
  protected readonly height$: Signal<number | undefined>    = isPlatformBrowser(this.platformId) ? toSignal<number>(
    toObservable<ElementRef<HTMLDivElement>>(this.htmlDivElementRef$).pipe<number>(
      switchMap<ElementRef<HTMLDivElement>, Observable<number>>(
        ({ nativeElement: htmlElement }: ElementRef<HTMLDivElement>): Observable<number> => new Observable<number>(
          (dimensionsObserver: Observer<number>): TeardownLogic => {
            const resizeObserver: ResizeObserver = new ResizeObserver(([ { target: element } ]: Array<ResizeObserverEntry>): void => dimensionsObserver.next(element.clientHeight));

            resizeObserver.observe(htmlElement);

            return (): void => resizeObserver.disconnect();
          },
        ),
      ),
    ),
  ) : signal<undefined>(undefined);

  public readonly openModel$: ModelSignal<"" | boolean | `${ boolean }`> = model<"" | boolean | `${ boolean }`>(
    false,
    { alias: "open" },
  );
  public readonly openModelWithTransform$: Signal<boolean>               = toSignal<boolean>(
    toObservable<"" | boolean | `${ boolean }`>(this.openModel$).pipe<"" | boolean | `${ boolean }`, boolean>(
      startWith<"" | boolean | `${ boolean }`>(this.openModel$()),
      map<"" | boolean | `${ boolean }`, boolean>((open?: "" | boolean | `${ boolean }`): boolean => open === "" || open === true || open === "true"),
    ),
    { requireSync: true },
  );

  protected readonly openOrClosing$: Signal<boolean | undefined> = isPlatformBrowser(this.platformId) ? toSignal<boolean | undefined>(
    toObservable<boolean | undefined>(this.openModelWithTransform$).pipe<boolean | undefined, boolean | undefined>(
      delayWhen<boolean | undefined>((open?: boolean): Observable<number> => open ? timer(0) : timer(180)),
      map<boolean | undefined, boolean | undefined>((): boolean | undefined => this.openModelWithTransform$()),
    ),
  ) : signal<undefined>(undefined);
  protected readonly wellRoundedDirective: WellRoundedDirective  = inject<WellRoundedDirective>(WellRoundedDirective);
  protected readonly xmarkSymbol$: Signal<Symbol | undefined>    = toSignal<Symbol>(
    of<SymbolName>("Xmark").pipe<Symbol>(
      this.rxSsrService.wrap<SymbolName, Symbol>(
        switchMap<SymbolName, Observable<Symbol>>(
          (symbolName: SymbolName): Observable<Symbol> => from<Promise<Symbol>>(loadSymbol(symbolName)),
        ),
        "Symbol:Xmark",
      ),
    ),
  );

}
