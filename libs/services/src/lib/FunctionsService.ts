/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { inject, Injectable }           from "@angular/core";
import { type Functions, getFunctions } from "@angular/fire/functions";
import { FirebaseAppService }           from "./FirebaseAppService";


@Injectable({ providedIn: "root" })
export class FunctionsService {

  private readonly firebaseAppService: FirebaseAppService = inject<FirebaseAppService>(FirebaseAppService);

  public readonly functions: Functions = getFunctions(this.firebaseAppService.firebaseApp);

}
