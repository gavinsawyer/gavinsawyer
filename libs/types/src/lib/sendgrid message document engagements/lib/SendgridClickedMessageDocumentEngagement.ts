/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyMessageDocumentEngagement } from "./SendgridAnyMessageDocumentEngagement";


export type SendgridClickedMessageDocumentEngagement =
  SendgridAnyMessageDocumentEngagement
  & {
    "ip": string
    "type": "clicked"
    "useragent": string
  };
