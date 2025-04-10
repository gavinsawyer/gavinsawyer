/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { Directive, inject, signal, type Signal } from "@angular/core";
import type * as brandLib                         from "@bowstring/brand";
import { BRAND }                                  from "@bowstring/injection-tokens";
import { type Color }                             from "@bowstring/interfaces";


@Directive(
  {
    host: {
      "[style.--bowstring--secondary-directive--brand-secondary-background-dark]":  "brandSecondaryBackgroundDark$()",
      "[style.--bowstring--secondary-directive--brand-secondary-background-light]": "brandSecondaryBackgroundLight$()",
      "[style.--bowstring--secondary-directive--brand-secondary-foreground-dark]":  "brandSecondaryForegroundDark$()",
      "[style.--bowstring--secondary-directive--brand-secondary-foreground-light]": "brandSecondaryForegroundLight$()",
    },

    standalone: true,
  },
)
export class SecondaryDirective {

  private readonly brandLib: typeof brandLib = inject<typeof brandLib>(BRAND);

  protected readonly brandSecondaryBackgroundDark$: Signal<`hsl(${ number }, ${ number }%, ${ number }%)`>  = signal<`hsl(${ number }, ${ number }%, ${ number }%)`>(((color: Color): `hsl(${ number }, ${ number }%, ${ number }%)` => `hsl(${ color.hue }, ${ 100 * Math.max(
    0,
    Math.min(
      1,
      (1 - 0.0625) * color.saturation,
    ),
  ) }%, ${ 100 * Math.max(
    0,
    Math.min(
      1,
      (1 - 0.0625) * color.lightness,
    ),
  ) }%)`)(this.brandLib.secondaryColor));
  protected readonly brandSecondaryBackgroundLight$: Signal<`hsl(${ number }, ${ number }%, ${ number }%)`> = signal<`hsl(${ number }, ${ number }%, ${ number }%)`>(((color: Color): `hsl(${ number }, ${ number }%, ${ number }%)` => `hsl(${ color.hue }, ${ 100 * Math.max(
    0,
    Math.min(
      1,
      (1 + 0.0625) * color.saturation,
    ),
  ) }%, ${ 100 * Math.max(
    0,
    Math.min(
      1,
      (1 + 0.0625) * color.lightness,
    ),
  ) }%)`)(this.brandLib.secondaryColor));
  protected readonly brandSecondaryForegroundDark$: Signal<`hsl(${ number }, ${ number }%, ${ number }%)`>  = signal<`hsl(${ number }, ${ number }%, ${ number }%)`>(((color: Color): `hsl(${ number }, ${ number }%, ${ number }%)` => `hsl(${ color.hue }, ${ 100 * Math.max(
    0,
    Math.min(
      1,
      Math.pow(
        color.saturation,
        color.lightness >= 0.5 ? 2.9375 : 0.1875,
      ),
    ),
  ) }%, ${ 100 * Math.max(
    0,
    Math.min(
      1,
      Math.pow(
        color.lightness,
        color.lightness >= 0.5 ? 2.9375 : 0.1875,
      ),
    ),
  ) }%)`)(this.brandLib.secondaryColor));
  protected readonly brandSecondaryForegroundLight$: Signal<`hsl(${ number }, ${ number }%, ${ number }%)`> = signal<`hsl(${ number }, ${ number }%, ${ number }%)`>(((color: Color): `hsl(${ number }, ${ number }%, ${ number }%)` => `hsl(${ color.hue }, ${ 100 * Math.max(
    0,
    Math.min(
      1,
      Math.pow(
        color.saturation,
        color.lightness >= 0.5 ? 2.8125 : 0.0625,
      ),
    ),
  ) }%, ${ 100 * Math.max(
    0,
    Math.min(
      1,
      Math.pow(
        color.lightness,
        color.lightness >= 0.5 ? 2.8125 : 0.0625,
      ),
    ),
  ) }%)`)(this.brandLib.secondaryColor));

}
