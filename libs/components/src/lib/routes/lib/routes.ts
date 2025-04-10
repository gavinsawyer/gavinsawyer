/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

/// <reference types="@angular/localize" />

import { inject, type Type }                        from "@angular/core";
import { type ActivatedRouteSnapshot, type Routes } from "@angular/router";
import type * as brandLib                           from "@bowstring/brand";
import { BRAND }                                    from "@bowstring/injection-tokens";


const routes: Routes = [
  {
    data:          {
      description: $localize`:@@libs--Components--Routes--Privacy--Meta--Description:...`,
      title:       $localize`:@@libs--Components--Routes--Privacy--Meta--Title:Privacy`,
    },
    loadComponent: (): Promise<Type<unknown>> => import("./privacy/PrivacyRouteComponent").then<Type<unknown>>(
      ({ PrivacyRouteComponent }: typeof import("./privacy/PrivacyRouteComponent")): Type<unknown> => PrivacyRouteComponent,
    ),
    path:          "privacy",
    title:         ({ data: { title: routeTitle } }: ActivatedRouteSnapshot): string => `${ routeTitle } - ${ inject<typeof brandLib>(BRAND).title }`,
  },
  {
    data:          {
      description: $localize`:@@libs--Components--Routes--Terms--Meta--Description:...`,
      title:       $localize`:@@libs--Components--Routes--Terms--Meta--Title:Terms`,
    },
    loadComponent: (): Promise<Type<unknown>> => import("./terms/TermsRouteComponent").then<Type<unknown>>(
      ({ TermsRouteComponent }: typeof import("./terms/TermsRouteComponent")): Type<unknown> => TermsRouteComponent,
    ),
    path:          "terms",
    title:         ({ data: { title: routeTitle } }: ActivatedRouteSnapshot): string => `${ routeTitle } - ${ inject<typeof brandLib>(BRAND).title }`,
  },
  {
    data:          {
      description: $localize`:@@libs--Components--Routes--Otherwise--Meta--Description:...`,
      title:       $localize`:@@libs--Components--Routes--Otherwise--Meta--Title:Page not found`,
    },
    loadComponent: (): Promise<Type<unknown>> => import("./otherwise/OtherwiseRouteComponent").then<Type<unknown>>(
      ({ OtherwiseRouteComponent }: typeof import("./otherwise/OtherwiseRouteComponent")): Type<unknown> => OtherwiseRouteComponent,
    ),
    path:          "**",
    title:         ({ data: { title: routeTitle } }: ActivatedRouteSnapshot): string => `${ routeTitle } - ${ inject<typeof brandLib>(BRAND).title }`,
  },
];

export default routes;
