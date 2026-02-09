/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet }                                                                                                                                                               from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, computed, type ElementRef, inject, Injector, model, type ModelSignal, PLATFORM_ID, runInInjectionContext, type Signal, signal, type TemplateRef, viewChild } from "@angular/core";
import { toObservable, toSignal }                                                                                                                                                                                      from "@angular/core/rxjs-interop";
import { ContainerDirective, ElevatedDirective, FlexboxContainerDirective, GlassDirective, HoverTransformingDirective, WellRoundedDirective }                                                                          from "@bowstring/directives";
import { type Dimensions, type Symbol }                                                                                                                                                                                from "@bowstring/interfaces";
import { RxSsrService, ViewportService }                                                                                                                                                                               from "@bowstring/services";
import loadSymbol                                                                                                                                                                                                      from "@bowstring/symbols";
import { type SymbolName }                                                                                                                                                                                             from "@bowstring/types";
import { combineLatestWith, delayWhen, filter, from, map, merge, Observable, type Observer, of, startWith, switchMap, type TeardownLogic, timer }                                                                      from "rxjs";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[class.pinning]":                                    "pinning$()",
      "[class.pinned]":                                     "pinnedModelWithTransform$()",
      "[class.raisedOrLoweringWhenPinnedOrUnpinning]":      "raisedOrLoweringWhenPinnedOrUnpinning$()",
      "[class.raisedWhenPinnedOrUnpinning]":                "raisedWhenPinnedOrUnpinning$()",
      "[class.unpinning]":                                  "unpinning$()",
      "[style.--bowstring--footer--height]":                "height$()",
      "[style.--bowstring--footer--raising-scale]":         "raisingScale$()",
      "[style.--bowstring--footer--unpinning-translation]": "unpinningTranslation$()",
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
      {
        directive: GlassDirective,
        inputs:    [ "materialOpacity" ],
      },
      {
        directive: WellRoundedDirective,
        inputs:    [ "level" ],
      },
    ],
    imports:         [
      HoverTransformingDirective,
      NgTemplateOutlet,
      WellRoundedDirective,
    ],
    selector:        "bowstring--footer",
    styleUrl:        "FooterComponent.sass",
    templateUrl:     "FooterComponent.html",

    standalone: true,
  },
)
export class FooterComponent {

  constructor() {
    afterRender(
      (): void => {
        const pinnedControlHtmlButtonElementRef: ElementRef<HTMLButtonElement> | undefined = this.pinnedControlHtmlButtonElementRef$();

        if (pinnedControlHtmlButtonElementRef) {
          this.pinnedControlHoverTransformingDirective$()?.htmlElementRef$.set(pinnedControlHtmlButtonElementRef);
          this.pinnedControlWellRoundedDirective$()?.htmlElementRef$.set(pinnedControlHtmlButtonElementRef);
        }

        this.wellRoundedDirective.htmlElementRef$.set(this.htmlElementRef$());
      },
    );
  }

  private readonly backdropHtmlDivElementRef$: Signal<ElementRef<HTMLDivElement>>                           = viewChild.required<ElementRef<HTMLDivElement>>("backdropHtmlDivElement");
  private readonly document: Document                                                                       = inject<Document>(DOCUMENT);
  private readonly platformId: NonNullable<unknown>                                                         = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly bodyHeight$: Signal<number | undefined>                                                  = isPlatformBrowser(this.platformId) ? toSignal<number>(
    new Observable<number>(
      (bodyHeightObserver: Observer<number>): TeardownLogic => {
        const resizeObserver: ResizeObserver = new ResizeObserver(([ { target: { clientHeight } } ]: Array<ResizeObserverEntry>): void => bodyHeightObserver.next(clientHeight));

        resizeObserver.observe(this.document.body);

        return (): void => resizeObserver.disconnect();
      },
    ),
  ) : signal<undefined>(undefined);
  private readonly htmlElementRef$: Signal<ElementRef<HTMLElement>>                                         = viewChild.required<ElementRef<HTMLElement>>("htmlElement");
  private readonly dimensions$: Signal<Dimensions | undefined>                                              = isPlatformBrowser(this.platformId) ? toSignal<Dimensions>(
    toObservable<ElementRef<HTMLElement>>(this.htmlElementRef$).pipe<Dimensions>(
      switchMap<ElementRef<HTMLElement>, Observable<Dimensions>>(
        ({ nativeElement: htmlElement }: ElementRef<HTMLElement>): Observable<Dimensions> => new Observable<Dimensions>(
          (dimensionsObserver: Observer<Dimensions>): TeardownLogic => {
            const resizeObserver: ResizeObserver = new ResizeObserver(
              ([ { target: element } ]: Array<ResizeObserverEntry>): void => dimensionsObserver.next(
                {
                  height: element.clientHeight,
                  width:  element.clientWidth,
                },
              ),
            );

            resizeObserver.observe(htmlElement);

            return (): void => resizeObserver.disconnect();
          },
        ),
      ),
    ),
  ) : signal<undefined>(undefined);
  private readonly injector: Injector                                                                       = inject<Injector>(Injector);
  private readonly pinnedControlHoverTransformingDirective$: Signal<HoverTransformingDirective | undefined> = viewChild<HoverTransformingDirective>("pinnedControlHoverTransformingDirective");
  private readonly pinnedControlHtmlButtonElementRef$: Signal<ElementRef<HTMLButtonElement> | undefined>    = viewChild<ElementRef<HTMLButtonElement>>("pinnedControlHtmlButtonElement");
  private readonly pinnedControlWellRoundedDirective$: Signal<WellRoundedDirective | undefined>             = viewChild<WellRoundedDirective>("pinnedControlWellRoundedDirective");
  private readonly rxSsrService: RxSsrService                                                               = inject<RxSsrService>(RxSsrService);
  private readonly viewportService: ViewportService                                                         = inject<ViewportService>(ViewportService);
  private readonly width$: Signal<number | undefined>                                                       = computed<number | undefined>((): number | undefined => this.dimensions$()?.width);

