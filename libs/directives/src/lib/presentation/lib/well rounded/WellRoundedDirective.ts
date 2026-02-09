/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { isPlatformBrowser }                                                                                                                                          from "@angular/common";
import { computed, Directive, type ElementRef, inject, input, type InputSignalWithTransform, numberAttribute, PLATFORM_ID, type Signal, signal, type WritableSignal } from "@angular/core";
import { toObservable, toSignal }                                                                                                                                     from "@angular/core/rxjs-interop";
import type * as configLib                                                                                                                                            from "@bowstring/config";
import { CONFIG }                                                                                                                                                     from "@bowstring/injection-tokens";
import { type Dimensions }                                                                                                                                            from "@bowstring/interfaces";
import { filter, map, Observable, type Observer, startWith, switchMap, type TeardownLogic }                                                                           from "rxjs";
import { v7 as uuidV7 }                                                                                                                                               from "uuid";


@Directive(
  {
    exportAs: "wellRoundedDirective",
    host:     {
      "[class.uninitialized]":                                               "pathDefinition$() === 'M 0,0 L 1,0 C 1,0 1,0 1,0 L 1,0.5 C 1,1 1,1 1,1 L 0,1 C 0,1 0,1 0,0.5 L 0,0.5 C 0,0 0,0 0,0 Z'",
      "[style.--bowstring--well-rounded-directive--roundness]":              "configLib.brand.roundness",
      "[style.--bowstring--well-rounded-directive--clip-path-source]":       "clipPathSource$()",
      "[style.--bowstring--well-rounded-directive--glass-mask-source]":      "glassMaskSource$()",
      "[style.--bowstring--well-rounded-directive--height]":                 "height$()",
      "[style.--bowstring--well-rounded-directive--level-input]":            "levelInput$()",
      "[style.--bowstring--well-rounded-directive--material-opacity-input]": "materialOpacityInput$()",
      "[style.--bowstring--well-rounded-directive--width]":                  "width$()",
    },
    selector: "[bowstringWellRoundedDirective]",

    standalone: true,
  },
)
export class WellRoundedDirective {

  public readonly htmlElementRef$: WritableSignal<ElementRef<HTMLElement> | undefined> = signal<undefined>(undefined);

  private readonly platformId: NonNullable<unknown>            = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly dimensions$: Signal<Dimensions | undefined> = isPlatformBrowser(this.platformId) ? toSignal<Dimensions>(
    toObservable<ElementRef<HTMLElement> | undefined>(this.htmlElementRef$).pipe<ElementRef<HTMLElement>, Dimensions>(
      filter<ElementRef<HTMLElement> | undefined, ElementRef<HTMLElement>>((htmlElementRef?: ElementRef<HTMLElement>): htmlElementRef is ElementRef<HTMLElement> => !!htmlElementRef),
      switchMap<ElementRef<HTMLElement>, Observable<Dimensions>>(
        ({ nativeElement: htmlElement }: ElementRef<HTMLElement>): Observable<Dimensions> => new Observable<Dimensions>(
          (dimensionsObserver: Observer<Dimensions>): TeardownLogic => {
            const resizeObserver: ResizeObserver = new ResizeObserver(
              ([ { target: element } ]: Array<ResizeObserverEntry>): void => dimensionsObserver.next(
                {
                  height: element.clientHeight,
                  width:  element.clientWidth,
                },
              ),
            );

            resizeObserver.observe(htmlElement);

            return (): void => resizeObserver.disconnect();
          },
        ),
      ),
    ),
  ) : signal<undefined>(undefined);

  protected readonly configLib: typeof configLib = inject<typeof configLib>(CONFIG);

  public readonly clipPathId$: Signal<`bowstring--well-rounded-directive--clip-path-${ string }`>   = signal<`bowstring--well-rounded-directive--clip-path-${ string }`>(`bowstring--well-rounded-directive--clip-path-${ uuidV7() }`);
  public readonly glassMaskId$: Signal<`bowstring--well-rounded-directive--glass-mask-${ string }`> = signal<`bowstring--well-rounded-directive--glass-mask-${ string }`>(`bowstring--well-rounded-directive--glass-mask-${ uuidV7() }`);

  protected readonly clipPathSource$: Signal<`url(#bowstring--well-rounded-directive--clip-path-${ string })`>   = toSignal<`url(#bowstring--well-rounded-directive--clip-path-${ string })`>(
    toObservable<`bowstring--well-rounded-directive--clip-path-${ string }`>(this.clipPathId$).pipe<`bowstring--well-rounded-directive--clip-path-${ string }`, `url(#bowstring--well-rounded-directive--clip-path-${ string })`>(
      startWith<`bowstring--well-rounded-directive--clip-path-${ string }`>(this.clipPathId$()),
      map<`bowstring--well-rounded-directive--clip-path-${ string }`, `url(#bowstring--well-rounded-directive--clip-path-${ string })`>((clipPathId: `bowstring--well-rounded-directive--clip-path-${ string }`): `url(#bowstring--well-rounded-directive--clip-path-${ string })` => `url(#${ clipPathId })`),
    ),
    { requireSync: true },
  );
  protected readonly glassMaskSource$: Signal<`url(#bowstring--well-rounded-directive--glass-mask-${ string })`> = toSignal<`url(#bowstring--well-rounded-directive--glass-mask-${ string })`>(
    toObservable<`bowstring--well-rounded-directive--glass-mask-${ string }`>(this.glassMaskId$).pipe<`bowstring--well-rounded-directive--glass-mask-${ string }`, `url(#bowstring--well-rounded-directive--glass-mask-${ string })`>(
      startWith<`bowstring--well-rounded-directive--glass-mask-${ string }`>(this.glassMaskId$()),
      map<`bowstring--well-rounded-directive--glass-mask-${ string }`, `url(#bowstring--well-rounded-directive--glass-mask-${ string })`>((glassMaskId: `bowstring--well-rounded-directive--glass-mask-${ string }`): `url(#bowstring--well-rounded-directive--glass-mask-${ string })` => `url(#${ glassMaskId })`),
    ),
    { requireSync: true },
  );
  protected readonly height$: Signal<number | undefined>                                                         = computed<number | undefined>((): number | undefined => this.dimensions$()?.height);
  protected readonly width$: Signal<number | undefined>                                                          = computed<number | undefined>((): number | undefined => this.dimensions$()?.width);

