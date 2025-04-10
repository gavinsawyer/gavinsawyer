/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { ChangeDetectionStrategy, Component, inject }                                                                                                                                                                                                   from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators }                                                                                                                                                                                      from "@angular/forms";
import { AsideComponent, BoxComponent, ButtonComponent, FlexboxContainerComponent, HeaderComponent, HeadingGroupComponent, LabelComponent, LinkComponent, ListComponent, MasonryContainerComponent, RouteComponent, SectionComponent, SymbolComponent } from "@bowstring/components";
import { ListItemDirective, MasonryChildDirective }                                                                                                                                                                                                     from "@bowstring/directives";
import { FocusService }                                                                                                                                                                                                                                 from "../../../../../services";
import { FocusComponent }                                                                                                                                                                                                                               from "../../../focus/FocusComponent";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports:         [
      AsideComponent,
      BoxComponent,
      ButtonComponent,
      FlexboxContainerComponent,
      FocusComponent,
      HeaderComponent,
      HeadingGroupComponent,
      LabelComponent,
      LinkComponent,
      ListComponent,
      ListItemDirective,
      MasonryChildDirective,
      MasonryContainerComponent,
      ReactiveFormsModule,
      SectionComponent,
      SymbolComponent,
    ],
    styleUrl:        "HomeRouteComponent.sass",
    templateUrl:     "HomeRouteComponent.html",

    standalone: true,
  },
)
export class HomeRouteComponent
  extends RouteComponent {

  protected readonly contactFormGroup: FormGroup<{ "name": FormControl<string> }> = new FormGroup<{ "name": FormControl<string> }>(
    {
      name: new FormControl<string>(
        "",
        {
          nonNullable: true,
          validators:  [ Validators.required ],
        },
      ),
    },
  );
  protected readonly focusService: FocusService                                   = inject<FocusService>(FocusService);
  protected readonly yearsSinceSummer2014: number                                 = new Date(
    new Date().getTime() - new Date("2014-06-21T16:00:00.000Z").getTime(),
  ).getFullYear() - 1970;

  protected contactFormSubmit(): void {
    console.log(this.contactFormGroup.value);
  };

}
