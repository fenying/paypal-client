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

export interface ICommand<R> {

    readonly version: string;

    getPath(): string;

    getBody(): string | Buffer | null;

    getContentType(): string;

    getMethod(): "GET" | "PUT" | "PATCH" | "POST" | "DELETE";

    parseResponse(
        code: number,
        headers: Record<string, string | string[]>,
        body: string
    ): R;

    isTokenRequired(): boolean;
}

export interface IError
extends Error {

    name: string;

    message: string;

    informationLink?: string;

    debugId?: string;

    details?: any[];

    http: {

        statusCode: number;

        headers: Record<string, string[]>;
    };
}

export interface IClient {

    readonly accessToken: string;

    readonly scopes: string[];

    /**
     * Execute authentication to get the access-token.
     */
    authenticate(): Promise<void>;

    /**
     * Check if the access-token is ready.
     */
    isAccessTokenReady(): boolean;

    /**
     * Request an API, and return the result.
     *
     * @param cmd The API command object.
     */
    execute<T>(cmd: ICommand<T>): Promise<T>;
}

export interface IClientCredential {

    /**
     * The unique ID of client.
     */
    "clientId": string;

    /**
     * The secret code of client.
     */
    "clientSecret": string;

    /**
     * The environment of Paypal to be used.
     *
     * default: sandbox
     */
    "environment"?: "sandbox" | "live";
}
