/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyEvent } from "./SendgridAnyEvent";


export type SendgridClickedEvent =
  SendgridAnyEvent
  & {
    "asmGroupId"?: number
    "ip": string
    "type": "clicked"
    "url": string
    "urlOffset"?: {
      "index": number
      "type": string
    }
    "useragent": string
  };
