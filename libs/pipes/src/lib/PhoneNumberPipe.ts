/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { Pipe, PipeTransform }                         from "@angular/core";
import { parsePhoneNumberWithError, type PhoneNumber } from "libphonenumber-js";


@Pipe(
  {
    name: "bowstringPhoneNumber",

    standalone: true,
  },
)
export class PhoneNumberPipe
  implements PipeTransform {

  public transform(value?: string): string {
    if (value) {
      const phoneNumber: PhoneNumber = parsePhoneNumberWithError(value);

      return `+${ phoneNumber.countryCallingCode } ${ phoneNumber.formatNational() }`;
    }

    return "";
  }

}
