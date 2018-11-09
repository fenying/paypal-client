/**
 *  Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as VerCom from "../Common";
import * as Payouts from "./Common";

export class Command
extends VerCom.AbstractCommand<Payouts.IPayout> {

    private _senderBatchId: string;

    private _emailTitle: string;

    private _emailMessage: string;

    private _items: Payouts.IPayoutItem[];

    /**
     * @param senderBatchId     Non-duplicated id for payout
     * @param emailTitle        The title of E-Mail to be sent to customer.
     * @param emailMessage      The message of E-Mail to be sent to customer.
     * @param items             The receivers details.
     */
    public constructor(
        senderBatchId: string,
        emailTitle: string,
        emailMessage: string,
        items: Payouts.IPayoutItem[]
    ) {

        super();

        this._emailMessage = emailMessage;
        this._emailTitle = emailTitle;
        this._senderBatchId = senderBatchId;
        this._items = items;
    }

    public getPath(): string {

        return "/v1/payments/payouts";
    }

    public getBody(): string {

        return JSON.stringify({

            "sender_batch_header": {

                "sender_batch_id": this._senderBatchId,
                "email_subject": this._emailTitle,
                "email_message": this._emailMessage
            },

            "items": this._items
        });
    }

    public getMethod(): "POST" {

        return "POST";
    }

    public parseResponse(
        code: number,
        headers: Record<string, string | string[]>,
        body: string
    ): Payouts.IPayout {

        return JSON.parse(body);
    }
}
