/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyEvent } from "./SendgridAnyEvent";


export type SendgridProcessedEvent =
  SendgridAnyEvent
  & {
    "pool"?: {
      "id": number
      "name": string
    }
    "smtpId": string
    "type": "processed"
  };
