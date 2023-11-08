import fetch from 'node-fetch';
import Moment from 'moment';
import { URLSearchParams } from 'url';
import { AutoConnectAuthError, AutoConnectWrongCredentialsError } from './AutoMowerAuth.js';

export type AutoConnectRawAccessTokenJson = {
  access_token: string;
  user_id: string;
  scope: string;
  expires_in: number;
};

export class AutoMowerAccessToken {
  public readonly expiresAt: Moment.Moment;
  public readonly accessToken: string;
  public readonly userId: string;
  public readonly scope: string;

  private constructor(json: AutoConnectRawAccessTokenJson) {
    this.accessToken = json.access_token;
    this.expiresAt = Moment.unix(Moment().unix() + json.expires_in);
    this.scope = json.scope;
    this.userId = json.user_id;
  }

  public isExpired(): boolean {
    const now = Moment();
    return this.expiresAt.isBefore(now.add(60, 'seconds'));
  }

  public static async retrieveNew(apiKey: string, clientSecret: string): Promise<AutoMowerAccessToken> {
    let json: AutoConnectRawAccessTokenJson;
    try {
      // Build body
      const params = new URLSearchParams();
      params.set('grant_type', 'client_credentials');
      params.set('client_id', apiKey);
      params.set('client_secret', clientSecret);

      // Request
      const res = await fetch('https://api.authentication.husqvarnagroup.dev/v1/oauth2/token', {
        method: 'POST',
        body: params
      });

      // Check response
      if (!res.ok) {
        // Body still containing JSON?
        let json: any;
        try {
          json = (await res.json()) as any;
        } catch (e) {}
        if (json) {
          if (json.error == 'invalid_client') {
            throw new AutoConnectWrongCredentialsError('ClientId or ClientSecret invalid');
          }
        }

        throw new AutoConnectAuthError('Could not retrieve OAuth token');
      }

      // Parse response
      json = (await res.json()) as AutoConnectRawAccessTokenJson;
    } catch (e) {
      throw new AutoConnectAuthError('Could not retrieve OAuth token', { cause: e });
    }

    // Check parsed result
    if (!json.access_token! && typeof json.access_token! === 'string') {
      throw new AutoConnectAuthError('Retrieved OAuth response does not contain access token');
    }
    if (!json.user_id! && typeof json.user_id! === 'string') {
      throw new AutoConnectAuthError('Retrieved OAuth response does not contain user id');
    }
    if (!json.scope! && typeof json.scope! === 'string') {
      throw new AutoConnectAuthError('Retrieved OAuth response does not contain scope');
    }
    if (!json.expires_in! && typeof json.expires_in! === 'number') {
      throw new AutoConnectAuthError('Retrieved OAuth response does not expiry time');
    }

    // Create access token
    return new AutoMowerAccessToken(json);
  }

  public toString(): string {
    return this.accessToken;
  }
}
