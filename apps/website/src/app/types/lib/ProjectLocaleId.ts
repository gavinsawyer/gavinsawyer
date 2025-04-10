/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import type project from "../../../../project.json";


export type ProjectLocaleId =
  | "en-US"
  | keyof typeof project.i18n.locales;
