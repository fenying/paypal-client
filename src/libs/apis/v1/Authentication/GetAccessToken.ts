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

import * as Common from "../Common";

export interface TokenInfo {

    /**
     * The privileges scope of access-token.
     */
    "scope": string[];

    /**
     * The nonce of access-token.
     */
    "nonce": string;

    /**
     * The content of access-token.
     */
    "access_token": string;

    /**
     * The type of access-token.
     */
    "token_type": "Bearer";

    /**
     * The unique ID of app.
     */
    "app_id": string;

    /**
     * The expires of access-token, in seconds.
     */
    "expires_in": number;
}

export class Command
extends Common.AbstractCommand<TokenInfo> {

    public getPath(): string {

        return "/v1/oauth2/token";
    }

    public getBody(): string {

        return "grant_type=client_credentials";
    }

    public getMethod(): "POST" {

        return "POST";
    }

    public parseResponse(
        code: number,
        headers: Record<string, string | string[]>,
        body: string
    ): TokenInfo {

        let ret = JSON.parse(body);

        ret.scope = ret.scope.split(" ");

        return ret;
    }

    public getContentType(): string {

        return "application/x-www-form-urlencoded";
    }

    public isTokenRequired(): boolean {

        return false;
    }
}
