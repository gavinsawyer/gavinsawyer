/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser, NgTemplateOutlet }                                                                                                            from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, type ElementRef, inject, input, type InputSignal, PLATFORM_ID, signal, type Signal, viewChild } from "@angular/core";
import { toObservable, toSignal }                                                                                                                         from "@angular/core/rxjs-interop";
import { ContainerDirective, ElevatedDirective, FlexboxContainerDirective, GlassDirective, TypographyDirective, WellRoundedDirective }                    from "@bowstring/directives";
import { type Symbol }                                                                                                                                    from "@bowstring/interfaces";
import loadSymbol                                                                                                                                         from "@bowstring/symbols";
import { type Focus }                                 from "@gavinsawyer/shortcuts-api";
import { map, type Observable, startWith, switchMap } from "rxjs";
import { fromPromise }                                from "rxjs/internal/observable/innerFrom";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        directive: TypographyDirective,
        inputs:    [ "fontSizeExponent" ],
      },
      {
        directive: WellRoundedDirective,
        inputs:    [ "level" ],
      },
    ],
    imports:         [ NgTemplateOutlet, WellRoundedDirective ],
    selector:        "bowstring-website--focus",
    styleUrl:        "FocusComponent.sass",
    templateUrl:     "FocusComponent.html",

    standalone: true,
  },
)
export class FocusComponent {

  constructor() {
    afterRender(
      (): void => {
        this.symbolWellRoundedDirective$()?.htmlElementRef$.set(this.symbolHtmlSpanElementRef$());
        this.wellRoundedDirective.htmlElementRef$.set(this.htmlDivElementRef$());
      },
    );
  }

  private readonly htmlDivElementRef$: Signal<ElementRef<HTMLDivElement>>                     = viewChild.required<ElementRef<HTMLDivElement>>("htmlDivElement");
  private readonly platformId: NonNullable<unknown>                                           = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly symbolHtmlSpanElementRef$: Signal<ElementRef<HTMLSpanElement> | undefined> = viewChild<ElementRef<HTMLSpanElement>>("symbolHtmlSpanElement");
  private readonly symbolWellRoundedDirective$: Signal<WellRoundedDirective | undefined>      = viewChild<WellRoundedDirective>("symbolWellRoundedDirective");

  protected readonly containerDirective: ContainerDirective = inject<ContainerDirective>(ContainerDirective);

  public readonly inputSignal$: InputSignal<Focus> = input.required<Focus>({ alias: "input" });

  protected readonly focusSymbol$: Signal<Symbol | undefined>   = isPlatformBrowser(this.platformId) ? toSignal<Symbol | undefined>(
    toObservable<Focus>(this.inputSignal$).pipe<Symbol, Symbol | undefined>(
      switchMap<Focus, Observable<Symbol>>(
        (focus: Focus): Observable<Symbol> => {
          switch (focus) {
            case "Developing":
              return fromPromise<Symbol>(loadSymbol("Curlybraces"));
            case "Do Not Disturb":
              return fromPromise<Symbol>(loadSymbol("MoonFill"));
            case "Driving":
              return fromPromise<Symbol>(loadSymbol("CarFill"));
            case "Fitness":
              return fromPromise<Symbol>(loadSymbol("FigureRun"));
            case "Personal":
              return fromPromise<Symbol>(loadSymbol("PersonFill"));
            case "Sleep":
              return fromPromise<Symbol>(loadSymbol("BedDoubleFill"));
            case "Studying":
              return fromPromise<Symbol>(loadSymbol("BooksVerticalFill"));
            case "Work":
              return fromPromise<Symbol>(loadSymbol("ClipboardFill"));
          }
        },
      ),
      startWith<Symbol, [ undefined ]>(undefined),
    ),
  ) : signal<undefined>(undefined);
  protected readonly focusSymbolFillColor$: Signal<string | undefined>   = isPlatformBrowser(this.platformId) ? toSignal<string | undefined>(
    toObservable<Focus>(this.inputSignal$).pipe<string, string | undefined>(
      map<Focus, string>(
        (focus: Focus): string => {
          switch (focus) {
            case "Developing":
              return "#ff453a";
            case "Do Not Disturb":
              return "#5e5ce6";
            case "Driving":
              return "#5e5ce6";
            case "Fitness":
              return "#32d74b";
            case "Personal":
              return "#bf5af2";
            case "Sleep":
              return "#6ac4dc";
            case "Studying":
              return "#ff9f0a";
            case "Work":
              return "#6ac4dc";
          }
        },
      ),
      startWith<string, [ undefined ]>(undefined),
    ),
  ) : signal<undefined>(undefined);
  protected readonly wellRoundedDirective: WellRoundedDirective = inject<WellRoundedDirective>(WellRoundedDirective);

}
