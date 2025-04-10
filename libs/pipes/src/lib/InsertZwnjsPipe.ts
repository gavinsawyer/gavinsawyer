/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { Pipe, PipeTransform } from "@angular/core";


@Pipe(
  {
    name: "bowstringInsertZwnjs",

    standalone: true,
  },
)
export class InsertZwnjsPipe
  implements PipeTransform {

  public transform(value?: string): string {
    return value ? value.replace(
      /\b(\w)/g,
      `$1&zwnj;`,
    ) : "";
  }

}
