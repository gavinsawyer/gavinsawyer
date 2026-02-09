/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyMessageDocumentEngagement } from "./SendgridAnyMessageDocumentEngagement";


export type SendgridOpenedMessageDocumentEngagement =
  SendgridAnyMessageDocumentEngagement
  & {
    "ip": string
    "machineOpen": boolean
    "type": "opened"
    "useragent": string
  };
