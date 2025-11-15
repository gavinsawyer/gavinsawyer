/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { DOCUMENT }                                                                                                                                                                                                                                                                                  from "@angular/common";
import { booleanAttribute, ChangeDetectionStrategy, Component, type ElementRef, forwardRef, inject, Injector, input, type InputSignal, type InputSignalWithTransform, model, type ModelSignal, output, OutputEmitterRef, Renderer2, signal, type Signal, untracked, viewChild, type WritableSignal } from "@angular/core";
import { toObservable, toSignal }                                                                                                                                                                                                                                                                    from "@angular/core/rxjs-interop";
import { ControlValueAccessor, NG_VALUE_ACCESSOR }                                                                                                                                                                                                                                                   from "@angular/forms";
import { type Symbol }                                                                                                                                                                                                                                                                               from "@bowstring/interfaces";
import { RxSsrService }                                                                                                                                                                                                                                                                              from "@bowstring/services";
import loadSymbol                                                                                                                                                                                                                                                                                    from "@bowstring/symbols";
import { type SymbolName }                                                                                                                                                                                                                                                                           from "@bowstring/types";
import { firstValueFrom, from, Observable, of, switchMap }                                                                                                                                                                                                                                           from "rxjs";
import { v7 as uuidV7 }                                                                                                                                                                                                                                                                              from "uuid";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            { "[class.disabled]": "disabledModel$()" },
    providers:       [
      {
        multi:       true,
        provide:     NG_VALUE_ACCESSOR,
        useExisting: forwardRef((): typeof InputComponent => InputComponent),
      },
    ],
    template:        "",

    standalone: true,
  },
)
export class InputComponent
  implements ControlValueAccessor {

  protected readonly document: Document                                                       = inject<Document>(DOCUMENT);
  protected readonly focused$: WritableSignal<boolean>                                        = signal<false>(false);
  protected readonly htmlButtonElementRef$: Signal<ElementRef<HTMLButtonElement> | undefined> = viewChild<ElementRef<HTMLButtonElement>>("htmlButtonElement");
  protected readonly htmlDivElementRef$: Signal<ElementRef<HTMLDivElement>>                   = viewChild.required<ElementRef<HTMLDivElement>>("htmlDivElement");
  protected readonly htmlInputElementRef$: Signal<ElementRef<HTMLInputElement>>               = viewChild.required<ElementRef<HTMLInputElement>>("htmlInputElement");
  protected readonly injector: Injector                                                       = inject<Injector>(Injector);
  protected readonly inputName$: Signal<`bowstring--input-directive--input-${ string }`>      = signal<`bowstring--input-directive--input-${ string }`>(`bowstring--input-directive--input-${ uuidV7() }`);
  protected readonly renderer2: Renderer2                                                     = inject<Renderer2>(Renderer2);
  protected readonly rxSsrService: RxSsrService                                               = inject<RxSsrService>(RxSsrService);
  protected readonly value$: WritableSignal<Date | string>                                    = signal<Date | string>("");
  protected readonly xmarkCircleFillSymbol$: Signal<Symbol | undefined>                       = toSignal<Symbol>(
    of<SymbolName>("XmarkCircleFill").pipe<Symbol>(
      this.rxSsrService.wrap<SymbolName, Symbol>(
        switchMap<SymbolName, Observable<Symbol>>(
          (symbolName: SymbolName): Observable<Symbol> => from<Promise<Symbol>>(loadSymbol(symbolName)),
        ),
        "Symbol:XmarkCircleFill",
      ),
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
  public readonly enterKeyHintInput$: InputSignal<"done" | "enter" | "go" | "next" | "previous" | "search" | "send" | undefined>       = input<"done" | "enter" | "go" | "next" | "previous" | "search" | "send" | undefined>(
    undefined,
    { alias: "enterKeyHint" },
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
  public readonly nextFocused: OutputEmitterRef<void>                                                                                  = output<void>();
  public readonly placeholderInput$: InputSignal<string | undefined>                                                                   = input<string | undefined>(
    undefined,
    { alias: "placeholder" },
  );
  public readonly previousFocused: OutputEmitterRef<void>                                                                              = output<void>();
  public readonly typeInput$: InputSignal<"email" | "password" | undefined>                                                            = input<"email" | "password" | undefined>(
    undefined,
    { alias: "type" },
  );

  protected onBlur(): void {
    setTimeout(
      (): void => {
        this.focused$.set(this.document.activeElement === this.htmlButtonElementRef$()?.nativeElement);

        if (!this.focused$())
          this.onChange?.();
      },
    );
  }
  protected onChange?(): void
  protected onFocus(): void {
    this.focused$.set(true);

    this.onTouched?.();
  }
  protected onInput(): void {
    this.value$.set(this.htmlInputElementRef$().nativeElement.value);

    this.onChange?.();
  }
  protected onSubmit?(): void
  protected onTouched?(): void

  public focus(): void {
    this.htmlInputElementRef$().nativeElement.focus();
  }
  public focusNext(): void {
    this.nextFocused.emit();
  }
  public focusPrevious(): void {
    this.previousFocused.emit();
  }
  public registerOnChange(handler: (value: Date | string) => void): void {
    this.onChange = (): void => {
      setTimeout(
        (): void => {
          setTimeout(
            (): void => handler(this.value$()),
          );
        },
      );
    };
    this.onSubmit = (): void => handler(this.value$());
  }
  public registerOnTouched(handler: () => void): void {
    this.onTouched = handler;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.disabledModel$.set(isDisabled);
  }
  public writeValue(value?: Date | string): void {
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
          firstValueFrom<Date | string>(
            toObservable<Date | string>(
              this.value$,
              { injector: this.injector },
            ),
          ).then<void>(
            (value: Date | string): void => this.renderer2.setProperty(
              htmlInputElementRef.nativeElement,
              "value",
              value,
            ),
          );
      },
    );
  }

}
