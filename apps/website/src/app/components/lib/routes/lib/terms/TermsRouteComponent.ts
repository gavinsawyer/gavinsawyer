/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { DatePipe }                                                                                                                                from "@angular/common";
import { ChangeDetectionStrategy, Component, inject }                                                                                              from "@angular/core";
import type * as brandLib                                                                                                                          from "@bowstring/brand";
import { ArticleComponent, CapsuleComponent, FlexboxContainerComponent, HeaderComponent, HeadingGroupComponent, LabelComponent, SectionComponent } from "@bowstring/components";
import { BRAND, ENVIRONMENT }                                                                                                                      from "@bowstring/injection-tokens";
import { type Environment }                                                                                                                        from "@bowstring/interfaces";
import { UserDateService }                                                                                                                         from "@bowstring/services";
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

  protected readonly brandLib: typeof brandLib        = inject<typeof brandLib>(BRAND);
  protected readonly environment: Environment         = inject<Environment>(ENVIRONMENT);
  protected readonly userDateService: UserDateService = inject<UserDateService>(UserDateService);
  protected readonly updatedDate: Date                = new Date("2025-04-13T00:00:00.000Z");

}
