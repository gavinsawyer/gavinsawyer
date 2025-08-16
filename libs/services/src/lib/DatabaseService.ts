/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { inject, Injectable }         from "@angular/core";
import { type Database, getDatabase } from "@angular/fire/database";
import { FirebaseAppService }         from "./FirebaseAppService";


@Injectable({ providedIn: "root" })
export class DatabaseService {

  private readonly firebaseAppService: FirebaseAppService = inject<FirebaseAppService>(FirebaseAppService);

  public readonly database: Database = getDatabase(this.firebaseAppService.firebaseApp);

}
