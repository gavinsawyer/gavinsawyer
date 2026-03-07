/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type Timestamp } from "@bowstring/core";


export interface MessageDocument {
  "created": Timestamp;
  "email"?: string;
  "message": string;
  "name": string;
  "phone"?: string;
  "userId": string;
}
