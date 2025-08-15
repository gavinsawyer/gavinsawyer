/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

export interface ServiceWorkerMessage {
  "data": {
    "idToken": string;
  };
  "eventType": "idTokenChanged";
}
