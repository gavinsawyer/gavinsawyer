/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridBouncedEvent, type SendgridClickedEvent, type SendgridDeferredEvent, type SendgridDeliveredEvent, type SendgridDroppedEvent, type SendgridGroupResubscribedEvent, type SendgridGroupUnsubscribedEvent, type SendgridOpenedEvent, type SendgridProcessedEvent, type SendgridReportedSpamEvent, type SendgridUnsubscribedEvent } from "./sendgrid events";


/** An {@link https://www.twilio.com/docs/sendgrid/for-developers/tracking-events/event|event} sent to the SendGrid webhook. */
export type SendgridEvent =
  | SendgridBouncedEvent
  | SendgridClickedEvent
  | SendgridDeferredEvent
  | SendgridDeliveredEvent
  | SendgridDroppedEvent
  | SendgridGroupResubscribedEvent
  | SendgridGroupUnsubscribedEvent
  | SendgridOpenedEvent
  | SendgridProcessedEvent
  | SendgridReportedSpamEvent
  | SendgridUnsubscribedEvent;
