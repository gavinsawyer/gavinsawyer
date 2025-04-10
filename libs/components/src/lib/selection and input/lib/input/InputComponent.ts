/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { booleanAttribute, ChangeDetectionStrategy, Component, type ElementRef, forwardRef, inject, Injector, input, type InputSignal, type InputSignalWithTransform, model, type ModelSignal, Renderer2, signal, type Signal, viewChild } from "@angular/core";
import { toObservable, toSignal }                                                                                                                                                                                                          from "@angular/core/rxjs-interop";
import { ControlValueAccessor, NG_VALUE_ACCESSOR }                                                                                                                                                                                         from "@angular/forms";
import { type Symbol }                                                                                                                                                                                                                     from "@bowstring/interfaces";
import loadSymbol                                                                                                                                                                                                                          from "@bowstring/symbols";
import { firstValueFrom }                                                                                                                                                                                                                  from "rxjs";
import { fromPromise }                                                                                                                                                                                                                     from "rxjs/internal/observable/innerFrom";
import { v7 as uuidV7 }                                                                                                                                                                                                                    from "uuid";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            { "[class.disabled]": "disabledModel$()" },
    providers:       [
      {
        multi:       true,
        provide:     NG_VALUE_ACCESSOR,
        useExisting: forwardRef(
          (): typeof InputComponent => InputComponent,
        ),
      },
    ],
    template:        "",

    standalone: true,
  },
)
export class InputComponent
  implements ControlValueAccessor {

  protected readonly htmlDivElementRef$: Signal<ElementRef<HTMLDivElement>>              = viewChild.required<ElementRef<HTMLDivElement>>("htmlDivElement");
  protected readonly htmlInputElementRef$: Signal<ElementRef<HTMLInputElement>>          = viewChild.required<ElementRef<HTMLInputElement>>("htmlInputElement");
  protected readonly injector: Injector                                                  = inject<Injector>(Injector);
  protected readonly inputName$: Signal<`bowstring--input-directive--input-${ string }`> = signal<`bowstring--input-directive--input-${ string }`>(`bowstring--input-directive--input-${ uuidV7() }`);
  protected readonly renderer2: Renderer2                                                = inject<Renderer2>(Renderer2);
  protected readonly xmarkCircleFillSymbol$: Signal<Symbol | undefined>                  = toSignal<Symbol>(
    fromPromise<Symbol>(
      loadSymbol("XmarkCircleFill"),
    ),
  );

  public readonly autocompleteInput$: InputSignal<string | undefined>                                                                  = input<string | undefined>(
    undefined,
    { alias: "autocomplete" },
  );
  public readonly disabledModel$: ModelSignal<boolean | undefined>                                                                     = model<boolean | undefined>(
    undefined,
    { alias: "disabled" },
  );
  public readonly explicitAutocompleteInput$: InputSignalWithTransform<boolean | undefined, "" | boolean | `${ boolean }` | undefined> = input<boolean | undefined, "" | boolean | `${ boolean }` | undefined>(
    undefined,
    {
      alias:     "explicitAutocomplete",
      transform: booleanAttribute,
    },
  );
  public readonly labelInput$: InputSignal<string | undefined>                                                                         = input<string | undefined>(
    undefined,
    { alias: "label" },
  );
  public readonly placeholderInput$: InputSignal<string | undefined>                                                                   = input<string | undefined>(
    undefined,
    { alias: "placeholder" },
  );
  public readonly typeInput$: InputSignal<"email" | "password" | undefined>                                                            = input<"email" | "password" | undefined>(
    undefined,
    { alias: "type" },
  );

  protected value: Date | string = "" as const;

  protected onChange?(): void
  protected onInput(): void {
    this.value = this.htmlInputElementRef$().nativeElement.value;
  }
  protected onTouched?(): void

  public registerOnChange(handler: (value: Date | string) => void): void {
    this.onChange = (): void => handler(this.value);
  }
  public registerOnTouched(handler: () => void): void {
    this.onTouched = handler;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.disabledModel$.set(isDisabled);
  }
  public writeValue(value?: Date | string): void {
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
            value,
          );
      },
    );
  }

}
