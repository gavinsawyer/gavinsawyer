/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { InjectionToken }  from "@angular/core";
import type * as configLib from "@bowstring/config";


export const CONFIG: InjectionToken<typeof configLib> = new InjectionToken<typeof configLib>("CONFIG");
