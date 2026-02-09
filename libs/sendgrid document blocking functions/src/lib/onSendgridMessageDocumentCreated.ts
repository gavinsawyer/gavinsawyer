// noinspection JSUnusedGlobalSymbols

/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridMessageDocument }                                       from "@bowstring/interfaces";
import { Sendgrid_API_Key }                                                   from "@bowstring/secret-params";
import sendgrid                                                               from "@sendgrid/mail";
import { type CloudFunction }                                                 from "firebase-functions";
import { type FirestoreEvent, onDocumentCreated, type QueryDocumentSnapshot } from "firebase-functions/firestore";
import { HttpsError }                                                         from "firebase-functions/https";


export const onSendgridMessageDocumentCreated: CloudFunction<FirestoreEvent<QueryDocumentSnapshot | undefined, { documentId: string }>> = onDocumentCreated<"sendgridMessages/{documentId}">(
  {
    document: "sendgridMessages/{documentId}",
    secrets:  [ Sendgrid_API_Key ],
  },
  async (
    {
      data:   queryDocumentSnapshot,
      id:     createdFirestoreEventId,
      params: { documentId },
    }: FirestoreEvent<QueryDocumentSnapshot | undefined, { documentId: string }>,
  ): Promise<object> => {
    const sendgridMessageDocument: SendgridMessageDocument | undefined = queryDocumentSnapshot && (queryDocumentSnapshot.data() as SendgridMessageDocument);

    if (!sendgridMessageDocument)
      throw new HttpsError(
        "failed-precondition",
        "The sendgrid message document is missing.",
      );

    if (sendgridMessageDocument.updateOrigin !== "firestore")
      return {};

    sendgrid.setApiKey(Sendgrid_API_Key.value());

    return sendgrid.send(
      ((
        {
          html,
          recipient: to,
          sender:    from,
          subject,
          text,
          userId,
        }: SendgridMessageDocument,
      ): sendgrid.MailDataRequired => ({
        customArgs: {
          createdFirestoreEventId,
          documentId,
          userId,
        },
        from,
        html,
        subject,
        text,
        to,
      }))(sendgridMessageDocument),
    ).then<object, never>(
      (): object => ({}),
      (error: Error): never => {
        console.error(error);

        throw new HttpsError(
          "unknown",
          "Something went wrong.",
        );
      },
    );
  },
);
