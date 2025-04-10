/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { NgOptimizedImage, NgTemplateOutlet }                                                                                                                                                        from "@angular/common";
import { afterRender, ChangeDetectionStrategy, Component, type ElementRef, inject, input, type InputSignal, type InputSignalWithTransform, numberAttribute, type OutputRef, type Signal, viewChild } from "@angular/core";
import { outputFromObservable, toObservable, toSignal }                                                                                                                                              from "@angular/core/rxjs-interop";
import { RouterLink }                                                                                                                                                                                from "@angular/router";
import { CanvasDirective, ContainerDirective, ElevatedDirective, HoverTransformingDirective, WellRoundedDirective }                                                                                  from "@bowstring/directives";
import { type Dimensions }                                                                                                                                                                           from "@bowstring/interfaces";
import { type Observable, startWith, Subject, switchMap }                                                                                                                                            from "rxjs";
import { fromPromise }                                                                                                                                                                               from "rxjs/internal/observable/innerFrom";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[class.appearance-circular]":              "appearanceInput$() === 'circular'",
      "[class.appearance-transparent]":           "appearanceInput$() === 'transparent'",
      "[class.outputObservedOrHasUrlInput]":      "outputSubject.observed || urlInput$()",
      "[style.--bowstring--image--aspect-ratio]": "(widthInput$() || imageDimensions$()?.width || 0) + '/' + (heightInput$() || imageDimensions$()?.height || 0)",
    },
    hostDirectives:  [
      { directive: CanvasDirective },
      {
        directive: ContainerDirective,
        inputs:    [
          "alignSelf",
          "aspectRatio",
          "marginBottom",
          "marginSides",
          "marginTop",
          "overflowX",
          "overflowY",
          "paddingBottom",
          "paddingSides",
          "paddingTop",
          "position",
          "positionBottom",
          "positionLeft",
          "positionRight",
          "positionTop",
          "scrollSnapAlign",
          "scrollSnapStop",
          "scrollSnapType",
        ],
      },
      {
        directive: ElevatedDirective,
        inputs:    [
          "level",
          "materialOpacity",
        ],
      },
      { directive: HoverTransformingDirective },
      {
        directive: WellRoundedDirective,
        inputs:    [ "level" ],
      },
    ],
    imports:         [
      NgOptimizedImage,
      NgTemplateOutlet,
      RouterLink,
    ],
    selector:        "bowstring--image",
    styleUrl:        "ImageComponent.sass",
    templateUrl:     "ImageComponent.html",

    standalone: true,
  },
)
export class ImageComponent {

  constructor() {
    afterRender(
      (): void => {
        this.hoverTransformingDirective.htmlElementRef$.set(this.htmlDivElementRef$());
        this.wellRoundedDirective.htmlElementRef$.set(this.htmlDivElementRef$());
      },
    );
  }

  private readonly htmlDivElementRef$: Signal<ElementRef<HTMLDivElement>>     = viewChild.required<ElementRef<HTMLDivElement>>("htmlDivElement");
  private readonly htmlImageElementRef$: Signal<ElementRef<HTMLImageElement>> = viewChild.required<ElementRef<HTMLImageElement>>("htmlImageElement");

  protected readonly containerDirective: ContainerDirective                 = inject<ContainerDirective>(ContainerDirective);
  protected readonly hoverTransformingDirective: HoverTransformingDirective = inject<HoverTransformingDirective>(HoverTransformingDirective);
  protected readonly imageDimensions$: Signal<Dimensions | undefined>       = toSignal<Dimensions | undefined>(
    toObservable<ElementRef<HTMLImageElement>>(this.htmlImageElementRef$).pipe<Dimensions, Dimensions | undefined>(
      switchMap<ElementRef<HTMLImageElement>, Observable<Dimensions>>(
        ({ nativeElement: htmlImageElement }: ElementRef<HTMLImageElement>): Observable<Dimensions> => fromPromise<Dimensions>(
          new Promise(
            (
              resolve: (imageDimensions: Dimensions) => void,
              reject: () => void,
            ): void => {
              htmlImageElement.onerror = reject;
              htmlImageElement.onload  = (): void => resolve(
                {
                  height: htmlImageElement.height,
                  width:  htmlImageElement.width,
                },
              );
            },
          ),
        ),
      ),
      startWith<Dimensions, [ undefined ]>(undefined),
    ),
    { requireSync: true },
  );
  protected readonly outputSubject: Subject<void>                           = new Subject<void>();
  protected readonly wellRoundedDirective: WellRoundedDirective             = inject<WellRoundedDirective>(WellRoundedDirective);

  public readonly altInput$: InputSignal<string | undefined>                                              = input<string | undefined>(
    undefined,
    { alias: "alt" },
  );
  public readonly appearanceInput$: InputSignal<"circular" | "transparent" | undefined>                   = input<"circular" | "transparent" | undefined>(
    undefined,
    { alias: "appearance" },
  );
  public readonly heightInput$: InputSignalWithTransform<number | undefined, "" | number | `${ number }`> = input<number | undefined, "" | number | `${ number }`>(
    undefined,
    {
      alias:     "height",
      transform: numberAttribute,
    },
  );
  public readonly input$: InputSignal<string | URL>                                                       = input.required<string | URL>(
    { alias: "input" },
  );
  public readonly output: OutputRef<void>                                                                 = outputFromObservable<void>(
    this.outputSubject.asObservable(),
    { alias: "output" },
  );
  public readonly urlInput$: InputSignal<string | undefined>                                              = input<string | undefined>(
    undefined,
    { alias: "url" },
  );
  public readonly widthInput$: InputSignalWithTransform<number | undefined, "" | number | `${ number }`>  = input<number | undefined, "" | number | `${ number }`>(
    undefined,
    {
      alias:     "width",
      transform: numberAttribute,
    },
  );

}
