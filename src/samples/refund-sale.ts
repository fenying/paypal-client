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

(async () => {

    const cli: Paypal.IClient = Paypal.createClient(
        require(`${__dirname}/../config.json`)
    );

    const viewSale = new Paypal.APIs.v1.Payments.ViewSale.Command(process.argv[2]);

    const sale = await cli.execute(viewSale);

    switch (sale.state) {
    case "denied":
    case "pending":
    case "refunded":
        console.error("This sale can not be refunded.");
        return;
    }

    let cmd = new Paypal.APIs.v1.Payments.RefundSale.Command(
        sale.id,
        process.argv[3],
        sale.amount.currency,
        process.argv[4],
        process.argv[5],
        process.argv[6]
    );

    console.log(JSON.stringify(await cli.execute(cmd), null, 2));

})().catch((e) => {

    console.error(e);
});
