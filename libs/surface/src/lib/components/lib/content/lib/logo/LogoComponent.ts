/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                                                    from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, type InputSignal } from "@angular/core";
import { type Logo }                                                           from "@bowstring/core";
import { ContainerDirective, FlexboxContainerDirective, InlinableDirective }   from "../../../../../directives";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[style.--bowstring--logo--baseline-y]":     "input$().baselineY",
      "[style.--bowstring--logo--viewbox-height]": "input$().viewBoxHeight",
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

  public readonly input$: InputSignal<Logo> = input.required<Logo>({ alias: "input" });

}
