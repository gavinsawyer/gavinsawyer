/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                           from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ContainerDirective, InlinableDirective }     from "../../../../../directives";
import { EllipsesCountService }                       from "../../../../../services";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[class.show-1]": "ellipsesCountService.ellipsesCount$() >= 1",
      "[class.show-2]": "ellipsesCountService.ellipsesCount$() >= 2",
      "[class.show-3]": "ellipsesCountService.ellipsesCount$() >= 3",
    },
    hostDirectives:  [
      {
        directive: ContainerDirective,
        inputs:    [
          "alignSelf",
          "aspectRatio",
          "hideScrollbar",
          "marginBottom",
          "marginSides",
          "marginTop",
          "overflowX",
          "overflowY",
          "paddingBottom",
          "paddingSides",
          "paddingTop",
          "position",
          "positionBottom",
          "positionLeft",
          "positionRight",
          "positionTop",
          "scrollSnapAlign",
          "scrollSnapStop",
          "scrollSnapType",
        ],
      },
      {
        directive: InlinableDirective,
        inputs:    [ "inline" ],
      },
    ],
    selector:        "bowstring--ellipses",
    styleUrl:        "EllipsesComponent.sass",
    templateUrl:     "EllipsesComponent.html",
    imports:         [ NgTemplateOutlet ],

    standalone: true,
  },
)
export class EllipsesComponent {

  protected readonly containerDirective: ContainerDirective     = inject<ContainerDirective>(ContainerDirective);
  protected readonly ellipsesCountService: EllipsesCountService = inject<EllipsesCountService>(EllipsesCountService);

}
