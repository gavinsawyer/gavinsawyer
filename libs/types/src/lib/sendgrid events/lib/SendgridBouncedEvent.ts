/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyEvent } from "./SendgridAnyEvent";


export type SendgridBouncedEvent =
  SendgridAnyEvent
  & {
    "bounceIssue"?: string
    "reason": string
    "smtpId": string
    "soft"?: boolean
    "status": string
    "tls"?: boolean
    "type": "bounced"
  };
