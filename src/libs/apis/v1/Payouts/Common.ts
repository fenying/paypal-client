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

export interface IPayout {
    "batch_header": {

        "payout_batch_id": string;

        "batch_status": "PENDING" | "ACKNOWLEDGED" | "DENIED" | "PROCESSING" |
                        "SUCCESS" | "NEW" | "CANCELED";

        "time_created": string;

        "time_completed": string;

        "sender_batch_header": {
            "sender_batch_id": string;
            "email_subject": string;
        };

        "amount": {

            "value": string;

            "currency": string;
        };
    };
}

export interface IPayoutRequest {

    "sender_batch_header": {

        "sender_batch_id": string;

        "email_subject": string;

        "email_message": string;
    };

    "items": IPayoutItem[];
}

export interface IPayoutItem {

    "recipient_type": "EMAIL";

    "amount": {

        "value": string;

        "currency": string;
    };

    "note": string;

    "sender_item_id": string;

    /**
     * The E-Mail address of receiver.
     */
    "receiver": string;
}
