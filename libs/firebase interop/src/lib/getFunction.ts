/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type Functions, HttpsCallable, httpsCallable, type HttpsCallableOptions, type HttpsCallableResult } from "@angular/fire/functions";
import type * as cloudFunctionsLib                                                                           from "@bowstring/cloud-functions";
import { type CallableFunction }                                                                             from "firebase-functions/https";


/** Returns a strictly typed function corresponding to an item in {@link cloudFunctionsLib|@bowstring/cloud-functions}.
 *
 * @example Calls {@link getIsAdmin} without repeating its request/response types:
 * ```ts
 * getFunction(this.functions, "getIsAdmin")() // Promise<boolean>
 * ``` */
function getFunction<key extends keyof typeof cloudFunctionsLib>(
  functions: Functions,
  name: key,
  httpsCallableOptions?: HttpsCallableOptions,
): typeof cloudFunctionsLib[key] extends CallableFunction<infer T, unknown> ? T extends null ? () => Promise<typeof cloudFunctionsLib[key] extends CallableFunction<unknown, Promise<infer R>> ? R : never> : (arg: typeof cloudFunctionsLib[key] extends CallableFunction<infer T, unknown> ? T : never) => Promise<typeof cloudFunctionsLib[key] extends CallableFunction<unknown, Promise<infer R>> ? R : never> : never {
  return ((arg?: typeof cloudFunctionsLib[key] extends CallableFunction<infer T, unknown> ? T : never): Promise<typeof cloudFunctionsLib[key] extends CallableFunction<unknown, Promise<infer R>> ? R : never> => ((httpsCallable: HttpsCallable<typeof cloudFunctionsLib[key] extends CallableFunction<infer T, unknown> ? T : never, typeof cloudFunctionsLib[key] extends CallableFunction<unknown, Promise<infer R>> ? R : never>): Promise<typeof cloudFunctionsLib[key] extends CallableFunction<unknown, Promise<infer R>> ? R : never> => httpsCallable(arg).then<typeof cloudFunctionsLib[key] extends CallableFunction<unknown, Promise<infer R>> ? R : never>(({ data }: HttpsCallableResult<typeof cloudFunctionsLib[key] extends CallableFunction<unknown, Promise<infer R>> ? R : never>): typeof cloudFunctionsLib[key] extends CallableFunction<unknown, Promise<infer R>> ? R : never => data))(
    httpsCallable<typeof cloudFunctionsLib[key] extends CallableFunction<infer T, unknown> ? T : never, typeof cloudFunctionsLib[key] extends CallableFunction<unknown, Promise<infer R>> ? R : never>(
      functions,
      String(name),
      httpsCallableOptions,
    ),
  )) as typeof cloudFunctionsLib[key] extends CallableFunction<infer T, unknown> ? T extends null ? () => Promise<typeof cloudFunctionsLib[key] extends CallableFunction<unknown, Promise<infer R>> ? R : never> : (arg: typeof cloudFunctionsLib[key] extends CallableFunction<infer T, unknown> ? T : never) => Promise<typeof cloudFunctionsLib[key] extends CallableFunction<unknown, Promise<infer R>> ? R : never> : never;
}

export default getFunction;
