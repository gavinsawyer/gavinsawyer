/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { InjectionToken } from "@angular/core";
import { type Routes }    from "@angular/router";


export const PROJECT_ROUTES: InjectionToken<Routes> = new InjectionToken<Routes>("PROJECT_ROUTES");
