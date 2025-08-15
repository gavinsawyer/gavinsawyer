/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { DatePipe }                                                                                                                                                              from "@angular/common";
import { ChangeDetectionStrategy, Component, inject }                                                                                                                            from "@angular/core";
import { ArticleComponent, CapsuleComponent, FlexboxContainerComponent, HeaderComponent, HeadingGroupComponent, LabelComponent, LinkComponent, ListComponent, SectionComponent } from "@bowstring/components";
import { ListItemDirective }                                                                                                                                                     from "@bowstring/directives";
import { UserDateService }                                                                                                                                                       from "@bowstring/services";
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

  protected readonly userDateService: UserDateService = inject<UserDateService>(UserDateService);
  protected readonly updatedDate: Date                = new Date("2025-04-09T00:00:00.000Z");

}
