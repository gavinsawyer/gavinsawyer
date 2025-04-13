/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                                                                                                                                                            from "@angular/common";
import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input, type InputSignal, type InputSignalWithTransform, output, type OutputEmitterRef, type Signal, viewChild } from "@angular/core";
import { RouterLink, RouterLinkActive }                                                                                                                                                from "@angular/router";
import { CanvasDirective, ContainerDirective, FlexboxContainerDirective, InlinableDirective, PrimaryDirective, SecondaryDirective, WarningDirective }                                  from "@bowstring/directives";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[class.disabled]":           "disabledInput$() || routerLinkActive$()?.isActive || false",
      "[class.material-primary]":   "materialInput$() === 'primary'",
      "[class.material-secondary]": "materialInput$() === 'secondary'",
      "[class.material-warning]":   "materialInput$() === 'warning'",
    },
    hostDirectives:  [
      { directive: CanvasDirective },
      {
        directive: FlexboxContainerDirective,
        inputs:    [
          "alignContent",
          "alignItems",
          "flexDirection",
          "flexWrap",
          "gapColumn",
          "gapRow",
          "justifyContent",
        ],
      },
      {
        directive: InlinableDirective,
        inputs:    [ "inline" ],
      },
      { directive: PrimaryDirective },
      { directive: SecondaryDirective },
      { directive: WarningDirective },
    ],
    imports:         [
      NgTemplateOutlet,
      RouterLink,
      RouterLinkActive,
    ],
    selector:        "bowstring--link",
    styleUrl:        "LinkComponent.sass",
    templateUrl:     "LinkComponent.html",

    standalone: true,
  },
)
export class LinkComponent {

  protected readonly containerDirective: ContainerDirective                  = inject<ContainerDirective>(ContainerDirective);
  protected readonly routerLinkActive$: Signal<RouterLinkActive | undefined> = viewChild<RouterLinkActive>(RouterLinkActive);

  public readonly disabledInput$: InputSignalWithTransform<boolean | undefined, "" | boolean | `${ boolean }` | undefined> = input<boolean | undefined, "" | boolean | `${ boolean }` | undefined>(
    undefined,
    {
      alias:     "disabled",
      transform: booleanAttribute,
    },
  );
  public readonly exactInput$: InputSignalWithTransform<boolean | undefined, "" | boolean | `${ boolean }` | undefined>    = input<boolean | undefined, "" | boolean | `${ boolean }` | undefined>(
    undefined,
    {
      alias:     "exact",
      transform: booleanAttribute,
    },
  );
  public readonly materialInput$: InputSignal<"primary" | "secondary" | "warning" | undefined>                             = input<"primary" | "secondary" | "warning" | undefined>(
    undefined,
    { alias: "material" },
  );
  public readonly output: OutputEmitterRef<void>                                                                           = output<void>(
    { alias: "output" },
  );
  public readonly typeInput$: InputSignal<"reset" | "submit" | undefined>                                                  = input<"reset" | "submit" | undefined>(
    undefined,
    { alias: "type" },
  );
  public readonly urlInput$: InputSignal<string | undefined>                                                               = input<string | undefined>(
    undefined,
    { alias: "url" },
  );

}
