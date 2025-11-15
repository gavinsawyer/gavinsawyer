/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import compression = require("compression");
import cookieParser = require("cookie-parser");
import express = require("express");
import { cert as adminCert, getApps as adminGetApps, initializeApp as adminInitializeApp } from "firebase-admin/app";
import { type DecodedIdToken as AdminDecodedIdToken, getAuth as adminGetAuth }             from "firebase-admin/auth";
import { getI18nRequestHandler }                                                           from "./request handlers";
import { type ProjectLocaleId }                                                            from "./types";


express().use(compression()).use(cookieParser()).use(
  (
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction,
  ): void => {
    if (request.headersDistinct["authorization"]?.[0] && request.headersDistinct["authorization"]?.[0].split("Bearer ")[1] !== request.cookies["__session"]) {
      const idToken: string = request.headersDistinct["authorization"]?.[0].split("Bearer ")[1];

      adminGetAuth(adminGetApps()[0] || adminInitializeApp(process.env["FIREBASE_SERVICE_ACCOUNT_PATH"] ? { credential: adminCert(process.env["FIREBASE_SERVICE_ACCOUNT_PATH"]) } : undefined)).verifyIdToken(idToken).then<void, void>(
        ({ exp: expirySeconds }: AdminDecodedIdToken): void => {
          response.cookie(
            "__session",
            idToken,
            {
              expires:  new Date(expirySeconds * 1000),
              httpOnly: true,
              sameSite: "strict",
              secure:   true,
            },
          );
        },
        (): void => {
          response.clearCookie("__session");
        },
      ).finally(nextFunction);
    } else
      nextFunction();
  },
).set(
  "view engine",
  "html",
).set(
  "views",
  `${ process.cwd() }/dist/apps/website/browser`,
).get(
  "/service-worker.js",
  express.static(`${ process.cwd() }/dist/apps/website/browser`),
).get(
  "*.*",
  getI18nRequestHandler(
    ({ staticRoot }: { staticRoot: string }): express.RequestHandler => express.static(
      staticRoot,
      { maxAge: "1y" },
    ),
  ),
).get(
  "*",
  getI18nRequestHandler(({ projectLocaleId }: { projectLocaleId: ProjectLocaleId }): express.RequestHandler => require(`${ process.cwd() }/dist/apps/website/server/${ String(projectLocaleId) }/main.js`)["getRequestHandler"](projectLocaleId)),
).listen(
  process.env["PORT"] || 4000,
  (): void => console.log(`Node Express server listening on http://localhost:${ process.env["PORT"] || 4000 }`),
);
