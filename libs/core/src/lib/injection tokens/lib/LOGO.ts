/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { InjectionToken } from "@angular/core";
import { type Logo }      from "../../interfaces";


export const LOGO: InjectionToken<Logo> = new InjectionToken<Logo>("LOGO");
