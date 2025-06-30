import { AuthConfig } from '../types/AuthConfig.js';

export class AuthenticationMethods {
  constructor(private baseUrl: string) {}

  async signIn(authConfig: AuthConfig): Promise<any> {
    // TODO: Implement actual authentication
    void authConfig;
    return {
      credentials: {
        token: 'mock-token',
        site: { id: 'mock-site-id' },
        user: { id: 'mock-user-id' }
      }
    };
  }

  async signOut(): Promise<void> {
    // TODO: Implement actual sign out
  }

  async getServerInfo(): Promise<any> {
    // TODO: Implement actual server info
    return {
      serverInfo: {
        productVersion: '2023.3',
        buildNumber: '20233.0.0'
      }
    };
  }
}