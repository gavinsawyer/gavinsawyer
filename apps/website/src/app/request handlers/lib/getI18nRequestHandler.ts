/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import type express             from "express";
import project                  from "../../../../project.json";
import { type ProjectLocaleId } from "../../types";


function getI18nRequestHandler(getRequestHandler: (
  {
    projectLocaleId,
    staticRoot,
  }: { "projectLocaleId": ProjectLocaleId, "staticRoot": string },
) => express.RequestHandler): express.RequestHandler {
  return (
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction,
  ): void => {
    const projectLocaleIds: Array<ProjectLocaleId> = [
      "en-US",
      ...Object.keys(project.i18n.locales) as Array<Exclude<ProjectLocaleId, "en-US">>,
    ];
    const projectLocaleId: ProjectLocaleId         = projectLocaleIds.filter((projectLocaleId: ProjectLocaleId): boolean => String(projectLocaleId) === request.path.split("/")[1] || String(projectLocaleId) === request.headers.referer?.split("://")?.[1]?.split("/")[1])[0] || request.acceptsLanguages(projectLocaleIds.map<string>((projectLocaleId: ProjectLocaleId): string => String(projectLocaleId))) || "en-US";

    getRequestHandler(
      {
        projectLocaleId,
        staticRoot: `${ process.cwd() }/dist/apps/${ project.name }/browser/${ request.path.split("/")[1] !== String(projectLocaleId) ? String(projectLocaleId) : "" }`,
      },
    )(
      request,
      response,
      nextFunction,
    );
  };
}

export default getI18nRequestHandler;
