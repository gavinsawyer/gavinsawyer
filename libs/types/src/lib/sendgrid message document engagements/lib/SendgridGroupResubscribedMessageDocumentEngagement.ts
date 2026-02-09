/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyMessageDocumentEngagement } from "./SendgridAnyMessageDocumentEngagement";


export type SendgridGroupResubscribedMessageDocumentEngagement =
  SendgridAnyMessageDocumentEngagement
  & {
    "ip": string
    "type": "group_resubscribed"
    "useragent": string
  };
