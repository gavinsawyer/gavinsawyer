/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { InjectionToken }         from "@angular/core";
import { type Auth as AdminAuth } from "firebase-admin/auth";


export const ADMIN_AUTH: InjectionToken<AdminAuth> = new InjectionToken("ADMIN_AUTH");
