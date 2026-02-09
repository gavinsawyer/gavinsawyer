/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";


@Pipe(
  {
    name: "bowstringGetRegionDisplayName",

    standalone: true,
  },
)
export class GetRegionDisplayNamePipe
  implements PipeTransform {

  private readonly localeId: string = inject<string>(LOCALE_ID);

  public transform(value: string): string
  public transform(value?: null): ""
  public transform(value?: string | null): string | "" {
    if (value)
      return new Intl.DisplayNames(
        [ this.localeId ],
        { type: "region" },
      ).of(value) || value

    return "";
  }

}
