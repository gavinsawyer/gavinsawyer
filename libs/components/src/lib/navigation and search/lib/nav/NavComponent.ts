/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                              from "@angular/common";
import { ChangeDetectionStrategy, Component, inject }    from "@angular/core";
import { ContainerDirective, FlexboxContainerDirective } from "@bowstring/directives";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    ],
    imports:         [ NgTemplateOutlet ],
    selector:        "bowstring--nav",
    styleUrl:        "NavComponent.sass",
    templateUrl:     "NavComponent.html",

    standalone: true,
  },
)
export class NavComponent {

  protected readonly containerDirective: ContainerDirective = inject<ContainerDirective>(ContainerDirective);

}
