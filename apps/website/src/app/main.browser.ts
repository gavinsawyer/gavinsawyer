/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { platformBrowserDynamic }      from "@angular/platform-browser-dynamic";
import { SERVICE_WORKER_REGISTRATION } from "@bowstring/injection-tokens";
import { ProjectBrowserModule }        from "./modules";


new Promise<ServiceWorkerRegistration | undefined>(
  (resolve: (serviceWorkerRegistration?: ServiceWorkerRegistration) => void): void => {
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register(
        "/service-worker.js",
        { updateViaCache: "none" },
      ).then<void, never>(
        resolve,
        (error: Error): never => {
          console.error("Service worker registration failed.");

          resolve();

          throw error;
        },
      );
    else
      resolve();
  },
).then<void>(
  (serviceWorkerRegistration?: ServiceWorkerRegistration): Promise<void> => new Promise<void>(
    (resolve: () => void): void => {
      if (document.readyState === "complete" || document.readyState === "interactive")
        resolve();
      else
        document.addEventListener<"readystatechange">(
          "readystatechange",
          resolve,
          { once: true },
        );
    },
  ).then<void>(
    (): Promise<void> => platformBrowserDynamic(
      serviceWorkerRegistration ? [
        {
          provide:  SERVICE_WORKER_REGISTRATION,
          useValue: serviceWorkerRegistration,
        },
      ] : undefined,
    ).bootstrapModule<ProjectBrowserModule>(ProjectBrowserModule).then<void, never>(
      (): void => void (0),
      (error: Error): never => {
        console.error("Something went wrong.");

        throw error;
      },
    ),
  ),
);
