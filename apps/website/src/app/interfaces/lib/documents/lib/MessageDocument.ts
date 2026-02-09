/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type Timestamp as AdminTimestamp } from "firebase-admin/firestore";
import { type Timestamp }                   from "firebase/firestore";


export interface MessageDocument {
  "created": AdminTimestamp | Timestamp;
  "email"?: string;
  "message": string;
  "name": string;
  "phone"?: string;
  "userId": string;
}
