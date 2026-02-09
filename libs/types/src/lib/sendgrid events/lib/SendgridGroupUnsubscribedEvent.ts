/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyEvent } from "./SendgridAnyEvent";


export type SendgridGroupUnsubscribedEvent =
  SendgridAnyEvent
  & {
    "asmGroupId": number
    "ip": string
    "type": "group_unsubscribed"
    "url": string
    "useragent": string
  };
