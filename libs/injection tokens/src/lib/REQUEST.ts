/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { InjectionToken } from "@angular/core";
import { type Request }   from "express";


export const REQUEST: InjectionToken<Request> = new InjectionToken<Request>("REQUEST");
