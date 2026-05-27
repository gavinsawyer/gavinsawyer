/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import colorsLib from "@bowstring/colors";
import { Brand } from "@bowstring/core";


export const brand: Brand = {
  copyrightHolder:    "Gavin William Sawyer",
  copyrightHolderUrl: "https://gavinsawyer.us/",
  city:               "Cambridge, MA",
  fontFamily:         "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  primaryColor:       {
    hue:        129,
    lightness:  .49999999,
    saturation: .16,
  },
  roundness:          1,
  secondaryColor:     colorsLib.flax,
  timeZone:           "America/New_York",
  warningColor:       colorsLib.carmine,

  get description(): string {
    return $localize`:@@libs--Config--Brand--Description:Gavin William Sawyer is an American entrepreneur and software engineer. He double-majored in Global Business and Analytics and minored in Cybersecurity at Suffolk University and has been creating software since age 13.`;
  },
  get title(): string {
    return $localize`:@@libs--Config--Brand--Title:gavinsawyer`;
  },
};
