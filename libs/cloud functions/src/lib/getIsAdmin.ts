/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { getApp }                                   from "firebase-admin/app";
import { getAuth, type UserRecord }                 from "firebase-admin/auth";
import { type CallableRequest, HttpsError, onCall } from "firebase-functions/https";


// noinspection JSUnusedGlobalSymbols
export const getIsAdmin: CallableFunction = onCall<null, Promise<boolean>>(
  { enforceAppCheck: true },
  ({ auth: authData }: CallableRequest<null>): Promise<boolean> => {
    if (!authData?.uid)
      throw new HttpsError(
        "unauthenticated",
        "You're not signed in.",
      );

    return getAuth(getApp()).getUser(authData.uid).then<boolean, never>(
      ({ customClaims }: UserRecord): boolean => customClaims?.["admin"] || false,
      (error: Error): never => {
        console.error(error);

        throw new HttpsError(
          "unknown",
          "Something went wrong.",
        );
      },
    );
  },
);
