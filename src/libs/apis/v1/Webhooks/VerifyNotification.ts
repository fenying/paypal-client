/**
 *  Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as Version from "../Common";
import * as Webhooks from "./Common";

export class Command
extends Version.AbstractCommand<boolean> {

    private _authAlgo: string;

    private _certUrl: string;

    private _transId: string;

    private _transSign: string;

    private _transTime: string;

    private _webhookId: string;

    private _notification: Webhooks.IWEbhookEventType;

    public constructor(
        webhookId: string,
        authAlgo: string,
        certUrl: string,
        transId: string,
        transSign: string,
        transTime: string,
        notification: Webhooks.IWEbhookEventType
    ) {

        super();

        this._authAlgo = authAlgo;
        this._certUrl = certUrl;
        this._transId = transId;
        this._transSign = transSign;
        this._transTime = transTime;
        this._webhookId = webhookId;
        this._notification = notification;
    }

    public getPath(): string {

        return `/v1/notifications/verify-webhook-signature`;
    }

    public getBody(): string {

        return JSON.stringify({
            auth_algo: this._authAlgo,
            cert_url: this._certUrl,
            transmission_id: this._transId,
            transmission_sig: this._transSign,
            transmission_time: this._transTime,
            webhook_id: this._webhookId,
            webhook_event: this._notification
        });
    }

    public getMethod(): "POST" {

        return "POST";
    }

    public parseResponse(
        code: number,
        headers: Record<string, string | string[]>,
        body: string
    ): boolean {

        let result = JSON.parse(body);

        if (
            typeof result === "object" &&
            result.verification_status === "SUCCESS"
        ) {

            return true;
        }

        return false;
    }
}
