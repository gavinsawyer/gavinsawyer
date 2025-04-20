/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { booleanAttribute, ChangeDetectionStrategy, Component, input, type InputSignal, type InputSignalWithTransform } from "@angular/core";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector:        "bowstring--combobox-input-option",
    template:        "",

    standalone: true,
  },
)
export class ComboboxInputOptionComponent {

  public readonly disabledInput$: InputSignalWithTransform<boolean | undefined, "" | boolean | `${ boolean }` | undefined> = input<boolean | undefined, "" | boolean | `${ boolean }` | undefined>(
    undefined,
    {
      alias:     "disabled",
      transform: booleanAttribute,
    },
  );
  public readonly labelInput$: InputSignal<string | undefined>                                                             = input<string | undefined>(
    undefined,
    { alias: "label" },
  );
  public readonly valueInput$: InputSignal<string>                                                                         = input.required<string>({ alias: "value" });

}
