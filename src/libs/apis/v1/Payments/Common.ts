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

import { HATEOASLink } from "../Common";

export interface BillingAddress {

    /**
     * Maximum length: 100.
     */
    "line1": string;

    /**
     * Maximum length: 100.
     */
    "line2": string;

    /**
     * Maximum length: 64.
     */
    "city": string;

    /**
     * Fixed length: 2.
     */
    "country_code": string;

    "postal_code": string;

    /**
     * Maximum length: 40.
     */
    "state": string;

    /**
     * Maximum length: 50.
     */
    "phone": string;

    /**
     * The address normalization status.
     * Returned only for payers from Brazil.
     */
    readonly "normalization_status"?: "UNKNOWN" | "UNNORMALIZED" |
                        "NORMALIZED" | "UNNORMALIZED_USER_PREFERRED";

    "type"?: string;
}

export interface IShippingAddress extends BillingAddress {

    /**
     * Maximum length: 127.
     */
    recipient_name: string;
}

export type CreditCardType = "visa" | "mastercard" | "discover" | "amex";

export interface IFundingInstrument {

    credit_card: {

        "number": string;

        "type": CreditCardType;

        "expire_month": number;

        "expire_year": number;

        "cvv2": string;

        "first_name": string;

        "last_name": string;

        "billing_address": BillingAddress;
    };

    credit_card_token: {

        "credit_card_id": string;

        "payer_id": string;

        "last4": string;

        "type": CreditCardType;

        "expire_month": 1 | 2 |3 | 4 | 5 |6 | 7 | 8 | 9 | 10 | 11 | 12;

        "expire_year": number;
    };
}

export interface IPayerInfo {

    /**
     * Maximum length: 127.
     */
    email: string;

    readonly salutation: string;

    readonly first_name: string;

    readonly middle_name: string;

    readonly last_name: string;

    readonly suffix: string;

    readonly payer_id: string;

    /**
     * Format: yyyy-mm-dd
     */
    birth_date: string;

    /**
     * Maximum length: 14.
     */
    tax_id: string;

    tax_id_type: "BR_CPF" | "BR_CNPJ";

    country_code: string;

    billing_address: BillingAddress;

    shipping_address: IShippingAddress;
}

export interface ISaleItem {

    sku?: string;

    name: string;

    description?: string;

    quantity: string;

    price: string;

    currency: string;

    tax?: string;
}

export interface ITransaction {

    amount: {

        currency: string;

        total: string;

        details: {

            subtotal: string;

            shipping: string;

            tax: string;

            handling_fee: string;

            shipping_discount: string;

            insurance: string;

            gift_wrap: string;
        };
    };

    payee: {

        email: string;

        merchant_id: string;

        payee_display_metadata: {

            email: string;

            display_phone: {

                "country_code": string;

                "number": string;
            };

            brand_name: string;
        };
    };

    /**
     * Maximum length: 127.
     */
    description: string;

    /**
     * Maximum length: 127.
     */
    custom: string;

    /**
     * Maximum length: 255.
     */
    readonly note_to_payee: string;

    /**
     * Maximum length: 127.
     */
    invoice_number: string;

    /**
     * Maximum length: 22.
     */
    soft_descriptor: string;

    /**
     * Maximum length: 2048.
     */
    notify_url: string;

    item_list: {

        "item_list": ISaleItem[];

        "shipping_address": IShippingAddress;

        /**
         * Length: 1 ~ 50.
         */
        "shipping_phone_number": string;
    };

    payment_options: {

        /**
         * Default: UNRESTRICTED
         */
        allowed_payment_method: "UNRESTRICTED" | "IMMEDIATE_PAY" |
                                "INSTANT_FUNDING_SOURCE";
    };

}

export type PaymentMethod = "credit_card" | "paypal" | "pay_upon_invoice" |
                            "carrier" | "alternate_payment" | "bank";

export interface IApplicationContext {

    /**
     * The name for store, displayed in checkout page.
     */
    "brand_name": string;

    /**
     * The language for checkout page.
     */
    "locale": string;

    /**
     * The language for checkout page.
     */
    "landing_page": "Billing" | "Login";

    /**
     * The shipping preference.
     *
     * Default: GET_FROM_FILE
     */
    "shipping_preference": "NO_SHIPPING" | "GET_FROM_FILE" |
        "SET_PROVIDED_ADDRESS";

    /**
     * - commit:    Display Pay Now button, and get money immediately.
     * - continue:  Display Continue button, and get money later.
     */
    "user_action": "commit" | "continue";
}

export type PayerStatus = "VERIFIED" | "UNVERIFIED";

export type PaymentType = "sale" | "authorize" | "order";

export type PaymentStatus = "created" | "approved" | "failed";

