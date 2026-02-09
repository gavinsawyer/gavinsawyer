/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type DocumentUpdateOrigin } from "./DocumentUpdateOrigin";


export type SendgridMessageDocumentUpdateOrigin =
  | DocumentUpdateOrigin
  | "sendgrid"
