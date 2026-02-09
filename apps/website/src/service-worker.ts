/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type ServiceWorkerMessage } from "@bowstring/interfaces";


let idToken: string | undefined;

self.addEventListener<"activate">(
  "activate",
  (event: ExtendableEvent): void => event.waitUntil(clients.claim()),
);
self.addEventListener<"fetch">(
  "fetch",
  (fetchEvent: FetchEvent): void => {
    if (self.location.origin !== `${ fetchEvent.request.url.split("/")[0] }//${ fetchEvent.request.url.split("/")[2] }` || fetchEvent.request.url.split("/")[3] === "firebase-web-authn-api")
      return fetchEvent.respondWith(fetch(fetchEvent.request));

    const headers: Headers = new Headers();

    fetchEvent.request.headers.forEach(
      (
        value: string,
        name: string,
      ): void => headers.append(
        name,
        value,
      ),
    );

    if (idToken)
      headers.append(
        "Authorization",
        `Bearer ${ idToken }`,
      );

    headers.append(
      "Time-Zone",
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );

    fetchEvent.respondWith(
      new Promise<string | undefined>(
        (resolve: (body?: string) => void): void => {
          if (fetchEvent.request.method !== "GET") {
            if (fetchEvent.request.headers.get("Content-Type")?.includes("json"))
              return void fetchEvent.request.json().then<void>((request: unknown): void => resolve(JSON.stringify(request)));

            return void fetchEvent.request.text().then<void>(resolve);
          }

          resolve();
        },
      ).then<Response>(
        (body?: string): Promise<Response> => {
          try {
            return fetch(
              new Request(
                fetchEvent.request.url,
                {
                  body,
                  cache:          fetchEvent.request.cache,
                  credentials:    fetchEvent.request.credentials,
                  headers,
                  keepalive:      fetchEvent.request.keepalive,
                  method:         fetchEvent.request.method,
                  mode:           "same-origin",
                  redirect:       fetchEvent.request.redirect,
                  referrer:       fetchEvent.request.referrer,
                  referrerPolicy: fetchEvent.request.referrerPolicy,
                  signal:         fetchEvent.request.signal,
                },
              ),
            );
          } catch {
            return fetch(fetchEvent.request);
          }
        },
      ),
    );
  },
);
self.addEventListener<"install">(
  "install",
  (event: ExtendableEvent): void => event.waitUntil(self.skipWaiting()),
);
self.addEventListener<"message">(
  "message",
  (messageEvent: MessageEvent<ServiceWorkerMessage>): void => void (idToken = messageEvent.data.data.idToken),
);
