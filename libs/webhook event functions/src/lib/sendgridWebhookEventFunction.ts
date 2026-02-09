// noinspection JSUnusedGlobalSymbols

/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

import { type SendgridMessageDocument }                                                                                        from "@bowstring/interfaces";
import { Sendgrid_Webhook_Verification_Key }                                                                                   from "@bowstring/secret-params";
import { type SendgridClickedEvent, type SendgridEvent, type SendgridProcessedEvent }                                          from "@bowstring/types";
import sendgrid                                                                                                                from "@sendgrid/eventwebhook";
import { getApp }                                                                                                              from "firebase-admin/app";
import { type DocumentReference, type DocumentSnapshot, FieldValue, type Firestore, getFirestore, Timestamp, type WriteBatch } from "firebase-admin/firestore";
import { type HttpsFunction, onRequest, type Request }                                                                         from "firebase-functions/https";


export const sendgridWebhookEventFunction: HttpsFunction = onRequest(
  {
    ingressSettings: "ALLOW_ALL",
    invoker:         "public",
    secrets:         [ Sendgrid_Webhook_Verification_Key ],
  },
  (
    request: Request,
    response: Exclude<Request["res"], undefined>,
  ): void => {
    const signature: string | undefined = request.header("x-twilio-email-event-webhook-signature");
    const timestamp: string | undefined = request.header("x-twilio-email-event-webhook-timestamp");

    if (!signature) {
      response.sendStatus(400).end();

      throw new Error("The `x-twilio-email-event-webhook-signature` header is missing from the request.");
    }

    if (!timestamp) {
      response.sendStatus(400).end();

      throw new Error("The `x-twilio-email-event-webhook-timestamp` header is missing from the request.");
    }

    const eventWebhook: sendgrid.EventWebhook = new sendgrid.EventWebhook();
    const verified: boolean                   = eventWebhook.verifySignature(
      eventWebhook.convertPublicKeyToECDSA(Sendgrid_Webhook_Verification_Key.value()),
      request.rawBody,
      signature,
      timestamp,
    );

    if (!verified) {
      response.sendStatus(401).end();

      throw new Error("The request was not verified.");
    }

    const firestore: Firestore                 = getFirestore(getApp());
    const sendgridEvents: Array<SendgridEvent> = JSON.parse(
      request.rawBody.toString(),
      (
        _key: string,
        value: unknown,
      ): Array<SendgridEvent> | SendgridEvent | Exclude<SendgridClickedEvent["urlOffset"], undefined> | Exclude<SendgridProcessedEvent["pool"], undefined> | Array<string> | boolean | number | string => typeof value !== "boolean" && typeof value !== "number" && typeof value !== "string" ? typeof value !== "object" || value === null ? ((): never => {
        response.sendStatus(200).end();

        throw new Error("The `SendgridEvent` array could not be revived from the request: An expected value is not a boolean, number, string, or non-null object.");
      })() : !Array.isArray(value) ? !("id" in value) || typeof value.id !== "number" || !("name" in value) || typeof value.name !== "string" ? !("index" in value) || typeof value.index !== "number" || !("type" in value) || typeof value.type !== "string" ? !("createdFirestoreEventId" in value) || typeof value.createdFirestoreEventId !== "string" || !("documentId" in value) || typeof value.documentId !== "string" || !("email" in value) || typeof value.email !== "string" || !("event" in value) || typeof value.event !== "string" || !("sg_event_id" in value) || typeof value.sg_event_id !== "string" || !("timestamp" in value) || typeof value.timestamp !== "number" || !("userId" in value) || typeof value.userId !== "string" ? ((): never => {
        response.sendStatus(200).end();

        throw new Error("The `SendgridEvent` array could not be revived from the request: An expected value is not a valid Array, SendgridProcessedEvent[\"pool\"], SendgridClickedEvent[\"urlOffset\"], or SendgridAnyEvent object.");
      })() : (value.event !== "bounce" && value.event !== "deferred" && value.event !== "delivered" && value.event !== "dropped" && value.event !== "processed") || !("smtp-id" in value) || typeof value["smtp-id"] !== "string" ? value.event !== "click" || !("ip" in value) || typeof value.ip !== "string" || !("url" in value) || typeof value.url !== "string" || !("useragent" in value) || typeof value.useragent !== "string" ? !("asm_group_id" in value) || typeof value.asm_group_id !== "number" || !("ip" in value) || typeof value.ip !== "string" || !("url" in value) || typeof value.url !== "string" || !("useragent" in value) || typeof value.useragent !== "string" ? value.event !== "open" || !("ip" in value) || typeof value.ip !== "string" || !("useragent" in value) || typeof value.useragent !== "string" ? value.event !== "spamreport" ? value.event !== "unsubscribe" ? ((): never => {
        response.sendStatus(200).end();

        throw new Error("The `SendgridEvent` array could not be revived from the request: An expected value is not a valid SendgridClickedEvent, SendgridGroupResubscribedEvent, SendgridGroupUnsubscribedEvent, SendgridOpenedEvent, SendgridReportedSpamEvent, or SendgridUnsubscribedEvent object.");
      })() : {
        ...(!("category" in value) || (typeof value.category !== "string" && !Array.isArray(value.category)) ? {} : { category: value.category }),
        createdFirestoreEventId: value.createdFirestoreEventId,
        documentId:              value.documentId,
        email:                   value.email,
        id:                      value.sg_event_id,
        ...(!("marketing_campaign_id" in value) || typeof value.marketing_campaign_id !== "string" ? {} : { marketingCampaignId: value.marketing_campaign_id }),
        ...(!("marketing_campaign_name" in value) || typeof value.marketing_campaign_name !== "string" ? {} : { marketingCampaignName: value.marketing_campaign_name }),
        ...(!("sg_message_id" in value) || typeof value.sg_message_id !== "string" ? {} : { messageId: value.sg_message_id }),
        timestamp: value.timestamp,
        type:      "unsubscribed",
        userId:    value.userId,
      } : {
        ...(!("category" in value) || (typeof value.category !== "string" && !Array.isArray(value.category)) ? {} : { category: value.category }),
        createdFirestoreEventId: value.createdFirestoreEventId,
        documentId:              value.documentId,
        email:                   value.email,
        id:                      value.sg_event_id,
        ...(!("marketing_campaign_id" in value) || typeof value.marketing_campaign_id !== "string" ? {} : { marketingCampaignId: value.marketing_campaign_id }),
        ...(!("marketing_campaign_name" in value) || typeof value.marketing_campaign_name !== "string" ? {} : { marketingCampaignName: value.marketing_campaign_name }),
        ...(!("sg_message_id" in value) || typeof value.sg_message_id !== "string" ? {} : { messageId: value.sg_message_id }),
        timestamp: value.timestamp,
        type:      "reported_spam",
        userId:    value.userId,
      } : {
        ...(!("category" in value) || (typeof value.category !== "string" && !Array.isArray(value.category)) ? {} : { category: value.category }),
        createdFirestoreEventId: value.createdFirestoreEventId,
        documentId:              value.documentId,
        email:                   value.email,
        id:                      value.sg_event_id,
        ip:                      value.ip,
        ...(!("sg_machine_open" in value) || (typeof value.sg_machine_open !== "boolean" && typeof value.sg_machine_open !== "number") ? {} : { machineOpen: !!value.sg_machine_open }),
        ...(!("marketing_campaign_id" in value) || typeof value.marketing_campaign_id !== "string" ? {} : { marketingCampaignId: value.marketing_campaign_id }),
        ...(!("marketing_campaign_name" in value) || typeof value.marketing_campaign_name !== "string" ? {} : { marketingCampaignName: value.marketing_campaign_name }),
        ...(!("sg_message_id" in value) || typeof value.sg_message_id !== "string" ? {} : { messageId: value.sg_message_id }),
        timestamp: value.timestamp,
        type:      "opened",
        useragent: value.useragent,
        userId:    value.userId,
      } : value.event !== "group_resubscribe" ? value.event !== "group_unsubscribe" ? ((): never => {
        response.sendStatus(200).end();

        throw new Error("The `SendgridEvent` array could not be revived from the request: An expected value is not a valid SendgridGroupResubscribedEvent or SendgridGroupUnsubscribedEvent object.");
      })() : {
        asmGroupId: value.asm_group_id,
        ...(!("category" in value) || (typeof value.category !== "string" && !Array.isArray(value.category)) ? {} : { category: value.category }),
        createdFirestoreEventId: value.createdFirestoreEventId,
        documentId:              value.documentId,
        email:                   value.email,
        ip:                      value.ip,
        id:                      value.sg_event_id,
        ...(!("marketing_campaign_id" in value) || typeof value.marketing_campaign_id !== "string" ? {} : { marketingCampaignId: value.marketing_campaign_id }),
        ...(!("marketing_campaign_name" in value) || typeof value.marketing_campaign_name !== "string" ? {} : { marketingCampaignName: value.marketing_campaign_name }),
        ...(!("sg_message_id" in value) || typeof value.sg_message_id !== "string" ? {} : { messageId: value.sg_message_id }),
        timestamp: value.timestamp,
        type:      "group_unsubscribed",
        url:       value.url,
        useragent: value.useragent,
        userId:    value.userId,
      } : {
        asmGroupId: value.asm_group_id,
        ...(!("category" in value) || (typeof value.category !== "string" && !Array.isArray(value.category)) ? {} : { category: value.category }),
        createdFirestoreEventId: value.createdFirestoreEventId,
        documentId:              value.documentId,
        email:                   value.email,
        id:                      value.sg_event_id,
        ip:                      value.ip,
        ...(!("marketing_campaign_id" in value) || typeof value.marketing_campaign_id !== "string" ? {} : { marketingCampaignId: value.marketing_campaign_id }),
        ...(!("marketing_campaign_name" in value) || typeof value.marketing_campaign_name !== "string" ? {} : { marketingCampaignName: value.marketing_campaign_name }),
        ...(!("sg_message_id" in value) || typeof value.sg_message_id !== "string" ? {} : { messageId: value.sg_message_id }),
        timestamp: value.timestamp,
        type:      "group_resubscribed",
        url:       value.url,
        useragent: value.useragent,
        userId:    value.userId,
      } : {
        ...(!("asm_group_id" in value) || typeof value.asm_group_id !== "number" ? {} : { asmGroupId: value.asm_group_id }),
        ...(!("category" in value) || (typeof value.category !== "string" && !Array.isArray(value.category)) ? {} : { category: value.category }),
        createdFirestoreEventId: value.createdFirestoreEventId,
        documentId:              value.documentId,
        email:                   value.email,
        id:                      value.sg_event_id,
        ip:                      value.ip,
        ...(!("marketing_campaign_id" in value) || typeof value.marketing_campaign_id !== "string" ? {} : { marketingCampaignId: value.marketing_campaign_id }),
        ...(!("marketing_campaign_name" in value) || typeof value.marketing_campaign_name !== "string" ? {} : { marketingCampaignName: value.marketing_campaign_name }),
        ...(!("sg_message_id" in value) || typeof value.sg_message_id !== "string" ? {} : { messageId: value.sg_message_id }),
        timestamp: value.timestamp,
        type:      "clicked",
        url:       value.url,
        ...(!("url_offset" in value) || typeof value.url_offset !== "object" || value.url_offset === null || !("index" in value.url_offset) || typeof value.url_offset.index !== "number" || !("type" in value.url_offset) || typeof value.url_offset.type !== "string" ? {} : {
          urlOffset: {
            index: value.url_offset.index,
            type:  value.url_offset.type,
          },
        }),
        useragent: value.useragent,
        userId:    value.userId,
      } : !("reason" in value) || typeof value.reason !== "string" || !("status" in value) || typeof value.status !== "string" ? value.event !== "deferred" || !("attempt" in value) || typeof value.attempt !== "string" || !("response" in value) || typeof value.response !== "string" ? value.event !== "delivered" || !("response" in value) || typeof value.response !== "string" ? value.event !== "processed" ? ((): never => {
        response.sendStatus(200).end();

        throw new Error("The `SendgridEvent` array could not be revived from the request: An expected value is not a valid SendgridDeferredEvent, SendgridDeliveredEvent, or SendgridProcessedEvent.");
      })() : {
        ...(!("asm_group_id" in value) || typeof value.asm_group_id !== "number" ? {} : { asmGroupId: value.asm_group_id }),
        ...(!("category" in value) || (typeof value.category !== "string" && !Array.isArray(value.category)) ? {} : { category: value.category }),
        createdFirestoreEventId: value.createdFirestoreEventId,
        documentId:              value.documentId,
        email:                   value.email,
        id:                      value.sg_event_id,
        ...(!("marketing_campaign_id" in value) || typeof value.marketing_campaign_id !== "string" ? {} : { marketingCampaignId: value.marketing_campaign_id }),
        ...(!("marketing_campaign_name" in value) || typeof value.marketing_campaign_name !== "string" ? {} : { marketingCampaignName: value.marketing_campaign_name }),
        ...(!("sg_message_id" in value) || typeof value.sg_message_id !== "string" ? {} : { messageId: value.sg_message_id }),
        ...(!("pool" in value) || typeof value.pool !== "object" || value.pool === null || !("id" in value.pool) || typeof value.pool.id !== "number" || !("name" in value.pool) || typeof value.pool.name !== "string" ? {} : {
          pool: {
            id:   value.pool.id,
            name: value.pool.name,
          },
        }),
        smtpId:    value["smtp-id"],
        timestamp: value.timestamp,
        type:      "processed",
        userId:    value.userId,
      } : {
        ...(!("asm_group_id" in value) || typeof value.asm_group_id !== "number" ? {} : { asmGroupId: value.asm_group_id }),
        ...(!("category" in value) || (typeof value.category !== "string" && !Array.isArray(value.category)) ? {} : { category: value.category }),
        createdFirestoreEventId: value.createdFirestoreEventId,
        documentId:              value.documentId,
        email:                   value.email,
        id:                      value.sg_event_id,
        ...(!("ip" in value) || typeof value.ip !== "string" ? {} : { ip: value.ip }),
        ...(!("marketing_campaign_id" in value) || typeof value.marketing_campaign_id !== "string" ? {} : { marketingCampaignId: value.marketing_campaign_id }),
        ...(!("marketing_campaign_name" in value) || typeof value.marketing_campaign_name !== "string" ? {} : { marketingCampaignName: value.marketing_campaign_name }),
        ...(!("sg_message_id" in value) || typeof value.sg_message_id !== "string" ? {} : { messageId: value.sg_message_id }),
        response:  value.response,
        smtpId:    value["smtp-id"],
        timestamp: value.timestamp,
        ...(!("tls" in value) || (typeof value.tls !== "boolean" && typeof value.tls !== "number") ? {} : { tls: !!value.tls }),
        type:   "delivered",
        userId: value.userId,
      } : {
        ...(!("asm_group_id" in value) || typeof value.asm_group_id !== "number" ? {} : { asmGroupId: value.asm_group_id }),
        attempt: value.attempt,
        ...(!("category" in value) || (typeof value.category !== "string" && !Array.isArray(value.category)) ? {} : { category: value.category }),
        createdFirestoreEventId: value.createdFirestoreEventId,
        documentId:              value.documentId,
        ...(!("domain" in value) || typeof value.domain !== "string" ? {} : { domain: value.domain }),
        email: value.email,
        ...(!("from" in value) || typeof value.from !== "string" ? {} : { from: value.from }),
        id: value.sg_event_id,
        ...(!("marketing_campaign_id" in value) || typeof value.marketing_campaign_id !== "string" ? {} : { marketingCampaignId: value.marketing_campaign_id }),
        ...(!("marketing_campaign_name" in value) || typeof value.marketing_campaign_name !== "string" ? {} : { marketingCampaignName: value.marketing_campaign_name }),
        ...(!("reason" in value) || typeof value.reason !== "string" ? {} : { reason: value.reason }),
        ...(!("sg_message_id" in value) || typeof value.sg_message_id !== "string" ? {} : { messageId: value.sg_message_id }),
        response:  value.response,
        smtpId:    value["smtp-id"],
        timestamp: value.timestamp,
        type:      "deferred",
        userId:    value.userId,
      } : value.event !== "bounce" ? value.event !== "dropped" ? ((): never => {
        response.sendStatus(200).end();

        throw new Error("The `SendgridEvent` array could not be revived from the request: An expected value is not a valid SendgridBouncedEvent or SendgridDroppedEvent object.");
      })() : {
        ...(!("asm_group_id" in value) || typeof value.asm_group_id !== "number" ? {} : { asmGroupId: value.asm_group_id }),
        ...(!("category" in value) || (typeof value.category !== "string" && !Array.isArray(value.category)) ? {} : { category: value.category }),
        createdFirestoreEventId: value.createdFirestoreEventId,
        documentId:              value.documentId,
        email:                   value.email,
        id:                      value.sg_event_id,
        ...(!("marketing_campaign_id" in value) || typeof value.marketing_campaign_id !== "string" ? {} : { marketingCampaignId: value.marketing_campaign_id }),
        ...(!("marketing_campaign_name" in value) || typeof value.marketing_campaign_name !== "string" ? {} : { marketingCampaignName: value.marketing_campaign_name }),
        ...(!("sg_message_id" in value) || typeof value.sg_message_id !== "string" ? {} : { messageId: value.sg_message_id }),
        reason:    value.reason,
        smtpId:    value["smtp-id"],
        status:    value.status,
        timestamp: value.timestamp,
        type:      "dropped",
        userId:    value.userId,
      } : {
        ...(!("asm_group_id" in value) || typeof value.asm_group_id !== "number" ? {} : { asmGroupId: value.asm_group_id }),
        ...(!("bounce_classification" in value) || typeof value.bounce_classification !== "string" ? {} : { bounceIssue: value.bounce_classification }),
        ...(!("category" in value) || (typeof value.category !== "string" && !Array.isArray(value.category)) ? {} : { category: value.category }),
        createdFirestoreEventId: value.createdFirestoreEventId,
        documentId:              value.documentId,
        email:                   value.email,
        id:                      value.sg_event_id,
        ...(!("marketing_campaign_id" in value) || typeof value.marketing_campaign_id !== "string" ? {} : { marketingCampaignId: value.marketing_campaign_id }),
        ...(!("marketing_campaign_name" in value) || typeof value.marketing_campaign_name !== "string" ? {} : { marketingCampaignName: value.marketing_campaign_name }),
        ...(!("sg_message_id" in value) || typeof value.sg_message_id !== "string" ? {} : { messageId: value.sg_message_id }),
        reason: value.reason,
        smtpId: value["smtp-id"],
        ...(!("type" in value) || typeof value.type !== "string" || (value.type !== "blocked" && value.type !== "bounce") ? {} : { soft: value.type === "blocked" }),
        status:    value.status,
        timestamp: value.timestamp,
        type:      "bounced",
        ...(!("tls" in value) || (typeof value.tls !== "boolean" && typeof value.tls !== "number") ? {} : { tls: !!value.tls }),
        userId: value.userId,
      } : {
        index: value.index,
        type:  value.type,
      } : {
        id:   value.id,
        name: value.name,
      } : value : value,
    );

    if (!sendgridEvents.length) {
      response.sendStatus(200).end();

      throw new Error("The revived `SendgridEvent` array from the request is empty.");
    }

    const writeBatch: WriteBatch = firestore.batch();

    sendgridEvents.sort(
      (
        { timestamp: timestampA }: SendgridEvent,
        { timestamp: timestampB }: SendgridEvent,
      ): number => timestampA - timestampB,
    ).reduce<Promise<void>>(
      (
        promise: Promise<void>,
        sendgridEvent: SendgridEvent,
      ): Promise<void> => promise.then<void, never>(
        (): Promise<void> => (firestore.collection("sendgridMessages").doc(sendgridEvent.documentId) as DocumentReference<SendgridMessageDocument, SendgridMessageDocument>).get().then<void, never>(
          (sendgridMessageDocumentSnapshot: DocumentSnapshot<SendgridMessageDocument, SendgridMessageDocument>): void => void writeBatch.update<SendgridMessageDocument, SendgridMessageDocument>(
            sendgridMessageDocumentSnapshot.ref,
            {
              ...(sendgridEvent.type === "bounced" ? {
                bounced:                Timestamp.fromMillis(sendgridEvent.timestamp * 1000),
                bouncedSendgridEventId: sendgridEvent.id,
              } : {}),
              ...(sendgridEvent.type === "deferred" ? {
                deferred:                Timestamp.fromMillis(sendgridEvent.timestamp * 1000),
                deferredSendgridEventId: sendgridEvent.id,
              } : {}),
              ...(sendgridEvent.type === "delivered" ? {
                delivered:                Timestamp.fromMillis(sendgridEvent.timestamp * 1000),
                deliveredSendgridEventId: sendgridEvent.id,
              } : {}),
              ...(sendgridEvent.type === "dropped" ? {
                dropped:                Timestamp.fromMillis(sendgridEvent.timestamp * 1000),
                droppedSendgridEventId: sendgridEvent.id,
              } : {}),
              ...(sendgridEvent.type !== "bounced" && sendgridEvent.type !== "deferred" && sendgridEvent.type !== "delivered" && sendgridEvent.type !== "dropped" && sendgridEvent.type !== "processed" ? {
                engagements: FieldValue.arrayUnion(
                  {
                    ...(sendgridEvent.type === "opened" || sendgridEvent.type === "clicked" || sendgridEvent.type === "group_resubscribed" || sendgridEvent.type === "group_unsubscribed" ? { ip: sendgridEvent.ip } : {}),
                    ...(sendgridEvent.type === "opened" ? { machineOpen: sendgridEvent.machineOpen } : {}),
                    sendgridEventId: sendgridEvent.id,
                    timestamp:       Timestamp.fromMillis(sendgridEvent.timestamp * 1000),
                    type:            sendgridEvent.type,
                    ...(sendgridEvent.type === "opened" || sendgridEvent.type === "clicked" || sendgridEvent.type === "group_resubscribed" || sendgridEvent.type === "group_unsubscribed" ? { useragent: sendgridEvent.useragent } : {}),
                  },
                ),
              } : {}),
              ...(sendgridEvent.type === "processed" ? {
                processed:                Timestamp.fromMillis(sendgridEvent.timestamp * 1000),
                processedSendgridEventId: sendgridEvent.id,
              } : {}),
              ...(sendgridEvent.type === "bounced" || sendgridEvent.type === "deferred" || sendgridEvent.type === "delivered" || sendgridEvent.type === "dropped" || sendgridEvent.type === "processed" ? { status: sendgridEvent.type } : {}),
              updated:      Timestamp.fromMillis(sendgridEvent.timestamp * 1000),
              updateOrigin: "sendgrid",
            },
          ),
          (error: Error): never => {
            response.status(500).send("Something went wrong").end();

            throw error;
          },
        ),
        (error: Error): never => {
          response.status(500).send("Something went wrong").end();

          throw error;
        },
      ),
      Promise.resolve(),
    ).then<void, never>(
      (): Promise<void> => writeBatch.commit().then<void, never>(
        (): void => void response.sendStatus(200).end(),
        (error: Error): never => {
          response.status(500).send("Something went wrong").end();

          throw error;
        },
      ),
      (error: Error): never => {
        response.status(500).send("Something went wrong").end();

        throw error;
      },
    );
  },
);
