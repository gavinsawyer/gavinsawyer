/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { type ControlValueAccessor } from "@angular/forms";


export interface SegmentedControlValueAccessor
  extends ControlValueAccessor {
  "value": string;

  getOptionIndex(value?: string): number;
  onChange?(): void;
  onTouched?(): void;
}
