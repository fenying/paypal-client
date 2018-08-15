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

// tslint:disable:no-console
import * as Paypal from "../libs";

async function createPayment(cli: Paypal.IClient) {

    let cmd = new Paypal.APIs.v1.Payments.CreateSale.Command(
        "https://localhost/?success",
        "https://localhost/?failed",
        "hello world!"
    );

    cmd.addTransaction({
        "amount": {
            "total": "5.12",
            "currency": "USD",
            "details": {
                "subtotal": "5.00",
                "tax": "0.12"
            }
        },
        "description": "Hello.",
        "custom": "FFAACC",
        "invoice_number": (
            Math.ceil(Math.random() * 0xFFFFFFF).toString(16) +
            Math.ceil(Math.random() * 0xFFFFFFF).toString(16)
        ).padStart(16, "0"),
        "payment_options": {
            "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
        },
        "item_list": {
            "items": [
                {
                    "name": "Wizard Hat",
                    "description": "A brown hat for wizards.",
                    "quantity": "1",
                    "price": "5.00",
                    "tax": "0.12",
                    "sku": "SUPER-WIZARD-HAT",
                    "currency": "USD"
                }
            ]
        }
    });

    cmd.setApplicationContext({
        brand_name: "Magic Store",
        user_action: "commit",
        shipping_preference: "NO_SHIPPING"
    });

    return await cli.execute(cmd);
}

(async () => {

    const cli: Paypal.IClient = Paypal.createClient(
        require(`${__dirname}/../config.json`)
    );

    console.log(JSON.stringify(await createPayment(cli), null, 2));

})().catch((e) => {

    console.error(e);
});
