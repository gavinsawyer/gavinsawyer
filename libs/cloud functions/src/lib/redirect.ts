// noinspection JSUnusedGlobalSymbols

/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { getApp }                                      from "firebase-admin/app";
import { getAppCheck }                                 from "firebase-admin/app-check";
import { type HttpsFunction, onRequest, type Request } from "firebase-functions/https";


export const redirect: HttpsFunction = onRequest(
  {
    ingressSettings: "ALLOW_ALL",
    invoker:         "public",
  },
  (
    request: Request,
    response: Exclude<Request["res"], undefined>,
  ): void => void getAppCheck(getApp()).verifyToken(
    `${ request.query["appCheckToken"] }`,
    { consume: true },
  ).then<void, never>(
    (): void => response.redirect(`${ request.query["url"] }`),
    (error: Error): never => {
      response.status(500).send("Something went wrong.").end();

      throw error;
    },
  ),
);
