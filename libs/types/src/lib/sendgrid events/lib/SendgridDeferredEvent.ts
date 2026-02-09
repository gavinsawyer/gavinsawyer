/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyEvent } from "./SendgridAnyEvent";


export type SendgridDeferredEvent =
  SendgridAnyEvent
  & {
    "attempt": string
    "domain"?: string
    "from"?: string
    "reason"?: string
    "response": string
    "smtpId": string
    "type": "deferred"
  };
