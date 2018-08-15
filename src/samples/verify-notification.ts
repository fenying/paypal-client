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

type SH_OPTS = "auth_algo" | "certificate_url" | "transmission_id" |
                "transmission_sigature" | "transmission_time" | "webhook_id" |
                "webhook_event";

(async () => {

    const cli: Paypal.IClient = Paypal.createClient(
        require(`${__dirname}/../config.json`)
    );

    const optValues: Record<SH_OPTS, string> = {} as any;
    const optNames: SH_OPTS[] = [
        "auth_algo", "certificate_url", "transmission_id",
        "transmission_sigature", "transmission_time", "webhook_id",
        "webhook_event"
    ];

    if (process.argv.length !== optNames.length * 2 + 2) {

        throw new Error("Invalid arguments.");
    }

    for (let i = 2; i < optNames.length * 2 + 2; i += 2) {

        if (
            !process.argv[i].startsWith("--") ||
            !optNames.includes(process.argv[i].substr(2) as any)
        ) {

            throw new Error(`Unknown option "${process.argv[i]}".`);
        }

        optValues[process.argv[i].substr(2) as SH_OPTS] = process.argv[i + 1];
    }

    let cmd = new Paypal.APIs.v1.Webhooks.VerifyNotification.Command(
        optValues.webhook_id,
        optValues.auth_algo,
        optValues.certificate_url,
        optValues.transmission_id,
        optValues.transmission_sigature,
        optValues.transmission_time,
        JSON.parse(optValues.webhook_event)
    );

    console.log(JSON.stringify(await cli.execute(cmd), null, 2));

})().catch((e) => {

    console.error(e);
});
