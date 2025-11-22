/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { type ServiceWorkerMessage } from "@bowstring/interfaces";


let idToken: string | undefined;

self.addEventListener<"activate">(
  "activate",
  (event: ExtendableEvent): void => event.waitUntil(clients.claim()),
);
self.addEventListener<"fetch">(
  "fetch",
  async (fetchEvent: FetchEvent): Promise<void> => {
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
      "Timezone-Offset",
      `${ new Date().getTimezoneOffset() }`,
    );

    try {
      return fetchEvent.respondWith(
        fetch(
          new Request(
            fetchEvent.request.url,
            {
              body:           fetchEvent.request.method !== "GET" ? fetchEvent.request.headers.get("Content-Type")?.includes("json") ? JSON.stringify(await fetchEvent.request.json()) : await fetchEvent.request.text() : undefined,
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
        ),
      );
    } catch {
      return fetchEvent.respondWith(fetch(fetchEvent.request));
    }
  },
);
self.addEventListener<"install">(
  "install",
  (): Promise<void> => self.skipWaiting(),
);
self.addEventListener<"message">(
  "message",
  (messageEvent: MessageEvent<ServiceWorkerMessage>): void => {
    idToken = messageEvent.data.data.idToken;
  },
);
