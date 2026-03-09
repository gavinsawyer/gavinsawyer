/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet }                                                                                                                                                                    from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, computed, effect, type EffectCleanupRegisterFn, type ElementRef, inject, model, type ModelSignal, PLATFORM_ID, signal, type Signal, type TemplateRef, viewChild } from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal }                                                                                                                                                                       from "@angular/core/rxjs-interop";
import { RxSsrService, ViewportService }                                                                                                                                                                                    from "@bowstring/core";
import { loadSymbol, type Symbol, type SymbolName }                                                                                                                                                                         from "@bowstring/symbols";
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll }                                                                                                                                                     from "body-scroll-lock";
import { delayWhen, from, fromEvent, map, type Observable, of, startWith, switchMap, timer }                                                                                                                                from "rxjs";
import { ContainerDirective, ElevatedDirective, FlexboxContainerDirective, GlassDirective, WellRoundedDirective }                                                                                                           from "../../../../../directives";
import { GlassMaskIdTickService, HapticsService }                                                                                                                                                                           from "../../../../../services";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[class.openOrClosing]":                  "openOrClosing$()",
      "[class.open]":                           "openModelWithTransform$()",
      "[style.--bowstring--sheet--scroll-top]": "viewportService.scrollTop$()",
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
    imports:         [ NgTemplateOutlet ],
    selector:        "bowstring--sheet",
    styleUrl:        "SheetComponent.sass",
    templateUrl:     "SheetComponent.html",

    standalone: true,
  },
)
export class SheetComponent {

  constructor() {
    afterRender((): void => this.wellRoundedDirective.htmlElementRef$.set(this.htmlDivElementRef$()));

    if (isPlatformBrowser(this.platformId))
      effect(
        (effectCleanupRegisterFn: EffectCleanupRegisterFn): void => {
          const openOrClosing: boolean | undefined = this.openOrClosing$();

          setTimeout(
            (): void => {
              if (openOrClosing) {
                disableBodyScroll(this.htmlDialogElementRef$().nativeElement);

                this.htmlDialogElementRef$().nativeElement.showModal();
                this.htmlDialogElementRef$().nativeElement.focus();
              } else {
                enableBodyScroll(this.htmlDialogElementRef$().nativeElement);

                this.htmlDialogElementRef$().nativeElement.focus();
                this.htmlDialogElementRef$().nativeElement.close();
              }
            },
          );

          effectCleanupRegisterFn((): void => clearAllBodyScrollLocks());
        },
      );

    fromEvent<KeyboardEvent>(
      this.document,
      "keydown",
    ).pipe<KeyboardEvent>(takeUntilDestroyed<KeyboardEvent>()).subscribe((keyboardEvent: KeyboardEvent): void => void this.keydown(keyboardEvent));
  }

  private readonly document: Document                                           = inject<Document>(DOCUMENT);
  private readonly glassMaskIdTickService: GlassMaskIdTickService               = inject<GlassMaskIdTickService>(GlassMaskIdTickService);
  private readonly htmlDialogElementRef$: Signal<ElementRef<HTMLDialogElement>> = viewChild.required<ElementRef<HTMLDialogElement>>("htmlDialogElement");
  private readonly htmlDivElementRef$: Signal<ElementRef<HTMLDivElement>>       = viewChild.required<ElementRef<HTMLDivElement>>("htmlDivElement");
  private readonly platformId: NonNullable<unknown>                             = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly rxSsrService: RxSsrService                                   = inject<RxSsrService>(RxSsrService);

  protected readonly arrowUpAndDownAndArrowLeftAndRightSymbol$: Signal<Symbol | undefined> = toSignal<Symbol>(
    of<SymbolName>("ArrowUpAndDownAndArrowLeftAndRight").pipe<Symbol>(
      this.rxSsrService.wrap<SymbolName, Symbol>(
        switchMap<SymbolName, Observable<Symbol>>((symbolName: SymbolName): Observable<Symbol> => from<Promise<Symbol>>(loadSymbol(symbolName))),
        "Symbol:ArrowUpAndDownAndArrowLeftAndRight",
      ),
    ),
  );
  protected readonly containerDirective: ContainerDirective                                = inject<ContainerDirective>(ContainerDirective);
  protected readonly hapticsService: HapticsService                                        = inject<HapticsService>(HapticsService);
  protected readonly viewportService: ViewportService                                      = inject<ViewportService>(ViewportService);

  public readonly openModel$: ModelSignal<"" | boolean | `${ boolean }`> = model<"" | boolean | `${ boolean }`>(
    false,
    { alias: "open" },
  );
  public readonly openModelWithTransform$: Signal<boolean>               = computed<boolean>((): boolean => this.openModel$() === "" || this.openModel$() === true || this.openModel$() === "true");

  protected readonly openOrClosing$: Signal<boolean>            = isPlatformBrowser(this.platformId) ? toSignal<boolean>(
    toObservable<boolean>(this.openModelWithTransform$).pipe<boolean, boolean, boolean>(
      delayWhen<boolean>((open: boolean): Observable<number> => open ? timer(0) : timer(180)),
      map<boolean, boolean>(
        (): boolean => {
          this.glassMaskIdTickService.tickedSubject.next();

          return this.openModelWithTransform$();
        },
      ),
      startWith<boolean>(this.openModelWithTransform$()),
    ),
    { requireSync: true },
  ) : signal<false>(false);
  protected readonly wellRoundedDirective: WellRoundedDirective = inject<WellRoundedDirective>(WellRoundedDirective);

  public readonly dragControlTemplateRef$: Signal<TemplateRef<never>> = viewChild.required<TemplateRef<never>>("dragControlTemplate");

  protected keydown(keyboardEvent: KeyboardEvent): true | void {
    if (keyboardEvent.key !== "Escape")
      keyboardEvent.stopPropagation();

    return (keyboardEvent.key === "Escape" && this.openOrClosing$() ? this.openModel$.set(false) : true) || keyboardEvent.preventDefault();
  }

}
