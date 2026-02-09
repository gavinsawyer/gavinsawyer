/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                                                                                                            from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, type ElementRef, inject, input, type InputSignal, type Signal, viewChild }   from "@angular/core";
import { toObservable, toSignal }                                                                                                      from "@angular/core/rxjs-interop";
import { ContainerDirective, ElevatedDirective, FlexboxContainerDirective, GlassDirective, TypographyDirective, WellRoundedDirective } from "@bowstring/directives";
import { type Symbol }                                                                                                                 from "@bowstring/interfaces";
import { RxSsrService }                                                                                                                from "@bowstring/services";
import loadSymbol                                                                                                                      from "@bowstring/symbols";
import { type SymbolName }                                                                                                             from "@bowstring/types";
import { type Focus }                                                                                                                  from "@gavinsawyer/shortcuts-api";
import { from, map, type Observable, switchMap }                                                                                       from "rxjs";


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
    imports:         [ NgTemplateOutlet ],
    selector:        "bowstring-app--focus",
    styleUrl:        "FocusComponent.sass",
    templateUrl:     "FocusComponent.html",

    standalone: true,
  },
)
export class FocusComponent {

  constructor() {
    afterRender(
      (): void => this.wellRoundedDirective.htmlElementRef$.set(this.htmlDivElementRef$()),
    );
  }

  private readonly htmlDivElementRef$: Signal<ElementRef<HTMLDivElement>> = viewChild.required<ElementRef<HTMLDivElement>>("htmlDivElement");
  private readonly rxSsrService: RxSsrService                             = inject<RxSsrService>(RxSsrService);

  protected readonly containerDirective: ContainerDirective = inject<ContainerDirective>(ContainerDirective);

  public readonly inputSignal$: InputSignal<Focus> = input.required<Focus>({ alias: "input" });

  protected readonly focusSymbol$: Signal<Symbol | undefined>          = toSignal<Symbol>(
    toObservable<Focus>(this.inputSignal$).pipe<Symbol>(
      this.rxSsrService.wrap<Focus, Symbol>(
        switchMap<Focus, Observable<Symbol>>(
          (focus: Focus): Observable<Symbol> => from<Promise<Symbol>>(loadSymbol(this.focusSymbolNamesAndColors[focus].symbolName)),
        ),
        "0198a02a-7223-728b-9e9a-f58c22791b2b",
      ),
    ),
  );
  protected readonly focusSymbolFillColor$: Signal<string | undefined> = toSignal<string>(
    toObservable<Focus>(this.inputSignal$).pipe<string>(
      map<Focus, string>(
        (focus: Focus): string => (this.focusSymbolNamesAndColors[focus].color),
      ),
    ),
  );
  protected readonly wellRoundedDirective: WellRoundedDirective        = inject<WellRoundedDirective>(WellRoundedDirective);

  private readonly focusSymbolNamesAndColors: { [key in Focus]: { "color": `#${ string }`, "symbolName": SymbolName } } = {
    "Developing":     {
      color:      "#ff453a",
      symbolName: "Curlybraces",
    },
    "Do Not Disturb": {
      color:      "#5e5ce6",
      symbolName: "MoonFill",
    },
    "Driving":        {
      color:      "#5e5ce6",
      symbolName: "CarFill",
    },
    "Fitness":        {
      color:      "#32d74b",
      symbolName: "FigureRun",
    },
    "Personal":       {
      color:      "#bf5af2",
      symbolName: "PersonFill",
    },
    "Sleep":          {
      color:      "#6ac4dc",
      symbolName: "BedDoubleFill",
    },
    "Studying":       {
      color:      "#ff9f0a",
      symbolName: "BooksVerticalFill",
    },
    "Work":           {
      color:      "#6ac4dc",
      symbolName: "ClipboardFill",
    },
  };

}
