/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyEvent } from "./SendgridAnyEvent";


export type SendgridUnsubscribedEvent =
  SendgridAnyEvent
  & { "type": "unsubscribed" };
