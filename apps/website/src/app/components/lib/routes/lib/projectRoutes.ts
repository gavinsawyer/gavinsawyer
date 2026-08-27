/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { inject, type Type, type ValueProvider }                        from "@angular/core";
import { type ActivatedRouteSnapshot, type DefaultExport, type Routes } from "@angular/router";
import configLib, { CONFIG_LIB, type ConfigLib }                        from "@bowstring/config";
import { PROJECT_ROUTES }                                               from "@bowstring/core";


const projectRoutes: Routes = [
  {
    data:          {
      description: configLib.brand.description,
      title:       configLib.brand.title,
    },
    loadComponent: (): Promise<DefaultExport<Type<unknown>>> => import("./home/HomeRouteComponent"),
    path:          "",
    pathMatch:     "full",
    title:         configLib.brand.title,
  },
  {
    data:          {
      description: $localize`:@@apps--Website--Components--Routes--Privacy--Meta--Description:...`,
      title:       $localize`:@@apps--Website--Components--Routes--Privacy--Meta--Title:Privacy`,
    },
    loadComponent: (): Promise<DefaultExport<Type<unknown>>> => import("./privacy/PrivacyRouteComponent"),
    path:          "privacy",
    title:         ({ data: { title: routeTitle } }: ActivatedRouteSnapshot): string => `${ routeTitle } ${ inject<ConfigLib>(CONFIG_LIB).titleSeparator } ${ inject<ConfigLib>(CONFIG_LIB).brand.title }`,
  },
  {
    data:          {
      description: $localize`:@@apps--Website--Components--Routes--Terms--Meta--Description:...`,
      title:       $localize`:@@apps--Website--Components--Routes--Terms--Meta--Title:Terms`,
    },
    loadComponent: (): Promise<DefaultExport<Type<unknown>>> => import("./terms/TermsRouteComponent"),
    path:          "terms",
    title:         ({ data: { title: routeTitle } }: ActivatedRouteSnapshot): string => `${ routeTitle } ${ inject<ConfigLib>(CONFIG_LIB).titleSeparator } ${ inject<ConfigLib>(CONFIG_LIB).brand.title }`,
  },
  {
    data:          {
      description: $localize`:@@apps--Website--Components--Routes--Otherwise--Meta--Description:...`,
      title:       $localize`:@@apps--Website--Components--Routes--Otherwise--Meta--Title:Page not found`,
    },
    loadComponent: (): Promise<DefaultExport<Type<unknown>>> => import("./otherwise/OtherwiseRouteComponent"),
    path:          "**",
    title:         ({ data: { title: routeTitle } }: ActivatedRouteSnapshot): string => `${ routeTitle } ${ inject<ConfigLib>(CONFIG_LIB).titleSeparator } ${ inject<ConfigLib>(CONFIG_LIB).brand.title }`,
  },
];

export const projectRoutesProvider: ValueProvider = {
  provide:  PROJECT_ROUTES,
  useValue: projectRoutes,
};

export default projectRoutes;
