/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { InjectionToken }               from "@angular/core";
import { type App as AdminFirebaseApp } from "firebase-admin/app";


export const ADMIN_FIREBASE_APP: InjectionToken<AdminFirebaseApp> = new InjectionToken<AdminFirebaseApp>("ADMIN_FIREBASE_APP");
