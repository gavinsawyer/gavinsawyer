/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { ChangeDetectionStrategy, Component, inject }                                                                                                                            from "@angular/core";
import { ArticleComponent, CapsuleComponent, FlexboxContainerComponent, HeaderComponent, HeadingGroupComponent, LabelComponent, LinkComponent, ListComponent, SectionComponent } from "@bowstring/components";
import type * as configLib                                                                                                                                                       from "@bowstring/config";
import { ListItemDirective }                                                                                                                                                     from "@bowstring/directives";
import { DateFormat }                                                                                                                                                            from "@bowstring/enums";
import { CONFIG }                                                                                                                                                                from "@bowstring/injection-tokens";
import { DatePipe }                                                                                                                                                              from "@bowstring/pipes";
import { RouteComponent }                                                                                                                                                        from "../../../../";


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
      LinkComponent,
      ListComponent,
      ListItemDirective,
      SectionComponent,
    ],
    styleUrl:        "PrivacyRouteComponent.sass",
    templateUrl:     "PrivacyRouteComponent.html",

    standalone: true,
  },
)
export class PrivacyRouteComponent
  extends RouteComponent {

  protected readonly configLib: typeof configLib   = inject<typeof configLib>(CONFIG);
  protected readonly DateFormat: typeof DateFormat = DateFormat;
  protected readonly updatedDate: Date             = new Date("2026-01-19T00:00:00.000Z");

}
