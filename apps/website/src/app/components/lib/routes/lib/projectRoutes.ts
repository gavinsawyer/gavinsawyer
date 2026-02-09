/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { inject, type Type }                   from "@angular/core";
import { ActivatedRouteSnapshot, type Routes } from "@angular/router";
import * as configLib                          from "@bowstring/config";
import { CONFIG }                              from "@bowstring/injection-tokens";


const projectRoutes: Routes = [
  {
    data:          {
      description: configLib.brand.description,
      title:       configLib.brand.title,
    },
    loadComponent: (): Promise<Type<unknown>> => import("./home/HomeRouteComponent").then<Type<unknown>>(({ HomeRouteComponent }: typeof import("./home/HomeRouteComponent")): Type<unknown> => HomeRouteComponent),
    path:          "",
    pathMatch:     "full",
    title:         configLib.brand.title,
  },
  {
    data:          {
      description: $localize`:@@apps--Website--Components--Routes--Privacy--Meta--Description:...`,
      title:       $localize`:@@apps--Website--Components--Routes--Privacy--Meta--Title:Privacy`,
    },
    loadComponent: (): Promise<Type<unknown>> => import("./privacy/PrivacyRouteComponent").then<Type<unknown>>(({ PrivacyRouteComponent }: typeof import("./privacy/PrivacyRouteComponent")): Type<unknown> => PrivacyRouteComponent),
    path:          "privacy",
    title:         ({ data: { title: routeTitle } }: ActivatedRouteSnapshot): string => `${ routeTitle } - ${ inject<typeof configLib>(CONFIG).brand.title }`,
  },
  {
    data:          {
      description: $localize`:@@apps--Website--Components--Routes--Terms--Meta--Description:...`,
      title:       $localize`:@@apps--Website--Components--Routes--Terms--Meta--Title:Terms`,
    },
    loadComponent: (): Promise<Type<unknown>> => import("./terms/TermsRouteComponent").then<Type<unknown>>(({ TermsRouteComponent }: typeof import("./terms/TermsRouteComponent")): Type<unknown> => TermsRouteComponent),
    path:          "terms",
    title:         ({ data: { title: routeTitle } }: ActivatedRouteSnapshot): string => `${ routeTitle } - ${ inject<typeof configLib>(CONFIG).brand.title }`,
  },
  {
    data:          {
      description: $localize`:@@apps--Website--Components--Routes--Otherwise--Meta--Description:...`,
      title:       $localize`:@@apps--Website--Components--Routes--Otherwise--Meta--Title:Page not found`,
    },
    loadComponent: (): Promise<Type<unknown>> => import("./otherwise/OtherwiseRouteComponent").then<Type<unknown>>(({ OtherwiseRouteComponent }: typeof import("./otherwise/OtherwiseRouteComponent")): Type<unknown> => OtherwiseRouteComponent),
    path:          "**",
    title:         ({ data: { title: routeTitle } }: ActivatedRouteSnapshot): string => `${ routeTitle } - ${ inject<typeof configLib>(CONFIG).brand.title }`,
  },
];

export default projectRoutes;
