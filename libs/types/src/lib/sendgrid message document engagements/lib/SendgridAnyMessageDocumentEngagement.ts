/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type Timestamp as AdminTimestamp } from "firebase-admin/firestore";
import { type Timestamp }                   from "firebase/firestore";


export type SendgridAnyMessageDocumentEngagement = {
  "sendgridEventId": string;
  "timestamp": AdminTimestamp | Timestamp
};
