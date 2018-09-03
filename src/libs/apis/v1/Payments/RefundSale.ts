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

import * as Version from "../Common";
import * as Payments from "./Common";

export class Command
extends Version.AbstractCommand<Payments.IRefundInfo> {

    private _id: string;

    private _value: string;

    private _currency: string;

    private _invoiceId?: string;

    private _description?: string;

    private _reason?: string;

    public constructor(
        id: string,
        value: string,
        currency: string,
        invoiceId?: string,
        reason?: string,
        description?: string
    ) {

        super();

        this._id = id;

        this._value = value;

        this._currency = currency;

        this._invoiceId = invoiceId;

        this._description = description;

        this._reason = reason;
    }

    public getPath(): string {

        return `/v1/payments/sale/${this._id}/refund`;
    }

    public getBody(): string {

        return JSON.stringify({
            amount: {

                total: this._value,
                currency: this._currency
            },
            invoice_number: this._invoiceId,
            reason: this._reason || "",
            description: this._description || ""
        });
    }

    public getMethod(): "POST" {

        return "POST";
    }

    public parseResponse(
        code: number,
        headers: Record<string, string | string[]>,
        body: string
    ): Payments.IRefundInfo {

        return JSON.parse(body);
    }
}
