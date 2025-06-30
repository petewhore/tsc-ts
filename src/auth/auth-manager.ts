import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';
import {
  TableauServerConfig,
  AuthCredentials,
  PersonalAccessTokenCredentials,
  AuthResponse,
  ApiError,
} from '../types';

const parseXML = promisify(parseString);

export interface AuthManagerOptions extends TableauServerConfig {
  credentials?: AuthCredentials | PersonalAccessTokenCredentials;
}

export class AuthManager {
  private config: TableauServerConfig;
  private httpClient: AxiosInstance;
  private authToken?: string;
  private siteId?: string;
  private userId?: string;

  constructor(options: AuthManagerOptions) {
    this.config = {
      apiVersion: '3.21',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...options,
    };

    this.httpClient = axios.create({
      baseURL: `${this.config.serverUrl}/api/${this.config.apiVersion}`,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/xml',
        Accept: 'application/xml',
      },
    });

    // Set up response interceptor for error handling
    this.httpClient.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
        }
        return Promise.reject(this.parseTableauError(error));
      }
    );
  }

  /**
   * Sign in using username/password credentials
   */
  async signInWithCredentials(credentials: AuthCredentials): Promise<AuthResponse> {
    const requestBody = this.buildSignInXML(credentials);

    try {
      const response = await this.httpClient.post('/auth/signin', requestBody);
      const authData = await this.parseAuthResponse(response.data);
      
      this.setAuthData(authData);
      this.setAuthHeader();
      
      return authData;
    } catch (error) {
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Sign in using Personal Access Token
   */
  async signInWithPersonalAccessToken(credentials: PersonalAccessTokenCredentials): Promise<AuthResponse> {
    const requestBody = this.buildPATSignInXML(credentials);

    try {
      const response = await this.httpClient.post('/auth/signin', requestBody);
      const authData = await this.parseAuthResponse(response.data);
      
      this.setAuthData(authData);
      this.setAuthHeader();
      
      return authData;
    } catch (error) {
      throw new Error(`PAT Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Sign out and clear authentication data
   */
  async signOut(): Promise<void> {
    if (!this.authToken) {
      return;
    }

    try {
      await this.httpClient.post('/auth/signout');
    } catch (error) {
      // Ignore errors during signout
      console.warn('Error during signout:', error);
    } finally {
      this.clearAuthToken();
    }
  }

  /**
   * Check if currently authenticated
   */
  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  /**
   * Get the current auth token
   */
  getAuthToken(): string | undefined {
    return this.authToken;
  }

  /**
   * Get the current site ID
   */
  getSiteId(): string | undefined {
    return this.siteId;
  }

  /**
   * Get the current user ID
   */
  getUserId(): string | undefined {
    return this.userId;
  }

  /**
   * Get the configured HTTP client
   */
  getHttpClient(): AxiosInstance {
    return this.httpClient;
  }

  /**
   * Refresh the authentication token (re-authenticate)
   */
  async refreshToken(credentials: AuthCredentials | PersonalAccessTokenCredentials): Promise<AuthResponse> {
    this.clearAuthToken();
    
    if ('tokenName' in credentials) {
      return this.signInWithPersonalAccessToken(credentials);
    } else {
      return this.signInWithCredentials(credentials);
    }
  }

  private buildSignInXML(credentials: AuthCredentials): string {
    const siteElement = credentials.contentUrl 
      ? `<site contentUrl="${credentials.contentUrl}" />`
      : '<site />';

    return `<?xml version="1.0" encoding="UTF-8"?>
      <tsRequest>
        <credentials name="${credentials.username}" password="${credentials.password}">
          ${siteElement}
        </credentials>
      </tsRequest>`;
  }

  private buildPATSignInXML(credentials: PersonalAccessTokenCredentials): string {
    const siteElement = credentials.contentUrl 
      ? `<site contentUrl="${credentials.contentUrl}" />`
      : '<site />';

    return `<?xml version="1.0" encoding="UTF-8"?>
      <tsRequest>
        <credentials personalAccessTokenName="${credentials.tokenName}" personalAccessTokenSecret="${credentials.tokenValue}">
          ${siteElement}
        </credentials>
      </tsRequest>`;
  }

  private async parseAuthResponse(xmlData: string): Promise<AuthResponse> {
    try {
      const result = await parseXML(xmlData);
      const credentials = result.tsResponse?.credentials?.[0];

      if (!credentials) {
        throw new Error('Invalid authentication response format');
      }

      return {
        token: credentials.$.token,
        siteId: credentials.site?.[0]?.$.id || '',
        userId: credentials.user?.[0]?.$.id || '',
        credentials: {
          token: credentials.$.token,
          site: {
            id: credentials.site?.[0]?.$.id || '',
            contentUrl: credentials.site?.[0]?.$.contentUrl || '',
          },
          user: {
            id: credentials.user?.[0]?.$.id || '',
          },
        },
      };
    } catch (error) {
      throw new Error(`Failed to parse authentication response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private setAuthData(authData: AuthResponse): void {
    this.authToken = authData.token;
    this.siteId = authData.siteId;
    this.userId = authData.userId;
  }

  private setAuthHeader(): void {
    if (this.authToken) {
      this.httpClient.defaults.headers.common['X-Tableau-Auth'] = this.authToken;
    }
  }

  private clearAuthToken(): void {
    this.authToken = undefined;
    this.siteId = undefined;
    this.userId = undefined;
    delete this.httpClient.defaults.headers.common['X-Tableau-Auth'];
  }

  private parseTableauError(error: any): ApiError {
    const defaultError: ApiError = {
      code: 'UNKNOWN_ERROR',
      summary: 'An unknown error occurred',
      detail: error.message || 'No additional details available',
    };

    if (!error.response?.data) {
      return defaultError;
    }

    try {
      // Try to parse XML error response
      parseString(error.response.data, (parseError, result) => {
        if (parseError || !result.tsResponse?.error?.[0]) {
          return defaultError;
        }

        const errorElement = result.tsResponse.error[0].$;
        return {
          code: errorElement.code || 'UNKNOWN_ERROR',
          summary: errorElement.summary || 'An error occurred',
          detail: errorElement.detail || 'No additional details available',
        };
      });
    } catch {
      return defaultError;
    }

    return defaultError;
  }
}