  public readonly levelInput$: InputSignalWithTransform<number | undefined, "" | number | `${ number }`>                                                                                                                       = input<number | undefined, "" | number | `${ number }`>(
    undefined,
    {
      alias:     "level",
      transform: numberAttribute,
    },
  );
  public readonly materialOpacityInput$: InputSignalWithTransform<number | undefined, "" | number | `${ number }`>                                                                                                             = input<number | undefined, "" | number | `${ number }`>(
    undefined,
    {
      alias:     "materialOpacity",
      transform: numberAttribute,
    },
  );
  public readonly pathDefinition$: Signal<`M ${ number },0 L ${ number },0 C 1,0 1,0 1,${ number } L 1,${ number } C 1,1 1,1 ${ number },1 L ${ number },1 C 0,1 0,1 0,${ number } L 0,${ number } C 0,0 0,0 ${ number },0 Z`> = isPlatformBrowser(this.platformId) ? toSignal<`M ${ number },0 L ${ number },0 C 1,0 1,0 1,${ number } L 1,${ number } C 1,1 1,1 ${ number },1 L ${ number },1 C 0,1 0,1 0,${ number } L 0,${ number } C 0,0 0,0 ${ number },0 Z`>(
    toObservable<Dimensions | undefined>(this.dimensions$).pipe<Dimensions, `M ${ number },0 L ${ number },0 C 1,0 1,0 1,${ number } L 1,${ number } C 1,1 1,1 ${ number },1 L ${ number },1 C 0,1 0,1 0,${ number } L 0,${ number } C 0,0 0,0 ${ number },0 Z`, `M ${ number },0 L ${ number },0 C 1,0 1,0 1,${ number } L 1,${ number } C 1,1 1,1 ${ number },1 L ${ number },1 C 0,1 0,1 0,${ number } L 0,${ number } C 0,0 0,0 ${ number },0 Z`>(
      filter<Dimensions | undefined, Dimensions>((dimensions?: Dimensions): dimensions is Dimensions => !!dimensions),
      map<Dimensions, `M ${ number },0 L ${ number },0 C 1,0 1,0 1,${ number } L 1,${ number } C 1,1 1,1 ${ number },1 L ${ number },1 C 0,1 0,1 0,${ number } L 0,${ number } C 0,0 0,0 ${ number },0 Z`>(
        (
          {
            height,
            width,
          }: Dimensions,
        ): `M ${ number },0 L ${ number },0 C 1,0 1,0 1,${ number } L 1,${ number } C 1,1 1,1 ${ number },1 L ${ number },1 C 0,1 0,1 0,${ number } L 0,${ number } C 0,0 0,0 ${ number },0 Z` => {
          const positionDividend: number = this.configLib.brand.roundness * 48 / (this.levelInput$() || 1);
          const radiusX: number          = Math.min(
            positionDividend / (width || 1),
            0.75,
          );
          const radiusY: number          = Math.min(
            positionDividend / (height || 1),
            0.75,
          );

          return `M ${ radiusX },0 L ${ 1 - radiusX },0 C 1,0 1,0 1,${ radiusY } L 1,${ 1 - radiusY } C 1,1 1,1 ${ 1 - radiusX },1 L ${ radiusX },1 C 0,1 0,1 0,${ 1 - radiusY } L 0,${ radiusY } C 0,0 0,0 ${ radiusX },0 Z`;
        },
      ),
      startWith<`M ${ number },0 L ${ number },0 C 1,0 1,0 1,${ number } L 1,${ number } C 1,1 1,1 ${ number },1 L ${ number },1 C 0,1 0,1 0,${ number } L 0,${ number } C 0,0 0,0 ${ number },0 Z`, [ "M 0,0 L 1,0 C 1,0 1,0 1,0 L 1,0.5 C 1,1 1,1 1,1 L 0,1 C 0,1 0,1 0,0.5 L 0,0.5 C 0,0 0,0 0,0 Z" ]>("M 0,0 L 1,0 C 1,0 1,0 1,0 L 1,0.5 C 1,1 1,1 1,1 L 0,1 C 0,1 0,1 0,0.5 L 0,0.5 C 0,0 0,0 0,0 Z"),
    ),
    { requireSync: true },
  ) : signal<"M 0,0 L 1,0 C 1,0 1,0 1,0 L 1,0.5 C 1,1 1,1 1,1 L 0,1 C 0,1 0,1 0,0.5 L 0,0.5 C 0,0 0,0 0,0 Z">("M 0,0 L 1,0 C 1,0 1,0 1,0 L 1,0.5 C 1,1 1,1 1,1 L 0,1 C 0,1 0,1 0,0.5 L 0,0.5 C 0,0 0,0 0,0 Z");

}
