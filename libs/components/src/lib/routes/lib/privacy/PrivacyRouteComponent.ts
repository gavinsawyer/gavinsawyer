/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { DatePipe }                                                                                                                                                                              from "@angular/common";
import { ChangeDetectionStrategy, Component }                                                                                                                                                    from "@angular/core";
import { ListItemDirective }                                                                                                                                                                     from "@bowstring/directives";
import { ArticleComponent, CapsuleComponent, FlexboxContainerComponent, HeaderComponent, HeadingGroupComponent, LabelComponent, LinkComponent, ListComponent, RouteComponent, SectionComponent } from "../../../../";


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

  protected readonly updatedDate: Date = new Date("2025-04-09T00:00:00.000Z");

}
