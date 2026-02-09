/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

export type SendgridAnyEvent = {
  "category"?: Array<string> | string
  "createdFirestoreEventId"?: string
  "documentId": string
  "email": string
  "id": string
  "marketingCampaignId"?: string
  "marketingCampaignName"?: string
  "messageId"?: string
  "timestamp": number
  "userId": string
};
