/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                                                                                                                    from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, forwardRef, inject, type Signal }                                                    from "@angular/core";
import { toSignal }                                                                                                                            from "@angular/core/rxjs-interop";
import { NG_VALUE_ACCESSOR }                                                                                                                   from "@angular/forms";
import { CanvasDirective, ContainerDirective, ElevatedDirective, FlexboxContainerDirective, HoverTransformingDirective, WellRoundedDirective } from "@bowstring/directives";
import { type Symbol }                                                                                                                         from "@bowstring/interfaces";
import { InsertZwnjsPipe }                                                                                                                     from "@bowstring/pipes";
import loadSymbol                                                                                                                              from "@bowstring/symbols";
import { type SymbolName }                                                                                                                     from "@bowstring/types";
import { from, Observable, of, switchMap }                                                                                                     from "rxjs";
import { InputWithOptionsComponent }                                                                                                           from "../../../../";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[class.placeholder]": "placeholderInput$() && value$() === ''",
    },
    hostDirectives:  [
      { directive: CanvasDirective },
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
      { directive: HoverTransformingDirective },
      {
        directive: WellRoundedDirective,
        inputs:    [ "level" ],
      },
    ],
    imports:         [
      InsertZwnjsPipe,
      NgTemplateOutlet,
    ],
    providers:       [
      {
        multi:       true,
        provide:     NG_VALUE_ACCESSOR,
        useExisting: forwardRef((): typeof PickerInputComponent => PickerInputComponent),
      },
    ],
    selector:        "bowstring--picker-input",
    styleUrl:        "PickerInputComponent.sass",
    templateUrl:     "PickerInputComponent.html",

    standalone: true,
  },
)
export class PickerInputComponent
  extends InputWithOptionsComponent {

  constructor() {
    super();

    afterRender(
      (): void => {
        this.hoverTransformingDirective.htmlElementRef$.set(this.htmlDivElementRef$());
        this.wellRoundedDirective.htmlElementRef$.set(this.htmlDivElementRef$());
      },
    );
  }

  protected readonly chevronUpChevronDownSymbol$: Signal<Symbol | undefined> = toSignal<Symbol>(
    of<SymbolName>("ChevronUpChevronDown").pipe<Symbol>(
      this.rxSsrService.wrap<SymbolName, Symbol>(
        switchMap<SymbolName, Observable<Symbol>>(
          (symbolName: SymbolName): Observable<Symbol> => from<Promise<Symbol>>(loadSymbol(symbolName)),
        ),
        "Symbol:ChevronUpChevronDown",
      ),
    ),
  );
  protected readonly containerDirective: ContainerDirective                  = inject<ContainerDirective>(ContainerDirective);
  protected readonly hoverTransformingDirective: HoverTransformingDirective  = inject<HoverTransformingDirective>(HoverTransformingDirective);
  protected readonly wellRoundedDirective: WellRoundedDirective              = inject<WellRoundedDirective>(WellRoundedDirective);

  protected onPointerDown(): void {
    setTimeout(
      (): void => this.hoverTransformingDirective.cancelPressed(),
    );
  }

}
