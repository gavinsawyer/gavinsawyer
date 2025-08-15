/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { inject, Injectable }               from "@angular/core";
import { REQUEST }                          from "@bowstring/injection-tokens";
import { type Request }                     from "express";
import { type Timestamp as AdminTimestamp } from "firebase-admin/firestore";
import { type Timestamp }                   from "firebase/firestore";


@Injectable({ providedIn: "root" })
export class UserDateService {

  private readonly request: Request | null = inject<Request | null>(
    REQUEST,
    { optional: true },
  );

  public getUserDate(date?: Date): Date;
  public getUserDate(epochTime?: number): Date;
  public getUserDate(timestamp?: AdminTimestamp | Timestamp): Date;
  public getUserDate(dateEpochTimeOrTimestamp?: Date | number | AdminTimestamp | Timestamp): Date {
    const timezoneOffsetDifference: number = (this.request?.headersDistinct["timezone-offset"]?.[0] ? parseInt(this.request.headersDistinct["timezone-offset"][0]) - new Date().getTimezoneOffset() : 0) * 60000;

    if (dateEpochTimeOrTimestamp === undefined)
      dateEpochTimeOrTimestamp = new Date();

    const epochTime: number = dateEpochTimeOrTimestamp instanceof Date ? dateEpochTimeOrTimestamp.valueOf() : typeof dateEpochTimeOrTimestamp === "number" ? dateEpochTimeOrTimestamp : dateEpochTimeOrTimestamp.seconds * 1000;

    return new Date(epochTime - timezoneOffsetDifference);
  }

}
