/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { type ValueProvider } from "@angular/core";
import { PROJECT_ROUTES }     from "@bowstring/injection-tokens";
import { projectRoutes }      from "../";


const projectRoutesProvider: ValueProvider = {
  provide:  PROJECT_ROUTES,
  useValue: projectRoutes,
};

export default projectRoutesProvider;
