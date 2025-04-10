/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

export interface Environment {
  "app": "website";
  "apis": {
    "firebase": {
      "apiKey": string;
      "appId": string;
      "authDomain": string;
      "databaseURL"?: string;
      "measurementId"?: string;
      "messagingSenderId": string;
      "projectId": string;
      "storageBucket": string;
    };
    "recaptcha": {
      "siteKey": string;
    };
  };
  "domain": string;
  "production": boolean;
}
