/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
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

  public transform(value?: string): string {
    return value ? new Intl.DisplayNames(
      [ this.localeId ],
      { type: "region" },
    ).of(value) || value : "";
  }

}
