/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser, NgTemplateOutlet }                                                                                                                                                                                  from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, contentChildren, ElementRef, forwardRef, inject, Injector, input, type InputSignal, model, type ModelSignal, PLATFORM_ID, Renderer2, signal, type Signal, viewChild } from "@angular/core";
import { toObservable, toSignal }                                                                                                                                                                                               from "@angular/core/rxjs-interop";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule }                                                                                                                                                                               from "@angular/forms";
import { CanvasDirective, ContainerDirective, ElevatedDirective, FlexboxContainerDirective, PrimaryDirective, WellRoundedDirective }                                                                                            from "@bowstring/directives";
import { SEGMENTED_CONTROL_VALUE_ACCESSOR }                                                                                                                                                                                     from "@bowstring/injection-tokens";
import { type SegmentedControlValueAccessor }                                                                                                                                                                                   from "@bowstring/interfaces";
import { combineLatest, firstValueFrom, type Observable, startWith, switchMap }                                                                                                                                                 from "rxjs";
import { v7 as uuidV7 }                                                                                                                                                                                                         from "uuid";
import { SegmentedControlOptionComponent }                                                                                                                                                                                      from "../segmented control option/SegmentedControlOptionComponent";


// noinspection CssUnknownProperty
@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[style.--bowstring--segmented-control--selected-option-index]":  "getOptionIndex(value)",
      "[style.--bowstring--segmented-control--selected-option-offset]": "getOptionOffset(value)",
      "[style.--bowstring--segmented-control--selected-option-width]":  "getOptionWidth(value)",
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
      { directive: PrimaryDirective },
      {
        directive: WellRoundedDirective,
        inputs:    [ "level" ],
      },
    ],
    imports:         [
      NgTemplateOutlet,
      ReactiveFormsModule,
      WellRoundedDirective,
    ],
    providers:       [
      {
        multi:       true,
        provide:     NG_VALUE_ACCESSOR,
        useExisting: forwardRef(
          (): typeof SegmentedControlComponent => SegmentedControlComponent,
        ),
      },
      {
        provide:     SEGMENTED_CONTROL_VALUE_ACCESSOR,
        useExisting: forwardRef(
          (): typeof SegmentedControlComponent => SegmentedControlComponent,
        ),
      },
    ],
    selector:        "bowstring--segmented-control",
    styleUrl:        "SegmentedControlComponent.sass",
    templateUrl:     "SegmentedControlComponent.html",

    standalone: true,
  },
)
export class SegmentedControlComponent
  implements SegmentedControlValueAccessor {

  constructor() {
    afterRender(
      (): void => {
        this.pickerWellRoundedDirective$().htmlElementRef$.set(this.pickerHtmlDivElementRef$());
        this.wellRoundedDirective.htmlElementRef$.set(this.htmlDivElementRef$());
      },
    );
  }

  private readonly htmlDivElementRef$: Signal<ElementRef<HTMLDivElement>>       = viewChild.required<ElementRef<HTMLDivElement>>("htmlDivElement");
  private readonly htmlSelectElementRef$: Signal<ElementRef<HTMLSelectElement>> = viewChild.required<ElementRef<HTMLSelectElement>>("htmlSelectElement");
  private readonly injector: Injector                                           = inject<Injector>(Injector);
  private readonly pickerHtmlDivElementRef$: Signal<ElementRef<HTMLDivElement>> = viewChild.required<ElementRef<HTMLDivElement>>("pickerHtmlDivElement");
  private readonly pickerWellRoundedDirective$: Signal<WellRoundedDirective>    = viewChild.required<WellRoundedDirective>("pickerWellRoundedDirective");
  private readonly platformId: NonNullable<unknown>                             = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly renderer2: Renderer2                                         = inject<Renderer2>(Renderer2);

  protected readonly containerDirective: ContainerDirective                                = inject<ContainerDirective>(ContainerDirective);
  protected readonly inputName$: Signal<`bowstring--segmented-control--input-${ string }`> = signal<`bowstring--segmented-control--input-${ string }`>(`bowstring--segmented-control--input-${ uuidV7() }`);
  protected readonly options$: Signal<Readonly<Array<SegmentedControlOptionComponent>>>    = contentChildren<SegmentedControlOptionComponent>(SegmentedControlOptionComponent);
  protected readonly optionWidths$: Signal<Array<number | undefined> | undefined>          = isPlatformBrowser(this.platformId) ? toSignal<Array<number | undefined> | undefined>(
    toObservable<Readonly<Array<SegmentedControlOptionComponent>>>(this.options$).pipe<Array<number | undefined>, Array<number | undefined> | undefined>(
      switchMap<Readonly<Array<SegmentedControlOptionComponent>>, Observable<Array<number | undefined>>>(
        (optionDirectives: Readonly<Array<SegmentedControlOptionComponent>>): Observable<Array<number | undefined>> => combineLatest<Array<number | undefined>>(
          optionDirectives.map<Observable<number | undefined>>(
            ({ width$ }: SegmentedControlOptionComponent): Observable<number | undefined> => toObservable<number | undefined>(
              width$,
              { injector: this.injector },
            ),
          ),
        ),
      ),
      startWith<Array<number | undefined>, [ undefined ]>(undefined),
    ),
    { requireSync: true },
  ) : signal<undefined>(undefined);
  protected readonly wellRoundedDirective: WellRoundedDirective                            = inject<WellRoundedDirective>(WellRoundedDirective);

  public readonly disabledModel$: ModelSignal<boolean | undefined> = model<boolean | undefined>(
    undefined,
    { alias: "disabled" },
  );
  public readonly labelInput$: InputSignal<string | undefined>     = input<string | undefined>(
    undefined,
    { alias: "label" },
  );

  public value: string = "" as const;

  protected getOptionOffset(value: string): number | undefined {
    return this.optionWidths$()?.slice(
      0,
      Math.max(
        0,
        this.options$().findIndex(
          ({ valueInput$ }: SegmentedControlOptionComponent): boolean => valueInput$() === value,
        ),
      ),
    ).reduce(
      (
        accumulator?: number,
        currentValue?: number,
      ): number => (accumulator || 0) + (currentValue || 0),
      0,
    );
  }
  protected getOptionWidth(value: string): number | undefined {
    return this.optionWidths$()?.[Math.max(
      0,
      this.options$().findIndex(
        ({ valueInput$ }: SegmentedControlOptionComponent): boolean => valueInput$() === value,
      ),
    )];
  }

  public getOptionIndex(value: string): number {
    return Math.max(
      0,
      this.options$().findIndex(
        ({ valueInput$ }: SegmentedControlOptionComponent): boolean => valueInput$() === value,
      ),
    );
  };
  public onChange?(): void
  public onTouched?(): void
  public registerOnChange(handler: (value: string) => void): void {
    this.onChange = (): void => handler(this.value);
  }
  public registerOnTouched(handler: () => void): void {
    this.onTouched = handler;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.disabledModel$.set(isDisabled);
  }
  public writeValue(value?: string): void {
    this.value = value || "";

    firstValueFrom<ElementRef<HTMLSelectElement> | undefined>(
      toObservable<ElementRef<HTMLSelectElement> | undefined>(
        this.htmlSelectElementRef$,
        { injector: this.injector },
      ),
    ).then<void>(
      (htmlSelectElementRef?: ElementRef<HTMLSelectElement>): void => {
        if (htmlSelectElementRef)
          this.renderer2.setProperty(
            htmlSelectElementRef.nativeElement,
            "value",
            this.value,
          );
      },
    );
  }

}
