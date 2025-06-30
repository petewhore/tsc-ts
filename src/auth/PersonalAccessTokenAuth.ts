import { AuthConfig } from '../types/AuthConfig.js';

/**
 * Personal Access Token authentication
 * Compatible with Python TSC PersonalAccessTokenAuth
 */
export class PersonalAccessTokenAuth {
  private readonly tokenName: string;
  private readonly tokenValue: string;
  private readonly siteId?: string;

  constructor(tokenName: string, tokenValue: string, siteId?: string) {
    this.tokenName = tokenName;
    this.tokenValue = tokenValue;
    this.siteId = siteId;
  }

  /**
   * Convert to AuthConfig format for API calls
   */
  toAuthConfig(): AuthConfig {
    return {
      username: this.tokenName,
      token_name: this.tokenName,
      token_value: this.tokenValue,
      site_id: this.siteId,
    };
  }

  /**
   * Get token name
   */
  get name(): string {
    return this.tokenName;
  }

  /**
   * Get site ID if provided
   */
  get site(): string | undefined {
    return this.siteId;
  }
}