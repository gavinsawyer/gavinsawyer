/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyEvent } from "./SendgridAnyEvent";


export type SendgridOpenedEvent =
  SendgridAnyEvent
  & {
    "ip": string
    "machineOpen"?: boolean
    "type": "opened"
    "useragent": string
  };
