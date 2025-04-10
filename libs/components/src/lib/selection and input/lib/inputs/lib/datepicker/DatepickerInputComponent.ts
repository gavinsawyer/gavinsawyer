/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                                                                                                                    from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, type ElementRef, forwardRef, inject }                                                from "@angular/core";
import { toObservable }                                                                                                                        from "@angular/core/rxjs-interop";
import { NG_VALUE_ACCESSOR }                                                                                                                   from "@angular/forms";
import { CanvasDirective, ContainerDirective, ElevatedDirective, FlexboxContainerDirective, HoverTransformingDirective, WellRoundedDirective } from "@bowstring/directives";
import { InsertZwnjsPipe }                                                                                                                     from "@bowstring/pipes";
import { firstValueFrom }                                                                                                                      from "rxjs";
import { InputComponent }                                                                                                                      from "../../../input/InputComponent";


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
          (): typeof DatepickerInputComponent => DatepickerInputComponent,
        ),
      },
    ],
    selector:        "bowstring--datepicker-input",
    styleUrl:        "DatepickerInputComponent.sass",
    templateUrl:     "DatepickerInputComponent.html",

    standalone: true,
  },
)
export class DatepickerInputComponent
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

  protected readonly containerDirective: ContainerDirective                 = inject<ContainerDirective>(ContainerDirective);
  protected readonly hoverTransformingDirective: HoverTransformingDirective = inject<HoverTransformingDirective>(HoverTransformingDirective);
  protected readonly wellRoundedDirective: WellRoundedDirective             = inject<WellRoundedDirective>(WellRoundedDirective);

  protected override value: Date | "" = new Date();

  protected override onInput(): void {
    this.value = ((value: string): Date | "" => value && new Date(value))(this.htmlInputElementRef$().nativeElement.value);
  }

  public override writeValue(value?: Date): void {
    this.value = value || "";

    firstValueFrom<ElementRef<HTMLInputElement> | undefined>(
      toObservable<ElementRef<HTMLInputElement> | undefined>(
        this.htmlInputElementRef$,
        { injector: this.injector },
      ),
    ).then<void>(
      (htmlInputElementRef?: ElementRef<HTMLInputElement>): void => {
        if (htmlInputElementRef)
          this.renderer2.setProperty(
            htmlInputElementRef.nativeElement,
            "value",
            this.value && ((date: Date): string => `${ date.getFullYear() }-${ ((date.getMonth() + 1).toString().length === 1 ? "0" : "") + (date.getMonth() + 1) }-${ (date.getDate().toString().length === 1 ? "0" : "") + date.getDate() }`)(new Date(this.value.getTime() + this.value.getTimezoneOffset() * 60000)),
          );
      },
    );
  }

}