  protected readonly containerDirective: ContainerDirective          = inject<ContainerDirective>(ContainerDirective);
  protected readonly height$: Signal<number | undefined>             = computed<number | undefined>((): number | undefined => this.dimensions$()?.height);
  protected readonly pinFillSymbol$: Signal<Symbol | undefined>      = toSignal<Symbol>(
    of<SymbolName>("PinFill").pipe<Symbol>(
      this.rxSsrService.wrap<SymbolName, Symbol>(
        switchMap<SymbolName, Observable<Symbol>>((symbolName: SymbolName): Observable<Symbol> => from<Promise<Symbol>>(loadSymbol(symbolName))),
        "Symbol:PinFill",
      ),
    ),
  );
  protected readonly pinSlashFillSymbol$: Signal<Symbol | undefined> = toSignal<Symbol>(
    of<SymbolName>("PinSlashFill").pipe<Symbol>(
      this.rxSsrService.wrap<SymbolName, Symbol>(
        switchMap<SymbolName, Observable<Symbol>>((symbolName: SymbolName): Observable<Symbol> => from<Promise<Symbol>>(loadSymbol(symbolName))),
        "Symbol:PinSlashFill",
      ),
    ),
  );

  public readonly pinnedModel$: ModelSignal<"" | boolean | `${ boolean }`> = model<"" | boolean | `${ boolean }`>(
    false,
    { alias: "pinned" },
  );

