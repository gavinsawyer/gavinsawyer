/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                                                                                                                                                                                                              from "@angular/common";
import { afterRender, booleanAttribute, ChangeDetectionStrategy, Component, type ElementRef, inject, input, type InputSignal, type InputSignalWithTransform, output, type OutputEmitterRef, type Signal, viewChild }                     from "@angular/core";
import { RouterLink, RouterLinkActive }                                                                                                                                                                                                  from "@angular/router";
import { CanvasDirective, ContainerDirective, ElevatedDirective, FlexboxContainerDirective, GlassDirective, HoverTransformingDirective, InverseDirective, PrimaryDirective, SecondaryDirective, WarningDirective, WellRoundedDirective } from "@bowstring/directives";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[class.appearance-raised]":  "appearanceInput$() === 'raised'",
      "[class.appearance-symbol]":  "appearanceInput$() === 'symbol'",
      "[class.disabled]":           "disabledInput$() || routerLinkActive$()?.isActive || false",
      "[class.material-glass]":     "materialInput$() === 'glass'",
      "[class.material-inverse]":   "materialInput$() === 'inverse'",
      "[class.material-primary]":   "materialInput$() === 'primary'",
      "[class.material-secondary]": "materialInput$() === 'secondary'",
      "[class.material-warning]":   "materialInput$() === 'warning'",
    },
    hostDirectives:  [
      { directive: CanvasDirective },
      {
        directive: ElevatedDirective,
        inputs:    [
          "level",
          "materialOpacity",
        ],
      },
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
        directive: GlassDirective,
        inputs:    [ "materialOpacity" ],
      },
      { directive: HoverTransformingDirective },
      { directive: InverseDirective },
      { directive: PrimaryDirective },
      { directive: SecondaryDirective },
      { directive: WarningDirective },
      {
        directive: WellRoundedDirective,
        inputs:    [ "level" ],
      },
    ],
    imports:         [
      NgTemplateOutlet,
      RouterLink,
      RouterLinkActive,
    ],
    selector:        "bowstring--button",
    styleUrl:        "ButtonComponent.sass",
    templateUrl:     "ButtonComponent.html",

    standalone: true,
  },
)
export class ButtonComponent {

  constructor() {
    afterRender(
      (): void => {
        this.hoverTransformingDirective.htmlElementRef$.set(this.htmlDivElementRef$());
        this.wellRoundedDirective.htmlElementRef$.set(this.htmlDivElementRef$());
      },
    );
  }

  private readonly hoverTransformingDirective: HoverTransformingDirective = inject<HoverTransformingDirective>(HoverTransformingDirective);
  private readonly htmlDivElementRef$: Signal<ElementRef<HTMLDivElement>> = viewChild.required<ElementRef<HTMLDivElement>>("htmlDivElement");

  protected readonly containerDirective: ContainerDirective                  = inject<ContainerDirective>(ContainerDirective);
  protected readonly routerLinkActive$: Signal<RouterLinkActive | undefined> = viewChild<RouterLinkActive>(RouterLinkActive);
  protected readonly wellRoundedDirective: WellRoundedDirective              = inject<WellRoundedDirective>(WellRoundedDirective);

  public readonly appearanceInput$: InputSignal<"raised" | "symbol" | undefined>                                                                = input<"raised" | "symbol" | undefined>(
    undefined,
    { alias: "appearance" },
  );
  public readonly disabledInput$: InputSignalWithTransform<boolean | undefined, "" | boolean | `${ boolean }` | undefined>                      = input<boolean | undefined, "" | boolean | `${ boolean }` | undefined>(
    undefined,
    {
      alias:     "disabled",
      transform: booleanAttribute,
    },
  );
  public readonly materialInput$: InputSignal<"appleMusic" | "glass" | "inverse" | "primary" | "secondary" | "spotify" | "warning" | undefined> = input<"appleMusic" | "glass" | "inverse" | "primary" | "secondary" | "spotify" | "warning" | undefined>(
    undefined,
    { alias: "material" },
  );
  public readonly output: OutputEmitterRef<void>                                                                                                = output<void>({ alias: "output" });
  public readonly typeInput$: InputSignal<"reset" | "submit" | undefined>                                                                       = input<"reset" | "submit" | undefined>(
    undefined,
    { alias: "type" },
  );
  public readonly urlInput$: InputSignal<string | undefined>                                                                                    = input<string | undefined>(
    undefined,
    { alias: "url" },
  );

}
