/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                                                                                                                    from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, contentChildren, forwardRef, inject, signal, type Signal }                           from "@angular/core";
import { NG_VALUE_ACCESSOR }                                                                                                                   from "@angular/forms";
import { CanvasDirective, ContainerDirective, ElevatedDirective, FlexboxContainerDirective, HoverTransformingDirective, WellRoundedDirective } from "@bowstring/directives";
import { InsertZwnjsPipe }                                                                                                                     from "@bowstring/pipes";
import { v7 as uuidV7 }                                                                                                                        from "uuid";
import { InputComponent }                                                                                                                      from "../../../input/InputComponent";
import { ComboboxInputOptionComponent }                                                                                                        from "../combobox option/ComboboxInputOptionComponent";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        useExisting: forwardRef(
          (): typeof ComboboxInputComponent => ComboboxInputComponent,
        ),
      },
    ],
    selector:        "bowstring--combobox-input",
    styleUrl:        "ComboboxInputComponent.sass",
    templateUrl:     "ComboboxInputComponent.html",

    standalone: true,
  },
)
export class ComboboxInputComponent
  extends InputComponent {

  constructor() {
    super();

    afterRender(
      (): void => {
        this.hoverTransformingDirective.htmlElementRef$.set(this.htmlDivElementRef$());
        this.wellRoundedDirective.htmlElementRef$.set(this.htmlDivElementRef$());
      },
    );
  }

  protected readonly containerDirective: ContainerDirective                                   = inject<ContainerDirective>(ContainerDirective);
  protected readonly optionComponents$: Signal<Readonly<Array<ComboboxInputOptionComponent>>> = contentChildren<ComboboxInputOptionComponent>(ComboboxInputOptionComponent);
  protected readonly hoverTransformingDirective: HoverTransformingDirective                   = inject<HoverTransformingDirective>(HoverTransformingDirective);
  protected readonly wellRoundedDirective: WellRoundedDirective                               = inject<WellRoundedDirective>(WellRoundedDirective);

  public readonly optionsId$: Signal<`bowstring--input-directive--options-${ string }`> = signal<`bowstring--input-directive--options-${ string }`>(`bowstring--input-directive--options-${ uuidV7() }`);

  protected override onBlur(): void {
    setTimeout(
      (): void => {
        this.focused = this.document.activeElement === this.htmlButtonElementRef$()?.nativeElement;

        if (!this.focused && !this.value || (typeof this.value === "string" && this.optionComponents$().map<string>(
          ({ valueInput$ }: ComboboxInputOptionComponent): string => valueInput$(),
        ).includes(this.value)))
          this.onChange?.();
      },
    );
  }

}
