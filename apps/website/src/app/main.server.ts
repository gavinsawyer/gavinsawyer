/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { APP_BASE_HREF }         from "@angular/common";
import { LOCALE_ID }             from "@angular/core";
import { CommonEngine }          from "@angular/ssr";
import compression               from "compression";
import express                   from "express";
import { existsSync }            from "fs";
import { environment }           from "../environment";
import { ProjectServerModule }   from "./modules";
import { getI18nRequestHandler } from "./request handlers";
import { type ProjectLocaleId }  from "./types";
import "zone.js/node";


function getRequestHandler(projectLocaleId: ProjectLocaleId): express.RequestHandler {
  return (
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction,
  ): Promise<void> => new CommonEngine(
    {
      bootstrap:                 ProjectServerModule,
      enablePerformanceProfiler: !environment.production,
      providers:                 [
        {
          provide:  APP_BASE_HREF,
          useValue: `/${ String(projectLocaleId) }`,
        },
        {
          provide:  LOCALE_ID,
          useValue: String(projectLocaleId),
        },
      ],
    },
  ).render(
    {
      documentFilePath: `${ process.cwd() }/dist/apps/website/browser/${ String(projectLocaleId) }/${ existsSync(`${ process.cwd() }/dist/apps/website/browser/${ String(projectLocaleId) }/index.original.html`) ? "index.original.html" : "index.html" }`,
      publicPath:       `${ process.cwd() }/dist/apps/website/browser/${ String(projectLocaleId) }`,
      url:              `${ request.protocol }://${ request.headers.host }${ request.originalUrl }`,
    },
  ).then<void, never>(
    (html: string): void => response.send(html) && void (0),
    (error: unknown): never => {
      nextFunction(error);

      throw error;
    },
  );
}


export {
  getRequestHandler,
  ProjectServerModule as AppServerModule,
};


declare const __non_webpack_require__: NodeJS.Require;

if (((moduleFilename: string): boolean => moduleFilename === __filename || moduleFilename.includes("iisnode"))(((mainModule?: NodeJS.Module): string => mainModule?.filename || "")(__non_webpack_require__.main)))
  express().use(compression()).set(
    "view engine",
    "html",
  ).set(
    "views",
    `${ process.cwd() }/dist/apps/website/browser`,
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
    getI18nRequestHandler(
      ({ projectLocaleId }: { projectLocaleId: ProjectLocaleId }): express.RequestHandler => getRequestHandler(projectLocaleId),
    ),
  ).listen(
    process.env["PORT"] || 4000,
    (): void => console.log(`Node Express server listening on http://localhost:${ process.env["PORT"] || 4000 }`),
  );
