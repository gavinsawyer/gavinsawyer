/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { defineSecret, type SecretParam } from "firebase-functions/params";


/** A {@link SecretParam} referencing a {@link https://www.twilio.com/docs/sendgrid/api-reference/api-keys|SendGrid API Key} */
export const Sendgrid_API_Key: SecretParam = defineSecret("Sendgrid_API_Key");
