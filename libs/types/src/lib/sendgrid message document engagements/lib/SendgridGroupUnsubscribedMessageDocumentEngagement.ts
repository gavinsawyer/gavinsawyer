/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyMessageDocumentEngagement } from "./SendgridAnyMessageDocumentEngagement";


export type SendgridGroupUnsubscribedMessageDocumentEngagement =
  SendgridAnyMessageDocumentEngagement
  & {
    "ip": string
    "type": "group_unsubscribed"
    "useragent": string
  };
