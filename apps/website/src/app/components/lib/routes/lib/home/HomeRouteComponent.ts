/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { ChangeDetectionStrategy, Component, effect, inject, signal, type WritableSignal }                                                                                                                                                                                                                                                                               from "@angular/core";
import { Analytics, logEvent }                                                                                                                                                                                                                                                                                                                                           from "@angular/fire/analytics";
import { Auth }                                                                                                                                                                                                                                                                                                                                                          from "@angular/fire/auth";
import { addDoc, collection, type CollectionReference, Firestore, FirestoreError, serverTimestamp }                                                                                                                                                                                                                                                                      from "@angular/fire/firestore";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, type ValidationErrors, Validators }                                                                                                                                                                                                                                                               from "@angular/forms";
import { AsideComponent, BoxComponent, ButtonComponent, DividerComponent, FlexboxContainerComponent, FormComponent, HeaderComponent, HeadingGroupComponent, LabelComponent, LinkComponent, ListComponent, MasonryContainerComponent, OptionComponent, PhoneNumberFieldInputComponent, PickerInputComponent, SectionComponent, SymbolComponent, TextFieldInputComponent } from "@bowstring/components";
import { ListItemDirective, MasonryChildDirective }                                                                                                                                                                                                                                                                                                                      from "@bowstring/directives";
import { getFirestoreErrorMessage }                                                                                                                                                                                                                                                                                                                                      from "@bowstring/firebase-interop";
import { type Option }                                                                                                                                                                                                                                                                                                                                                   from "@bowstring/interfaces";
import { AuthenticationService, EllipsesService, ErrorsService }                                                                                                                                                                                                                                                                                                         from "@bowstring/services";
import { type CountryCode, getCountries, getCountryCallingCode, isPossiblePhoneNumber, parsePhoneNumberWithError, type PhoneNumber }                                                                                                                                                                                                                                     from "libphonenumber-js";
import { RouteComponent }                                                                                                                                                                                                                                                                                                                                                from "../../../../";
import { type MessageDocument }                                                                                                                                                                                                                                                                                                                                          from "../../../../../interfaces";
import { FocusService, MessagesService }                                                                                                                                                                                                                                                                                                                                 from "../../../../../services";
import { FocusComponent }                                                                                                                                                                                                                                                                                                                                                from "../../../focus/FocusComponent";


