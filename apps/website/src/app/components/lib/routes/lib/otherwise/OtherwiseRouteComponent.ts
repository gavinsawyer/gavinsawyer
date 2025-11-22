/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformServer }                                                     from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, type OnInit, PLATFORM_ID } from "@angular/core";
import { HeaderComponent, HeadingGroupComponent }                               from "@bowstring/components";
import { ENVIRONMENT, RESPONSE }                                                from "@bowstring/injection-tokens";
import { type Environment }                                                     from "@bowstring/interfaces";
import { FindRouteByPathPipe }                                                  from "@bowstring/pipes";
import { PathService }                                                          from "@bowstring/services";
import { type Response }                                                        from "express";
import { RouteComponent }                                                       from "../../../../";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports:         [
      FindRouteByPathPipe,
      HeaderComponent,
      HeadingGroupComponent,
    ],
    styleUrl:        "OtherwiseRouteComponent.sass",
    templateUrl:     "OtherwiseRouteComponent.html",

    standalone: true,
  },
)
export class OtherwiseRouteComponent
  extends RouteComponent
  implements OnInit {

  private readonly platformId: NonNullable<unknown> = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly response: Response | null        = inject<Response | null>(
    RESPONSE,
    { optional: true },
  );

  protected readonly environment: Environment = inject<Environment>(ENVIRONMENT);
  protected readonly pathService: PathService = inject<PathService>(PathService);

  public override ngOnInit(): void {
    super.ngOnInit();

    if (isPlatformServer(this.platformId))
      this.response?.status(404);
  }

}
