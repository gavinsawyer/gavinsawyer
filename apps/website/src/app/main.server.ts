/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { APP_BASE_HREF }                                                                                                 from "@angular/common";
import { LOCALE_ID }                                                                                                     from "@angular/core";
import { CommonEngine }                                                                                                  from "@angular/ssr";
import { ADMIN_APP_CHECK, ADMIN_AUTH, ADMIN_FIREBASE_APP, REQUEST, RESPONSE }                                            from "@bowstring/injection-tokens";
import compression                                                                                                       from "compression";
import cookieParser                                                                                                      from "cookie-parser";
import express                                                                                                           from "express";
import { type App as AdminFirebaseApp, cert as adminCert, getApps as adminGetApps, initializeApp as adminInitializeApp } from "firebase-admin/app";
import { type AppCheck as AdminAppCheck, getAppCheck as adminGetAppCheck }                                               from "firebase-admin/app-check";
import { type Auth as AdminAuth, type DecodedIdToken as AdminDecodedIdToken, getAuth as adminGetAuth }                   from "firebase-admin/auth";
import { environment }                                                                                                   from "../environment";
import { ProjectServerModule }                                                                                           from "./modules";
import { getI18nRequestHandler }                                                                                         from "./request handlers";
import { type ProjectLocaleId }                                                                                          from "./types";
import "zone.js/node";


const adminFirebaseApp: AdminFirebaseApp = adminGetApps()[0] || adminInitializeApp(process.env["FIREBASE_SERVICE_ACCOUNT_PATH"] ? { credential: adminCert(process.env["FIREBASE_SERVICE_ACCOUNT_PATH"]) } : undefined);
const adminAppCheck: AdminAppCheck       = adminGetAppCheck(adminFirebaseApp);
const adminAuth: AdminAuth               = adminGetAuth(adminFirebaseApp);

function getRequestHandler(projectLocaleId: ProjectLocaleId): express.RequestHandler {
  return (
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction,
  ): Promise<void> => new CommonEngine(
    {
      bootstrap: ProjectServerModule,
      providers: [
        {
          provide:  APP_BASE_HREF,
          useValue: `/${ String(projectLocaleId) }`,
        },
        {
          provide:  ADMIN_APP_CHECK,
          useValue: adminAppCheck,
        },
        {
          provide:  ADMIN_AUTH,
          useValue: adminAuth,
        },
        {
          provide:  ADMIN_FIREBASE_APP,
          useValue: adminFirebaseApp,
        },
        {
          provide:  LOCALE_ID,
          useValue: String(projectLocaleId),
        },
        {
          provide:  REQUEST,
          useValue: request,
        },
        {
          provide:  RESPONSE,
          useValue: response,
        },
      ],
    },
  ).render(
    {
      documentFilePath: `${ process.cwd() }/dist/apps/${ environment.app }/browser/${ String(projectLocaleId) }/index.original.html`,
      url:              `${ request.protocol }://${ request.headers.host }${ request.originalUrl }`,
    },
  ).then<void, never>(
    (html: string): void => {
      response.send(html);
      nextFunction();
    },
    (error: Error): never => {
      nextFunction(error);

      throw error;
    },
  );
}

// noinspection JSUnusedGlobalSymbols
export {
  getRequestHandler,
  ProjectServerModule as AppServerModule,
};

declare const __non_webpack_require__: NodeJS.Require;

if (((moduleFilename: string): boolean => moduleFilename === __filename || moduleFilename.includes("iisnode"))(((mainModule?: NodeJS.Module): string => mainModule?.filename || "")(__non_webpack_require__.main)))
  express().use(compression()).use(cookieParser()).use(
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
    "/service-worker.js",
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
    getI18nRequestHandler(({ projectLocaleId }: { projectLocaleId: ProjectLocaleId }): express.RequestHandler => getRequestHandler(projectLocaleId)),
  ).listen(
    process.env["PORT"] || 4000,
    (): void => console.log(`Node Express server listening on http://localhost:${ process.env["PORT"] || 4000 }`),
  );
