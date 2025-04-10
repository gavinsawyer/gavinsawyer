/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { type Auto } from "./Auto";


export type Overflow =
  | Auto
  | "clip"
  | "hidden"
  | "scroll"
  | "visible";
