/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridClickedMessageDocumentEngagement, type SendgridGroupResubscribedMessageDocumentEngagement, type SendgridGroupUnsubscribedMessageDocumentEngagement, type SendgridOpenedMessageDocumentEngagement, type SendgridReportedSpamMessageDocumentEngagement, type SendgridUnsubscribedMessageDocumentEngagement } from "./sendgrid message document engagements";


export type SendgridMessageDocumentEngagement =
  | SendgridClickedMessageDocumentEngagement
  | SendgridGroupResubscribedMessageDocumentEngagement
  | SendgridGroupUnsubscribedMessageDocumentEngagement
  | SendgridOpenedMessageDocumentEngagement
  | SendgridReportedSpamMessageDocumentEngagement
  | SendgridUnsubscribedMessageDocumentEngagement;
