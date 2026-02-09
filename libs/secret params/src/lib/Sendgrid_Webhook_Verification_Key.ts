/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { defineSecret, type SecretParam } from "firebase-functions/params";


/** A {@link SecretParam} referencing a {@link https://www.twilio.com/docs/sendgrid/api-reference/webhooks/toggle-signature-verification-for-an-event-webhook|SendGrid Webhook Verification Key} */
export const Sendgrid_Webhook_Verification_Key: SecretParam = defineSecret("Sendgrid_Webhook_Verification_Key");
