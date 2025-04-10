/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { ProjectBrowserModule }   from "./modules";


function bootstrap(): Promise<void> {
  return platformBrowserDynamic().bootstrapModule<ProjectBrowserModule>(ProjectBrowserModule).then<void, never>(
    (): void => void (0),
    (error: unknown): never => {
      console.error(error);

      throw error;
    },
  );
}

if (document.readyState === "complete")
  bootstrap().catch<never>(
    (error: unknown): never => {
      console.error("Something went wrong.");

      throw error;
    },
  );
else
  document.addEventListener<"DOMContentLoaded">(
    "DOMContentLoaded",
    bootstrap,
    { once: true },
  );
