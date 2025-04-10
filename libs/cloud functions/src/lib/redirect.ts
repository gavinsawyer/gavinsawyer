/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { getApp }                                      from "firebase-admin/app";
import { getAppCheck }                                 from "firebase-admin/app-check";
import { type HttpsFunction, onRequest, type Request } from "firebase-functions/https";


// noinspection JSUnusedGlobalSymbols
export const redirect: HttpsFunction = onRequest(
  {
    ingressSettings: "ALLOW_ALL",
    invoker:         "public",
  },
  async (
    request: Request,
    response: Exclude<Request["res"], undefined>,
  ): Promise<void> => getAppCheck(getApp()).verifyToken(
    `${ request.query["appCheckToken"] }`,
    { consume: true },
  ).then<void, never>(
    (): void => response.redirect(`${ request.query["url"] }`),
    (error: unknown): never => {
      response.status(500).send(error).end();

      throw new Error("Something went wrong.");
    },
  ),
);
