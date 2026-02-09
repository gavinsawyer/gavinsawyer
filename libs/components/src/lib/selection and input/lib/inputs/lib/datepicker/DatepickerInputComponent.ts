/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                                                                                                                    from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, type ElementRef, forwardRef, inject, signal, untracked, type WritableSignal }        from "@angular/core";
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
        useExisting: forwardRef((): typeof DatepickerInputComponent => DatepickerInputComponent),
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

  protected override readonly value$: WritableSignal<Date | ""> = signal<Date | "">(new Date());

  protected readonly containerDirective: ContainerDirective                 = inject<ContainerDirective>(ContainerDirective);
  protected readonly hoverTransformingDirective: HoverTransformingDirective = inject<HoverTransformingDirective>(HoverTransformingDirective);
  protected readonly wellRoundedDirective: WellRoundedDirective             = inject<WellRoundedDirective>(WellRoundedDirective);

  protected override onInput(): void {
    const value: string = this.htmlInputElementRef$().nativeElement.value;

    this.value$.set(value && new Date(value));

    this.onChange?.();
  }

  public override writeValue(value?: Date): void {
    untracked<void>(
      (): void => this.value$.set(value || ""),
    );

    firstValueFrom<ElementRef<HTMLInputElement> | undefined>(
      toObservable<ElementRef<HTMLInputElement> | undefined>(
        this.htmlInputElementRef$,
        { injector: this.injector },
      ),
    ).then<void>(
      (htmlInputElementRef?: ElementRef<HTMLInputElement>): void => {
        if (htmlInputElementRef)
          firstValueFrom<Date | "">(
            toObservable<Date | "">(
              this.value$,
              { injector: this.injector },
            ),
          ).then<void>(
            (value: Date | ""): void => this.renderer2.setProperty(
              htmlInputElementRef.nativeElement,
              "value",
              value && ((date: Date): string => `${ date.getFullYear() }-${ ((date.getMonth() + 1).toString().length === 1 ? "0" : "") + (date.getMonth() + 1) }-${ (date.getDate().toString().length === 1 ? "0" : "") + date.getDate() }`)(new Date(value.getTime() + value.getTimezoneOffset() * 60000)),
            ),
          );
      },
    );
  }

}
