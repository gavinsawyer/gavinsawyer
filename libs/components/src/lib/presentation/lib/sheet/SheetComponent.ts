/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet }                                                                                                                                                          from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, effect, type EffectCleanupRegisterFn, type ElementRef, inject, model, type ModelSignal, PLATFORM_ID, signal, type Signal, type TemplateRef, viewChild } from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal }                                                                                                                                                             from "@angular/core/rxjs-interop";
import { ContainerDirective, ElevatedDirective, FlexboxContainerDirective, GlassDirective, WellRoundedDirective }                                                                                                 from "@bowstring/directives";
import { type Symbol }                                                                                                                                                                                            from "@bowstring/interfaces";
import { RxSsrService }                                                                                                                                                                                           from "@bowstring/services";
import loadSymbol                                                                                                                                                                                                 from "@bowstring/symbols";
import { type SymbolName }                                                                                                                                                                                        from "@bowstring/types";
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll }                                                                                                                                           from "body-scroll-lock";
import { delayWhen, from, fromEvent, map, type Observable, of, startWith, switchMap, timer }                                                                                                                      from "rxjs";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[class.openOrClosing]": "openOrClosing$()",
      "[class.open]":          "openModelWithTransform$()",
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
    afterRender(
      (): void => this.wellRoundedDirective.htmlElementRef$.set(this.htmlDivElementRef$()),
    );

    if (isPlatformBrowser(this.platformId))
      effect(
        (effectCleanupRegisterFn: EffectCleanupRegisterFn): void => {
          if (this.openOrClosing$())
            setTimeout(
              (): void => {
                disableBodyScroll(this.htmlDialogElementRef$().nativeElement);

                this.htmlDialogElementRef$().nativeElement.showModal();
                this.htmlDialogElementRef$().nativeElement.focus();
              },
              0,
            );
          else
            setTimeout(
              (): void => {
                enableBodyScroll(this.htmlDialogElementRef$().nativeElement);

                this.htmlDialogElementRef$().nativeElement.focus();
                this.htmlDialogElementRef$().nativeElement.close();
              },
              0,
            );

          effectCleanupRegisterFn(
            (): void => clearAllBodyScrollLocks(),
          );
        },
      );

    fromEvent<KeyboardEvent>(
      this.document,
      "keydown",
    ).pipe<KeyboardEvent>(
      takeUntilDestroyed<KeyboardEvent>(),
    ).subscribe(
      (keyboardEvent: KeyboardEvent): void => this.keydown(keyboardEvent) && void (0),
    );
  }

  private readonly document: Document                                           = inject<Document>(DOCUMENT);
  private readonly htmlDialogElementRef$: Signal<ElementRef<HTMLDialogElement>> = viewChild.required<ElementRef<HTMLDialogElement>>("htmlDialogElement");
  private readonly htmlDivElementRef$: Signal<ElementRef<HTMLDivElement>>       = viewChild.required<ElementRef<HTMLDivElement>>("htmlDivElement");
  private readonly platformId: NonNullable<unknown>                             = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly rxSsrService: RxSsrService                                   = inject<RxSsrService>(RxSsrService);

  protected readonly arrowUpAndDownAndArrowLeftAndRightSymbol$: Signal<Symbol | undefined> = toSignal<Symbol>(
    of<SymbolName>("ArrowUpAndDownAndArrowLeftAndRight").pipe<Symbol>(
      this.rxSsrService.wrap<SymbolName, Symbol>(
        switchMap<SymbolName, Observable<Symbol>>(
          (symbolName: SymbolName): Observable<Symbol> => from<Promise<Symbol>>(loadSymbol(symbolName)),
        ),
        "Symbol:ArrowUpAndDownAndArrowLeftAndRight",
      ),
    ),
  );
  protected readonly containerDirective: ContainerDirective                                = inject<ContainerDirective>(ContainerDirective);

  public readonly openModel$: ModelSignal<"" | boolean | `${ boolean }`> = model<"" | boolean | `${ boolean }`>(
    false,
    { alias: "open" },
  );
  public readonly openModelWithTransform$: Signal<boolean>               = toSignal<boolean>(
    toObservable<"" | boolean | `${ boolean }`>(this.openModel$).pipe<"" | boolean | `${ boolean }`, boolean>(
      startWith<"" | boolean | `${ boolean }`>(this.openModel$()),
      map<"" | boolean | `${ boolean }`, boolean>(
        (open?: "" | boolean | `${ boolean }`): boolean => open === "" || open === true || open === "true",
      ),
    ),
    { requireSync: true },
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

  public readonly dragControlTemplateRef$: Signal<TemplateRef<never>> = viewChild.required<TemplateRef<never>>("dragControlTemplate");

  protected keydown(keyboardEvent: KeyboardEvent): true | void {
    if (keyboardEvent.key !== "Escape")
      keyboardEvent.stopPropagation();

    return (keyboardEvent.key === "Escape" && this.openOrClosing$() ? this.openModel$.set(false) : true) || keyboardEvent.preventDefault();
  }

}
