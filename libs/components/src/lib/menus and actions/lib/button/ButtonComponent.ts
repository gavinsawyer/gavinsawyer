/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { NgTemplateOutlet }                                                                                                                                                                                                              from "@angular/common";
import { afterRender, booleanAttribute, ChangeDetectionStrategy, Component, type ElementRef, inject, input, type InputSignal, type InputSignalWithTransform, output, type OutputEmitterRef, type Signal, viewChild }                     from "@angular/core";
import { toObservable, toSignal }                                                                                                                                                                                                        from "@angular/core/rxjs-interop";
import { RouterLink, RouterLinkActive }                                                                                                                                                                                                  from "@angular/router";
import { CanvasDirective, ContainerDirective, ElevatedDirective, FlexboxContainerDirective, GlassDirective, HoverTransformingDirective, InverseDirective, PrimaryDirective, SecondaryDirective, WarningDirective, WellRoundedDirective } from "@bowstring/directives";
import { combineLatestWith, map, type Observable, of, startWith, switchMap }                                                                                                                                                             from "rxjs";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:            {
      "[class.appearance-raised]":  "appearanceInput$() === 'raised'",
      "[class.appearance-symbol]":  "appearanceInput$() === 'symbol'",
      "[class.disabled]":           "disabled$()",
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
        if (this.externalLinkHtmlAnchorElementRef$() || this.htmlButtonElementRef$() || this.routerLinkHtmlAnchorElementRef$()) {
          this.hoverTransformingDirective.htmlElementRef$.set(this.externalLinkHtmlAnchorElementRef$() || this.htmlButtonElementRef$() || this.routerLinkHtmlAnchorElementRef$());
          this.wellRoundedDirective.htmlElementRef$.set(this.externalLinkHtmlAnchorElementRef$() || this.htmlButtonElementRef$() || this.routerLinkHtmlAnchorElementRef$());
        }
      },
    );
  }

  private readonly hoverTransformingDirective: HoverTransformingDirective                               = inject<HoverTransformingDirective>(HoverTransformingDirective);
  private readonly externalLinkHtmlAnchorElementRef$: Signal<ElementRef<HTMLAnchorElement> | undefined> = viewChild<ElementRef<HTMLAnchorElement>>("externalLinkHtmlAnchorElement");
  private readonly htmlButtonElementRef$: Signal<ElementRef<HTMLButtonElement> | undefined>             = viewChild<ElementRef<HTMLButtonElement>>("htmlButtonElement");
  private readonly routerLinkActive$: Signal<RouterLinkActive | undefined>                              = viewChild<RouterLinkActive>(RouterLinkActive);
  private readonly routerLinkHtmlAnchorElementRef$: Signal<ElementRef<HTMLAnchorElement> | undefined>   = viewChild<ElementRef<HTMLAnchorElement>>("routerLinkHtmlAnchorElement");

  protected readonly containerDirective: ContainerDirective     = inject<ContainerDirective>(ContainerDirective);
  protected readonly wellRoundedDirective: WellRoundedDirective = inject<WellRoundedDirective>(WellRoundedDirective);

  public readonly appearanceInput$: InputSignal<"raised" | "symbol" | undefined>                                           = input<"raised" | "symbol" | undefined>(
    undefined,
    { alias: "appearance" },
  );
  public readonly disabledInput$: InputSignalWithTransform<boolean | undefined, "" | boolean | `${ boolean }` | undefined> = input<boolean | undefined, "" | boolean | `${ boolean }` | undefined>(
    undefined,
    {
      alias:     "disabled",
      transform: booleanAttribute,
    },
  );
  public readonly disabled$: Signal<boolean | undefined>                                                                   = toSignal<boolean>(
    toObservable<boolean | undefined>(this.disabledInput$).pipe<[ boolean | undefined, boolean | undefined ], boolean>(
      combineLatestWith<boolean | undefined, [ boolean | undefined ]>(toObservable<RouterLinkActive | undefined>(this.routerLinkActive$).pipe<boolean | undefined>(switchMap<RouterLinkActive | undefined, Observable<boolean | undefined>>((routerLinkActive?: RouterLinkActive): Observable<boolean | undefined> => routerLinkActive?.isActiveChange.asObservable().pipe<boolean | undefined>(startWith<boolean, [ boolean | undefined ]>(routerLinkActive?.isActive)) || of<undefined>(undefined)))),
      map<[ boolean | undefined, boolean | undefined ], boolean>(
        (
          [
            disabledInput,
            routerLinkActive,
          ]: [ boolean | undefined, boolean | undefined ],
        ): boolean => disabledInput || routerLinkActive || false,
      ),
    ),
  );
  public readonly materialInput$: InputSignal<"glass" | "inverse" | "primary" | "secondary" | "warning" | undefined>       = input<"glass" | "inverse" | "primary" | "secondary" | "warning" | undefined>(
    undefined,
    { alias: "material" },
  );
  public readonly output: OutputEmitterRef<void>                                                                           = output<void>({ alias: "output" });
  public readonly typeInput$: InputSignal<"reset" | "submit" | undefined>                                                  = input<"reset" | "submit" | undefined>(
    undefined,
    { alias: "type" },
  );
  public readonly urlInput$: InputSignal<string | undefined>                                                               = input<string | undefined>(
    undefined,
    { alias: "url" },
  );

  public focus(): void {
    (this.externalLinkHtmlAnchorElementRef$() || this.htmlButtonElementRef$() || this.routerLinkHtmlAnchorElementRef$())?.nativeElement.focus();
  }

}
