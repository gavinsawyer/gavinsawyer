/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { inject, Injectable }           from "@angular/core";
import { type Analytics, getAnalytics } from "@angular/fire/analytics";
import { FirebaseAppService }           from "./FirebaseAppService";


@Injectable({ providedIn: "root" })
export class AnalyticsService {

  private readonly firebaseAppService: FirebaseAppService = inject<FirebaseAppService>(FirebaseAppService);

  public readonly analytics: Analytics = getAnalytics(this.firebaseAppService.firebaseApp);

}
