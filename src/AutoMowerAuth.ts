import { AutoMowerAccessToken } from './AutoMowerAccessToken.js';

export type AutoMowerAuthConfig = {
  apiKey: string;
  clientSecret: string;
};

export class AutoConnectWrongCredentialsError extends Error {}
export class AutoConnectAuthError extends Error {}

export class AutoConnectAuth {
  public readonly apiKey: string;
  private clientSecret: string;
  private accessToken: AutoMowerAccessToken;

  public constructor(config: AutoMowerAuthConfig) {
    this.apiKey = config.apiKey;
    this.clientSecret = config.clientSecret;
  }

  public async getValidAccessToken(): Promise<AutoMowerAccessToken> {
    if (!this.accessToken || this.accessToken.isExpired()) {
      // Retieve new accessToken
      this.accessToken = await AutoMowerAccessToken.retrieveNew(this.apiKey, this.clientSecret);
    }

    return this.accessToken;
  }
}