export type PaymentFailedReason = "UNABLE_TO_COMPLETE_TRANSACTION" |
                                    "INVALID_PAYMENT_METHOD" |
                                    "PAYER_CANNOT_PAY" |
                                    "CANNOT_PAY_THIS_PAYEE" |
                                    "REDIRECT_REQUIRED" |
                                    "PAYEE_FILTER_RESTRICTIONS";

export interface IPaymentRelSale {

    sale: ISaleInfo;
}

export interface IPaymentRelRefund {

    refund: IRefundInfo;
}

export interface IPaymentInfo {

    "id": string;

    "intent": PaymentType;

    "payer": {

        "payment_method": PaymentMethod;

        "status": PayerStatus;

        "funding_instruments": IFundingInstrument[];

        "payer_info": IPayerInfo;
    };

    "application_context": IApplicationContext;

    "transactions": ITransaction[];

    "experience_profile_id": string;

    /**
     * A free-form field that clients can use to send a note to the payer.
     *
     * Maximum length: 165.
     */
    "note_to_payer": string;

    "redirect_urls": {

        "return_url": string;

        "cancel_url": string;
    };

    readonly state: PaymentStatus;

    readonly failure_reason: PaymentFailedReason;

    readonly related_resources: Array<IPaymentRelRefund | IPaymentRelSale>;

    readonly create_time: string;

    readonly update_time: string;

    readonly links: HATEOASLink[];
}

export interface ITransactionCreation {

    amount: {

        currency: ITransaction["amount"]["currency"];

        total: ITransaction["amount"]["total"];

        details?: Partial<ITransaction["amount"]["details"]>;
    };

    custom?: ITransaction["custom"];

    description?: ITransaction["description"];

    invoice_number?: ITransaction["invoice_number"];

    payment_options?: Partial<ITransaction["payment_options"]>;

    item_list?: {

        items: ISaleItem[];

        shipping_address?: IShippingAddress;
    };
}

export interface IAmount {

    value: string;

    currency: string;
}

export type ProtectionEligibilityType = "ITEM_NOT_RECEIVED_ELIGIBLE" |
                                        "UNAUTHORIZED_PAYMENT_ELIGIBLE" |
                                        "UNAUTHORIZED_PAYMENT_ELIGIBLE" |
                                        "ITEM_NOT_RECEIVED_ELIGIBLE";

export type ProtectionEligibility = "ELIGIBLE" | "PARTIALLY_ELIGIBLE" |
                                    "INELIGIBLE";

export type ReasonCode = "CHARGEBACK" | "GUARANTEE" | "BUYER_COMPLAINT" |
                 "REFUND" | "UNCONFIRMED_SHIPPING_ADDRESS" | "ECHECK" |
                 "INTERNATIONAL_WITHDRAWAL" | "PAYMENT_REVIEW" |
                 "RECEIVING_PREFERENCE_MANDATES_MANUAL_ACTION" |
                 "REGULATORY_REVIEW" | "UNILATERAL" | "VERIFICATION_REQUIRED" |
                 "TRANSACTION_APPROVED_AWAITING_FUNDING";

export type SaleState = "pending" | "completed" | "partially_refunded" |
                        "refunded" | "denied";

export type PaymentMode = "INSTANT_TRANSFER" | "MANUAL_BANK_TRANSFER" |
                          "DELAYED_TRANSFER" | "ECHECK";

export interface ISaleInfo {

    readonly id: string;

    readonly purchase_unit_reference_id?: string;

    readonly state: SaleState;

    amount: IAmount;

    transaction_fee: IAmount;

    readonly billing_agreement_id?: string;

    readonly parent_payment?: string;

    readonly invoice_number?: string;

    readonly reason_code: ReasonCode;

    readonly protection_eligibility: ProtectionEligibility;

    readonly payment_mode?: PaymentMode;

    readonly protection_eligibility_type: string;

    readonly payment_hold_status?: "HELD";

    readonly create_time: string;

    readonly update_time: string;

    readonly clearing_time: string;

    readonly links: HATEOASLink[];
}

export type RefundStatus = "pending" | "completed" | "cancelled" | "failed";

export interface IRefundInfo {

    readonly id: string;

    readonly amount: IAmount;

    readonly refund_from_received_amount: IAmount;

    readonly refund_from_transaction_fee: IAmount;

    readonly total_refunded_amount: IAmount;

    readonly refund_to_payer: IAmount;

    sale_id: string;

    readonly state: RefundStatus;

    reason: string;

    description: string;

    invoice_number: string;

    readonly capture_id: string;

    readonly parent_payment: string;

    readonly create_time: string;

    readonly update_time: string;

    readonly links: HATEOASLink[];
}
