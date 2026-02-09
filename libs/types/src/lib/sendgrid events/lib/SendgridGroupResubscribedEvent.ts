/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyEvent } from "./SendgridAnyEvent";


export type SendgridGroupResubscribedEvent =
  SendgridAnyEvent
  & {
    "asmGroupId": number
    "ip": string
    "type": "group_resubscribed"
    "url": string
    "useragent": string
  };
