// noinspection JSUnusedGlobalSymbols

/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type CallableFunction, type CallableRequest, HttpsError, onCall } from "firebase-functions/https";


export const helloWorld: CallableFunction<null, Promise<{ "helloWorld": string }>> = onCall<null, Promise<{ "helloWorld": string }>>(
  { enforceAppCheck: true },
  async ({ auth: authData }: CallableRequest<null>): Promise<{ "helloWorld": string }> => {
    if (!authData?.uid)
      throw new HttpsError(
        "unauthenticated",
        "You're not signed in.",
      );

    return { helloWorld: authData.uid };
  },
);