@Component(
  {
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports:         [
      AsideComponent,
      BoxComponent,
      ButtonComponent,
      DividerComponent,
      FlexboxContainerComponent,
      FocusComponent,
      FormComponent,
      HeaderComponent,
      HeadingGroupComponent,
      LabelComponent,
      LinkComponent,
      ListComponent,
      ListItemDirective,
      MasonryChildDirective,
      MasonryContainerComponent,
      OptionComponent,
      PhoneNumberFieldInputComponent,
      ReactiveFormsModule,
      SectionComponent,
      SymbolComponent,
      TextFieldInputComponent,
      PickerInputComponent,
    ],
    styleUrl:        "HomeRouteComponent.sass",
    templateUrl:     "HomeRouteComponent.html",

    standalone: true,
  },
)
export class HomeRouteComponent
  extends RouteComponent {

  constructor() {
    super();

    effect(
      (): void => {
        const messageDocument: MessageDocument | undefined = this.messagesService.messageDocuments$()?.[0];

        if (messageDocument)
          this.messageFormGroup.reset(
            ((
              {
                created,
                email,
                message,
                name,
                phone,
              }: MessageDocument,
            ): typeof this.messageFormGroup.value => ({
              email,
              message,
              name,
              notCreated: !created,
              ...(phone ? {
                phone: ((
                  {
                    countryCallingCode,
                    nationalNumber,
                  }: PhoneNumber,
                ): typeof this.messageFormGroup.controls.phone.value => ({
                  countryCallingCode,
                  nationalNumber,
                }))(parsePhoneNumberWithError(phone)),
              } : {}),
            }))(messageDocument),
          );
      },
    );
  }

  private readonly analytics: Analytics         = inject<Analytics>(Analytics);
  private readonly auth: Auth                   = inject<Auth>(Auth);
  private readonly errorsService: ErrorsService = inject<ErrorsService>(ErrorsService);
  private readonly firestore: Firestore         = inject<Firestore>(Firestore);

  protected readonly authenticationService: AuthenticationService                                                                                                                                                                                                                             = inject<AuthenticationService>(AuthenticationService);
  protected readonly countryCallingCodes: Array<string>                                                                                                                                                                                                                                       = [
    ...new Set<string>(
      getCountries().map<string>(
        (countryCode: CountryCode): string => getCountryCallingCode(countryCode),
      ),
    ),
  ].sort(
    (
      countryCallingCodeA: string,
      countryCallingCodeB: string,
    ): number => parseInt(countryCallingCodeA) > parseInt(countryCallingCodeB) ? 1 : - 1,
  );
  protected readonly ellipsesService: EllipsesService                                                                                                                                                                                                                                         = inject<EllipsesService>(EllipsesService);
  protected readonly focusService: FocusService                                                                                                                                                                                                                                               = inject<FocusService>(FocusService);
  protected readonly phoneCountryCallingCodeOptions: Array<Option>                                                                                                                                                                                                                            = getCountries().map<Option>(
    (countryCode: CountryCode): Option => ({
      label: countryCode,
      value: `+${ getCountryCallingCode(countryCode) }`,
    }),
  );
  protected readonly messageFormGroup: FormGroup<{ "email": FormControl<string>, "message": FormControl<string>, "name": FormControl<string>, "notCreated": FormControl<boolean>, "phone": FormGroup<{ "countryCallingCode": FormControl<string>, "nationalNumber": FormControl<string> }> }> = new FormGroup<{ "email": FormControl<string>, "message": FormControl<string>, "name": FormControl<string>, "notCreated": FormControl<boolean>, "phone": FormGroup<{ "countryCallingCode": FormControl<string>, "nationalNumber": FormControl<string> }> }>(
    {
      email:      new FormControl<string>(
        "",
        {
          nonNullable: true,
          validators:  [ Validators.email ],
        },
      ),
      message:    new FormControl<string>(
        "",
        {
          nonNullable: true,
          validators:  [ Validators.required ],
        },
      ),
      name:       new FormControl<string>(
        "",
        {
          nonNullable: true,
          validators:  [ Validators.required ],
        },
      ),
      notCreated: new FormControl<boolean>(
        true,
        {
          nonNullable: true,
          validators:  [ Validators.requiredTrue ],
        },
      ),
      phone:      new FormGroup<{ "countryCallingCode": FormControl<string>, "nationalNumber": FormControl<string> }>(
        {
          countryCallingCode: new FormControl<string>(
            "",
            {
              nonNullable: true,
              validators:  [
                Validators.required,
                (
                  {
                    parent,
                    value,
                  }: AbstractControl<string, string>,
                ): ValidationErrors => {
                  if (parent && "nationalNumber" in parent.controls && parent.controls["nationalNumber"])
                    parent.controls["nationalNumber"].updateValueAndValidity();

                  return value && !this.countryCallingCodes.includes(value) ? { "optionSelected": true } : {};
                },
              ],
            },
          ),
          nationalNumber:     new FormControl<string>(
            "",
            {
              nonNullable: true,
              validators:  [
                Validators.required,
                (
                  {
                    parent,
                    value,
                  }: AbstractControl<string, string>,
                ): ValidationErrors => value && !isPossiblePhoneNumber(`+${ parent && "countryCallingCode" in parent.controls ? parent.controls["countryCallingCode"].value : "" }${ value }`) ? { "possiblePhoneNumber": true } : {},
              ],
            },
          ),
        },
      ),
    },
  );
  protected readonly messagesFormWorking$: WritableSignal<boolean>                                                                                                                                                                                                                            = signal<boolean>(false);
  protected readonly messagesService: MessagesService                                                                                                                                                                                                                                         = inject<MessagesService>(MessagesService);
  protected readonly yearsSinceSummer2014: number                                                                                                                                                                                                                                             = new Date(
    new Date().getTime() - new Date("2014-06-21T16:00:00.000Z").getTime(),
  ).getFullYear() - 1970;

  protected logClickAddToContactsEvent(): void {
    logEvent<"click_addToContacts">(
      this.analytics,
      "click_addToContacts",
    );
  };
  protected logClickOpenResumeEvent(): void {
    logEvent<"click_openResume">(
      this.analytics,
      "click_openResume",
    );
  };
  protected messageFormSubmit(): void {
    const userId: string | undefined = this.auth.currentUser?.uid;

    if ((this.messageFormGroup.value.email || (this.messageFormGroup.value.phone?.countryCallingCode && this.messageFormGroup.value.phone.nationalNumber)) && this.messageFormGroup.value.message && this.messageFormGroup.value.name && userId) {
      this.messagesFormWorking$.set(true);

      addDoc<MessageDocument, MessageDocument>(
        collection(
          this.firestore,
          "messages",
        ) as CollectionReference<MessageDocument, MessageDocument>,
        {
          created: serverTimestamp(),
          ...(this.messageFormGroup.value.email ? { email: this.messageFormGroup.value.email } : {}),
          message: this.messageFormGroup.value.message,
          name:    this.messageFormGroup.value.name,
          ...(this.messageFormGroup.value.phone?.countryCallingCode && this.messageFormGroup.value.phone.nationalNumber ? { phone: `+${ this.messageFormGroup.controls.phone.controls.countryCallingCode.value }${ this.messageFormGroup.controls.phone.controls.nationalNumber.value }` } : {}),
          userId,
        },
      ).catch<never>(
        (firestoreError: FirestoreError): never => {
          this.errorsService.createError(getFirestoreErrorMessage(firestoreError));

          throw firestoreError;
        },
      ).finally(
        (): void => this.messagesFormWorking$.set(false),
      );
    }
  };

}
