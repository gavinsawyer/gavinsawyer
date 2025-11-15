/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                                                                                                                               from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, effect, type ElementRef, forwardRef, inject, input, type InputSignal, untracked }               from "@angular/core";
import { toObservable }                                                                                                                                   from "@angular/core/rxjs-interop";
import { NG_VALUE_ACCESSOR }                                                                                                                              from "@angular/forms";
import { CanvasDirective, ContainerDirective, ElevatedDirective, FlexboxContainerDirective, HoverTransformingDirective, WellRoundedDirective }            from "@bowstring/directives";
import { InsertZwnjsPipe }                                                                                                                                from "@bowstring/pipes";
import { AsYouType, type CountryCode, getCountries, getCountryCallingCode, isPossiblePhoneNumber, parseIncompletePhoneNumber, validatePhoneNumberLength } from "libphonenumber-js";
import { firstValueFrom }                                                                                                                                 from "rxjs";
import { InputComponent }                                                                                                                                 from "../../../input/InputComponent";


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
        useExisting: forwardRef((): typeof PhoneNumberFieldInputComponent => PhoneNumberFieldInputComponent),
      },
    ],
    selector:        "bowstring--phone-number-field-input",
    styleUrl:        "PhoneNumberFieldInputComponent.sass",
    templateUrl:     "PhoneNumberFieldInputComponent.html",

    standalone: true,
  },
)
export class PhoneNumberFieldInputComponent
  extends InputComponent {

  constructor() {
    super();

    afterRender(
      (): void => {
        this.hoverTransformingDirective.htmlElementRef$.set(this.htmlDivElementRef$());
        this.wellRoundedDirective.htmlElementRef$.set(this.htmlDivElementRef$());
      },
    );

    effect(
      (): void => {
        const value: Date | string = untracked<Date | string>(this.value$);

        if (typeof value === "string")
          this.renderer2.setProperty(
            this.htmlInputElementRef$().nativeElement,
            "value",
            new AsYouType(
              getCountries().find(
                (countryCode: CountryCode): boolean => getCountryCallingCode(countryCode) === this.countryCallingCodeInput$(),
              ),
            ).input(value),
          );
      },
    );
  }

  protected readonly containerDirective: ContainerDirective                 = inject<ContainerDirective>(ContainerDirective);
  protected readonly hoverTransformingDirective: HoverTransformingDirective = inject<HoverTransformingDirective>(HoverTransformingDirective);
  protected readonly wellRoundedDirective: WellRoundedDirective             = inject<WellRoundedDirective>(WellRoundedDirective);

  public readonly countryCallingCodeInput$: InputSignal<string> = input.required<string>({ alias: "countryCallingCode" });

  protected override onBlur(): void {
    setTimeout(
      (): void => {
        const value: Date | string = this.value$();

        this.focused$.set(this.document.activeElement === this.htmlButtonElementRef$()?.nativeElement);

        if (!this.focused$() && !value || (typeof value === "string" && isPossiblePhoneNumber(`+${ this.countryCallingCodeInput$() }${ value }`)))
          this.onChange?.();
      },
    );
  }
  protected override onInput(): void {
    this.value$.set(
      parseIncompletePhoneNumber(
        this.htmlInputElementRef$().nativeElement.value.slice(
          0,
          validatePhoneNumberLength(`+${ this.countryCallingCodeInput$() } ${ this.htmlInputElementRef$().nativeElement.value }`) === "TOO_LONG" ? - 1 : this.htmlInputElementRef$().nativeElement.value.length,
        ),
      ),
    );

    this.onChange?.();

    const value: Date | string = this.value$();

    if (typeof value === "string") {
      const asYouType: AsYouType = new AsYouType(
        getCountries().find(
          (countryCode: CountryCode): boolean => getCountryCallingCode(countryCode) === this.countryCallingCodeInput$(),
        ),
      );

      let formattedValue: string = asYouType.input(value);
      let template: string       = asYouType.getTemplate();

      while (template && template.charAt(template.length - 1) !== "x") {
        formattedValue = formattedValue.slice(
          0,
          formattedValue.length - 1,
        );
        template       = template.slice(
          0,
          template.length - 1,
        );
      }

      this.renderer2.setProperty(
        this.htmlInputElementRef$().nativeElement,
        "value",
        formattedValue,
      );
    }
  }

  public override registerOnChange(handler: (value: Date | string) => void): void {
    this.onChange = (): void => {
      setTimeout(
        (): void => {
          setTimeout(
            (): void => {
              const value: Date | string = this.value$();

              if (!value || (typeof value === "string" && isPossiblePhoneNumber(`+${ this.countryCallingCodeInput$() }${ value }`)))
                handler(value);
            },
          );
        },
      );
    };
    this.onSubmit = (): void => handler(this.value$());
  }
  public override writeValue(value?: string): void {
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
          firstValueFrom<string>(
            toObservable<string>(
              this.countryCallingCodeInput$,
              { injector: this.injector },
            ),
          ).then<void>(
            (countryCallingCodeInput: string): void => {
              firstValueFrom<Date | string>(
                toObservable<Date | string>(
                  this.value$,
                  { injector: this.injector },
                ),
              ).then<void>(
                (value: Date | string): void => {
                  if (countryCallingCodeInput) {
                    if (typeof value === "string") {
                      const asYouType: AsYouType = new AsYouType(
                        getCountries().find(
                          (countryCode: CountryCode): boolean => getCountryCallingCode(countryCode) === countryCallingCodeInput,
                        ),
                      );

                      let formattedValue: string = asYouType.input(value);
                      let template: string       = asYouType.getTemplate();

                      while (template && template.charAt(template.length - 1) !== "x") {
                        formattedValue = formattedValue.slice(
                          0,
                          formattedValue.length - 1,
                        );
                        template       = template.slice(
                          0,
                          template.length - 1,
                        );
                      }

                      this.renderer2.setProperty(
                        htmlInputElementRef.nativeElement,
                        "value",
                        formattedValue,
                      );
                    }
                  } else
                    this.renderer2.setProperty(
                      htmlInputElementRef.nativeElement,
                      "value",
                      value,
                    );
                },
              );
            },
          );
      },
    );
  }

}
