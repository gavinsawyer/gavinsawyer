/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { InjectionToken } from "@angular/core";
import type * as brandLib from "@bowstring/brand";


export const BRAND: InjectionToken<typeof brandLib> = new InjectionToken<typeof brandLib>("BRAND");
