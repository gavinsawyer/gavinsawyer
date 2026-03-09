/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type LocaleId, localeIds } from "@bowstring/i18n";
import type express                 from "express";
import project                      from "../../project.json";


export function getI18nRequestHandler(getRequestHandler: (
  {
    localeId,
    staticRoot,
  }: { "localeId": LocaleId, "staticRoot": string },
) => express.RequestHandler): express.RequestHandler {
  return (
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction,
  ): void => {
    const localeId: LocaleId = localeIds.filter((localeId: LocaleId): boolean => String(localeId) === request.path.split("/")[1] || String(localeId) === request.headers.referer?.split("://")?.[1]?.split("/")[1])[0] || request.acceptsLanguages(localeIds.map<string>((localeId: LocaleId): string => String(localeId))) || "en-US";

    getRequestHandler(
      {
        localeId,
        staticRoot: `${ process.cwd() }/dist/apps/${ project.name }/browser/${ request.path.split("/")[1] !== String(localeId) ? String(localeId) : "" }`,
      },
    )(
      request,
      response,
      nextFunction,
    );
  };
}
