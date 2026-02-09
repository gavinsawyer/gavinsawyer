/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { ChangeDetectionStrategy, Component, inject }                                                                                              from "@angular/core";
import { ArticleComponent, CapsuleComponent, FlexboxContainerComponent, HeaderComponent, HeadingGroupComponent, LabelComponent, SectionComponent } from "@bowstring/components";
import type * as configLib                                                                                                                         from "@bowstring/config";
import { DateFormat }                                                                                                                              from "@bowstring/enums";
import { CONFIG, ENVIRONMENT }                                                                                                                     from "@bowstring/injection-tokens";
import { type Environment }                                                                                                                        from "@bowstring/interfaces";
import { DatePipe }                                                                                                                                from "@bowstring/pipes";
import { RouteComponent }                                                                                                                          from "../../../../";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports:         [
      ArticleComponent,
      CapsuleComponent,
      DatePipe,
      FlexboxContainerComponent,
      HeaderComponent,
      HeadingGroupComponent,
      LabelComponent,
      SectionComponent,
    ],
    styleUrl:        "TermsRouteComponent.sass",
    templateUrl:     "TermsRouteComponent.html",

    standalone: true,
  },
)
export class TermsRouteComponent
  extends RouteComponent {

  protected readonly configLib: typeof configLib   = inject<typeof configLib>(CONFIG);
  protected readonly DateFormat: typeof DateFormat = DateFormat;
  protected readonly environment: Environment      = inject<Environment>(ENVIRONMENT);
  protected readonly updatedDate: Date             = new Date("2025-04-13T00:00:00.000Z");

}
