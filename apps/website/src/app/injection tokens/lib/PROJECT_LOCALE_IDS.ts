/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { InjectionToken }       from "@angular/core";
import { type ProjectLocaleId } from "../../types";


export const PROJECT_LOCALE_IDS: InjectionToken<Array<ProjectLocaleId>> = new InjectionToken<Array<ProjectLocaleId>>("PROJECT_LOCALE_IDS");