  protected readonly pinnedModelWithTransform$: Signal<boolean>              = toSignal<boolean>(
    toObservable<"" | boolean | `${ boolean }`>(this.pinnedModel$).pipe<"" | boolean | `${ boolean }`, boolean>(
      startWith<"" | boolean | `${ boolean }`>(this.pinnedModel$()),
      map<"" | boolean | `${ boolean }`, boolean>((pinned?: "" | boolean | `${ boolean }`): boolean => pinned === "" || pinned === true || pinned === "true"),
    ),
    { requireSync: true },
  );
  protected readonly pinning$: Signal<boolean>                               = toSignal<boolean>(
    toObservable<boolean>(this.pinnedModelWithTransform$).pipe<true, boolean, boolean>(
      filter<boolean, true>((pinned: boolean): pinned is true => pinned),
      switchMap<true, Observable<boolean>>(
        (): Observable<boolean> => merge<[ true, false ]>(
          of<true>(true),
          timer(360).pipe<false>(map<number, false>((): false => false)),
        ),
      ),
      startWith<boolean, [ false ]>(false),
    ),
    { requireSync: true },
  );
  protected readonly unpinningTranslation$: Signal<number>                   = isPlatformBrowser(this.platformId) ? toSignal<number>(
    toObservable<boolean | undefined>(this.pinnedModelWithTransform$).pipe<true, number, number>(
      filter<boolean | undefined, true>((pinned?: boolean): pinned is true => pinned === true),
      switchMap<true, Observable<number>>(
        (): Observable<number> => runInInjectionContext<Observable<number>>(
          this.injector,
          (): Observable<number> => toObservable<ElementRef<HTMLDivElement>>(this.backdropHtmlDivElementRef$).pipe<[ ElementRef<HTMLDivElement>, number | undefined, number | undefined, number | undefined ], { "adjustment": number, "backdropBottom": number }, [ { adjustment: number, backdropBottom: number }, number | undefined, number | undefined ], number>(
            combineLatestWith<ElementRef<HTMLDivElement>, [ number | undefined, number | undefined, number | undefined ]>(
              toObservable<number | undefined>(this.viewportService.width$),
              toObservable<number | undefined>(this.bodyHeight$),
              toObservable<number | undefined>(this.height$),
            ),
            map<[ ElementRef<HTMLDivElement>, number | undefined, number | undefined, number | undefined ], { "adjustment": number, "backdropBottom": number }>(
              ([ { nativeElement: backdropHtmlDivElement } ]: [ ElementRef<HTMLDivElement>, number | undefined, number | undefined, number | undefined ]): { "adjustment": number, "backdropBottom": number } => ({
                adjustment:     ((backdropStylePropertyMap: StylePropertyMapReadOnly): number => Math.max(
                  0,
                  - 0.6180339887 * parseInt(backdropStylePropertyMap.get("margin-bottom")?.toString() || "0") + parseInt(backdropStylePropertyMap.get("--bowstring--root--safe-area-inset-bottom")?.toString() || "0"),
                ))(backdropHtmlDivElement.computedStyleMap()),
                backdropBottom: backdropHtmlDivElement.getBoundingClientRect().bottom + (this.document.defaultView?.scrollY || 0),
              }),
            ),
            combineLatestWith<{ "adjustment": number, "backdropBottom": number }, [ number | undefined, number | undefined ]>(
              toObservable<number | undefined>(this.viewportService.height$),
              toObservable<number | undefined>(this.viewportService.scrollTop$),
            ),
            map<[ { "adjustment": number, "backdropBottom": number }, number | undefined, number | undefined ], number>(
              ([ layoutAnchor, viewportHeight, scrollTop ]: [ { "adjustment": number, "backdropBottom": number }, number | undefined, number | undefined ]): number => Math.round(
                Math.max(
                  layoutAnchor.backdropBottom - (scrollTop || 0) - (viewportHeight || 0) + layoutAnchor.adjustment,
                  0,
                ),
              ),
            ),
          ),
        ),
      ),
      startWith<number>(0),
    ),
    { requireSync: true },
  ) : signal<0>(0);
  protected readonly raisedWhenPinnedOrUnpinning$: Signal<boolean>           = toSignal<boolean>(
    toObservable<number>(this.unpinningTranslation$).pipe<number, boolean, boolean>(
      delayWhen<number>((unpinningTranslation: number): Observable<number> => unpinningTranslation !== 0 ? timer(0) : timer(120)),
      map<number, boolean>((): boolean => this.unpinningTranslation$() !== 0),
      startWith<boolean>(this.unpinningTranslation$() !== 0),
    ),
    { requireSync: true },
  );
  protected readonly raisedOrLoweringWhenPinnedOrUnpinning$: Signal<boolean> = toSignal<boolean>(
    toObservable<boolean>(this.raisedWhenPinnedOrUnpinning$).pipe<boolean, boolean, boolean>(
      delayWhen<boolean>((raisedWhenPinnedOrUnpinning: boolean): Observable<number> => raisedWhenPinnedOrUnpinning ? timer(0) : timer(360)),
      map<boolean, boolean>((): boolean => this.raisedWhenPinnedOrUnpinning$()),
      startWith<boolean>(this.raisedWhenPinnedOrUnpinning$()),
    ),
    { requireSync: true },
  );
  protected readonly raisingScale$: Signal<number | undefined>               = isPlatformBrowser(this.platformId) ? toSignal<number>(
    toObservable<number | undefined>(this.width$).pipe<[ number | undefined, number | undefined ], number>(
      combineLatestWith<number | undefined, [ number | undefined ]>(toObservable<number | undefined>(this.viewportService.width$)),
      map<[ number | undefined, number | undefined ], number>(([ footerWidth, viewportWidth ]: [ number | undefined, number | undefined ]): number => ((viewportWidth || footerWidth || 0) - (footerWidth || 0)) / (viewportWidth || footerWidth || 1) / 2.6180339887),
    ),
  ) : signal<undefined>(undefined);
  protected readonly unpinning$: Signal<boolean>                             = toSignal<boolean>(
    toObservable<boolean>(this.pinnedModelWithTransform$).pipe<true, boolean, boolean>(
      filter<boolean, true>((pinned: boolean): pinned is true => pinned),
      switchMap<true, Observable<boolean>>(
        (): Observable<boolean> => toObservable<boolean>(
          this.pinnedModelWithTransform$,
          { injector: this.injector },
        ).pipe<false, boolean>(
          filter<boolean, false>((pinned: boolean): pinned is false => !pinned),
          switchMap<false, Observable<boolean>>(
            (): Observable<boolean> => merge<[ true, false ]>(
              of<true>(true),
              timer(360).pipe<false>(map<number, false>((): false => false)),
            ),
          ),
        ),
      ),
      startWith<boolean, [ false ]>(false),
    ),
    { requireSync: true },
  );
  protected readonly wellRoundedDirective: WellRoundedDirective              = inject<WellRoundedDirective>(WellRoundedDirective);

  public readonly pinnedControlTemplateRef$: Signal<TemplateRef<never>> = viewChild.required<TemplateRef<never>>("pinnedControlTemplate");

}
