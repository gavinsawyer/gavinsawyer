/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { ChangeDetectionStrategy, Component, inject, input, type InputSignal, type OnInit, type Signal, type TemplateRef, viewChild } from "@angular/core";
import { Meta }                                                                                                                       from "@angular/platform-browser";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    template:        "",

    standalone: true,
  },
)
export class RouteComponent
  implements OnInit {

  protected readonly meta: Meta = inject<Meta>(Meta);

  public readonly aboveTemplateRef$: Signal<TemplateRef<never> | undefined>  = viewChild<TemplateRef<never>>("aboveTemplate");
  public readonly bannerTemplateRef$: Signal<TemplateRef<never> | undefined> = viewChild<TemplateRef<never>>("bannerTemplate");
  public readonly belowTemplateRef$: Signal<TemplateRef<never> | undefined>  = viewChild<TemplateRef<never>>("belowTemplate");
  public readonly descriptionInput$: InputSignal<string>                     = input.required<string>({ alias: "description" });

  public ngOnInit(): void {
    this.meta.updateTag(
      {
        name:    "description",
        content: this.descriptionInput$(),
      },
    );
  }

}
