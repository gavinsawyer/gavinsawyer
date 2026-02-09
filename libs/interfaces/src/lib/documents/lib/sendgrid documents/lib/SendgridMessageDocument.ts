/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type DocumentUpdateError, type SendgridMessageDocumentEngagement, type SendgridMessageDocumentStatus, type SendgridMessageDocumentUpdateOrigin } from "@bowstring/types";
import { type Timestamp as AdminTimestamp }                                                                                                               from "firebase-admin/firestore";
import { type Timestamp }                                                                                                                                 from "firebase/firestore";


/** Represents a Sendgrid message. */
export interface SendgridMessageDocument {
  "created": AdminTimestamp | Timestamp;
  "bounced"?: AdminTimestamp | Timestamp;
  "bouncedSendgridEventId"?: string;
  "deferred"?: AdminTimestamp | Timestamp;
  "deferredSendgridEventId"?: string;
  "delivered"?: AdminTimestamp | Timestamp;
  "deliveredSendgridEventId"?: string;
  "dropped"?: AdminTimestamp | Timestamp;
  "droppedSendgridEventId"?: string;
  "engagements"?: Array<SendgridMessageDocumentEngagement>;
  "html": string;
  "processed"?: AdminTimestamp | Timestamp;
  "processedSendgridEventId"?: string;
  "recipient": string;
  "sender": string;
  "status"?: SendgridMessageDocumentStatus;
  "subject": string;
  "text": string;
  "updated"?: AdminTimestamp | Timestamp;
  "updateError"?: DocumentUpdateError;
  "updateOrigin": SendgridMessageDocumentUpdateOrigin;
  "userId": string;
}
