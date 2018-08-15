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

import * as VerCom from "../Common";
import * as Payments from "./Common";

export interface SalePayment
extends Payments.IPaymentInfo {

    intent: "sale";
}

const DEFAULT_PAYMENT_METHOD: Payments.PaymentMethod = "paypal";

/**
 * Make all properties in T optional
 */
type DeepPartial<T> = {

    [P in keyof T]?: DeepPartial<T[P]>;
};

export class Command
extends VerCom.AbstractCommand<Payments.IPaymentInfo> {

    private _paymentMethod: Payments.PaymentMethod;

    private _transactions: Payments.ITransaction[];

    private _returnURL: string;

    private _cancelURL: string;

    private _note?: string;

    private _appCtx?: Payments.IApplicationContext;

    public constructor(
        returnURL: string,
        cancelURL: string,
        note?: string
    ) {

        super();

        this._paymentMethod = DEFAULT_PAYMENT_METHOD;

        this._transactions = [];

        this._cancelURL = cancelURL;

        this._returnURL = returnURL;

        this._note = note;
    }

    public getPath(): string {

        return "/v1/payments/payment";
    }

    public getBody(): string {

        if (!this._transactions.length) {

            throw new Error("Invalid payment without transactions.");
        }

        const data: DeepPartial<Payments.IPaymentInfo> = {

            intent: "sale",

            payer: {

                payment_method: this._paymentMethod
            },

            transactions: this._transactions,

            note_to_payer: this._note,

            application_context: this._appCtx,

            redirect_urls: {

                return_url: this._returnURL,
                cancel_url: this._cancelURL
            }

        };

        return JSON.stringify(data);
    }

    public setApplicationContext(
        ctx: Partial<Payments.IApplicationContext>
    ): this {

        this._appCtx = ctx as any;

        return this;
    }

    public addTransaction(transaction: Payments.ITransactionCreation): this {

        this._transactions.push(transaction as any);

        return this;
    }

    public getMethod(): "POST" {

        return "POST";
    }

    public parseResponse(
        code: number,
        headers: Record<string, string | string[]>,
        body: string
    ): SalePayment {

        return JSON.parse(body);
    }
}
