/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                                                  from "@angular/common";
import { ChangeDetectionStrategy, Component, inject }                        from "@angular/core";
import type * as brandLib                                                    from "@bowstring/brand";
import { ContainerDirective, FlexboxContainerDirective, InlinableDirective } from "@bowstring/directives";
import { BRAND }                                                             from "@bowstring/injection-tokens";


// noinspection CssUnknownProperty
@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[style.--bowstring--logo--brand--logo--baseline-y]":     "brandLib.logo.baselineY",
      "[style.--bowstring--logo--brand--logo--viewbox-height]": "brandLib.logo.viewBoxHeight",
    },
    hostDirectives:  [
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
    ],
    imports:         [ NgTemplateOutlet ],
    selector:        "bowstring--logo",
    styleUrl:        "LogoComponent.sass",
    templateUrl:     "LogoComponent.html",

    standalone: true,
  },
)
export class LogoComponent {

  protected readonly containerDirective: ContainerDirective = inject<ContainerDirective>(ContainerDirective);
  protected readonly brandLib: typeof brandLib              = inject<typeof brandLib>(BRAND);

}
