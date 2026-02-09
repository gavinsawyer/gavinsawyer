/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridAnyMessageDocumentEngagement } from "./SendgridAnyMessageDocumentEngagement";


export type SendgridReportedSpamMessageDocumentEngagement =
  SendgridAnyMessageDocumentEngagement
  & { "type": "reported_spam" };
