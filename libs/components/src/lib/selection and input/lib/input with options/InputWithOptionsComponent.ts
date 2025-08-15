/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { ChangeDetectionStrategy, Component, contentChildren, forwardRef, type Signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR }                                      from "@angular/forms";
import { InputComponent }                                                               from "../input/InputComponent";
import { OptionComponent }                                                              from "../option/OptionComponent";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            { "[class.disabled]": "disabledModel$()" },
    providers:       [
      {
        multi:       true,
        provide:     NG_VALUE_ACCESSOR,
        useExisting: forwardRef(
          (): typeof InputWithOptionsComponent => InputWithOptionsComponent,
        ),
      },
    ],
    template:        "",

    standalone: true,
  },
)
export class InputWithOptionsComponent
  extends InputComponent
  implements ControlValueAccessor {

  protected readonly optionComponents$: Signal<Readonly<Array<OptionComponent>>> = contentChildren<OptionComponent>(OptionComponent);

  protected override onBlur(): void {
    setTimeout(
      (): void => {
        const value: Date | string = this.value$();

        this.focused$.set(this.document.activeElement === this.htmlButtonElementRef$()?.nativeElement);

        if (!this.focused$() && !value || (typeof value === "string" && this.optionComponents$().map<string>(
          ({ valueInput$ }: OptionComponent): string => valueInput$(),
        ).includes(value)))
          this.onChange?.();
      },
    );
  }

  public override registerOnChange(handler: (value: Date | string) => void): void {
    this.onChange = (): void => {
      setTimeout(
        (): void => {
          setTimeout(
            (): void => {
              const value: Date | string = this.value$();

              if (!value || (typeof value === "string" && this.optionComponents$().map<string>(
                ({ valueInput$ }: OptionComponent): string => valueInput$(),
              ).includes(value)))
                handler(value);
            },
          );
        },
      );
    };
    this.onSubmit = (): void => handler(this.value$());
  }

}
