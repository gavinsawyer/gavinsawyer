/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyEvent } from "./SendgridAnyEvent";


export type SendgridDeliveredEvent =
  SendgridAnyEvent
  & {
    "ip"?: string
    "response": string
    "smtpId": string
    "tls"?: boolean
    "type": "delivered"
  };
