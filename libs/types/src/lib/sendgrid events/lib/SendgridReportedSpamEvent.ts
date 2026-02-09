/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyEvent } from "./SendgridAnyEvent";


export type SendgridReportedSpamEvent =
  SendgridAnyEvent
  & { "type": "reported_spam" };
