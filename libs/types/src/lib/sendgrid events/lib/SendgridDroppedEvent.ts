/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyEvent } from "./SendgridAnyEvent";


export type SendgridDroppedEvent =
  SendgridAnyEvent
  & {
    "reason": string
    "smtpId": string
    "status": string
    "type": "dropped"
  };
