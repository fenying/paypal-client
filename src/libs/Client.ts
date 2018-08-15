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

import * as Common from "./Common";
import * as Http from "@litert/http";
import * as APIs from "./apis";

const PAYPAL_HOSTS = {

    "sandbox": "api.sandbox.paypal.com",
    "live": "api.paypal.com"
};

class Client
implements Common.IClient {

    private _credentials: Common.IClientCredential;

    private _client: Http.IHttpClient;

    private _host: string;

    private _tokens!: APIs.v1.Authentication.GetAccessToken.TokenInfo;

    public constructor(credentials: Common.IClientCredential) {

        this._credentials = credentials;

        this._client = Http.createClient();

        this._host = PAYPAL_HOSTS[credentials.environment || "sandbox"];
    }

    public async authenticate(): Promise<void> {

        let cmd = new APIs.v1.Authentication.GetAccessToken.Command();

        let httpResult = await this._client.request({

            url: {
                host: this._host,
                path: cmd.getPath(),
                https: true
            },

            auth: {
                type: "basic",
                username: this._credentials.clientId,
                password: this._credentials.clientSecret
            },

            method: cmd.getMethod(),

            data: cmd.getBody(),

            dataType: cmd.getContentType(),

            headers: {

                "Accept": "application/json"
            }
        });

        this._tokens = cmd.parseResponse(
            httpResult.code,
            httpResult.headers,
            httpResult.data.toString()
        );

        this._tokens.expires_in = this._tokens.expires_in * 1000 + Date.now();
    }

    public async execute(cmd: Common.ICommand<any>): Promise<any> {

        if (!this.isAccessTokenReady()) {

            await this.authenticate();
        }

        let httpResult = await this._client.request({

            url: {
                host: this._host,
                path: cmd.getPath(),
                https: true
            },

            auth: {
                type: "bearer",
                token: this._tokens.access_token
            },

            method: cmd.getMethod(),

            data: cmd.getBody() || undefined,

            dataType: cmd.getContentType(),

            headers: {

                "Accept": "application/json"
            }
        });

        if (httpResult.code >= 400) {

            let obj: any;

            if (httpResult.data.length) {

                let resp = JSON.parse(httpResult.data.toString());

                if (resp.message) {

                    obj = new Error(resp.message);

                    obj.name = resp.name;

                    obj.informationLink = resp.information_link;

                    if (resp.debug_id) {

                        obj.debugId = resp.debug_id;
                    }

                    if (resp.details) {

                        obj.details = resp.details;
                    }
                }
                else if (resp.error) {

                    obj = new Error(resp.error_description);

                    obj.name = resp.error;
                }
            }
            else {

                obj = new Error(`Unexpected HTTP ${httpResult.code} error.`);
            }

            obj.http = {

                statusCode: httpResult.code,
                headers: httpResult.headers
            };

            throw obj;
        }

        return cmd.parseResponse(
            httpResult.code,
            httpResult.headers,
            httpResult.data.length ? httpResult.data.toString() : "null"
        );
    }

    public get accessToken(): string {

        if (!this.isAccessTokenReady()) {

            return "";
        }

        return this._tokens.access_token;
    }

    public get scopes(): string[] {

        if (!this.isAccessTokenReady()) {

            return [];
        }

        return this._tokens.scope;
    }

    public isAccessTokenReady(): boolean {

        return !!this._tokens && this._tokens.expires_in > Date.now();
    }
}

export function createClient(
    credentials: Common.IClientCredential
): Common.IClient {

    return new Client(credentials);
}
