/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type LocaleId }                                                                                                 from "@bowstring/i18n";
import compression                                                                                                       from "compression";
import cookieParser                                                                                                      from "cookie-parser";
import express                                                                                                           from "express";
import { type App as AdminFirebaseApp, cert as adminCert, getApps as adminGetApps, initializeApp as adminInitializeApp } from "firebase-admin/app";
import { type Auth as AdminAuth, type DecodedIdToken as AdminDecodedIdToken, getAuth as adminGetAuth }                   from "firebase-admin/auth";
import { environment }                                                                                                   from "../environment";
import { getI18nRequestHandler }                                                                                         from "./request handlers";


const adminFirebaseApp: AdminFirebaseApp = adminGetApps()[0] || adminInitializeApp(process.env["FIREBASE_SERVICE_ACCOUNT_PATH"] ? { credential: adminCert(process.env["FIREBASE_SERVICE_ACCOUNT_PATH"]) } : undefined);
const adminAuth: AdminAuth               = adminGetAuth(adminFirebaseApp);

void express().use(compression()).use(cookieParser()).use(
  (
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction,
  ): void => {
    response.setHeader(
      "X-Powered-By",
      "Bowstring",
    );

    const idToken: string | undefined = request.headersDistinct["authorization"]?.[0]?.split("Bearer ")?.[1];

    if (idToken && idToken !== request.cookies["__session"])
      adminAuth.verifyIdToken(idToken).then<void, void>(
        ({ exp: expirySeconds }: AdminDecodedIdToken): void => void response.cookie(
          "__session",
          idToken,
          {
            expires:  new Date(expirySeconds * 1000),
            httpOnly: true,
            sameSite: "strict",
            secure:   true,
          },
        ),
        (): void => void response.clearCookie("__session"),
      ).finally(nextFunction);
    else
      nextFunction();
  },
).set(
  "view engine",
  "html",
).set(
  "views",
  `${ process.cwd() }/dist/apps/${ environment.app }/browser`,
).get(
  "/main.service-worker.js",
  express.static(`${ process.cwd() }/dist/apps/${ environment.app }/browser`),
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
  getI18nRequestHandler(({ localeId }: { localeId: LocaleId }): express.RequestHandler => require(`${ __dirname }/${ String(localeId) }/main.js`)["getRequestHandler"](localeId)),
).listen(
  process.env["PORT"] || 4000,
  (): void => console.log(`Node Express server listening on http://localhost:${ process.env["PORT"] || 4000 }`),
);
