/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

/// <reference types="@angular/localize" />

import { type Type }          from "@angular/core";
import { type Routes }        from "@angular/router";
import { description, title } from "@bowstring/brand";


const routes: Routes = [
  {
    data:          {
      description,
      title,
    },
    loadComponent: (): Promise<Type<unknown>> => import("./home/HomeRouteComponent").then<Type<unknown>>(
      ({ HomeRouteComponent }: typeof import("./home/HomeRouteComponent")): Type<unknown> => HomeRouteComponent,
    ),
    path:          "",
    pathMatch:     "full",
    title,
  },
];

export default routes;
