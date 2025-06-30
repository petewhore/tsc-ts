import { Credentials } from '../types/Credentials.js';
import { PaginationType } from '../types/Pagination.js';

export interface User {
  id: string;
  name: string;
  fullName?: string;
  email?: string;
  siteRole: string;
  locale?: string;
  language?: string;
  lastLogin?: string;
  authSetting?: string;
}

export class UsersMethods {
  constructor(private baseUrl: string, private creds: Credentials) {}

  async listUsers(params: {
    siteId: string;
    filter?: string;
    pageSize?: number;
    pageNumber?: number;
  }): Promise<{ pagination: PaginationType; users: User[] }> {
    // TODO: Implement actual API call
    void params;
    throw new Error('listUsers method not yet implemented');
  }

  async getUser(siteId: string, userId: string): Promise<{ user: User }> {
    // TODO: Implement actual API call
    void siteId; void userId;
    throw new Error('getUser method not yet implemented');
  }

  async getUserByName(siteId: string, username: string): Promise<{ user: User } | null> {
    // TODO: Implement actual API call
    void siteId; void username;
    throw new Error('getUserByName method not yet implemented');
  }

  async createUser(params: {
    siteId: string;
    name: string;
    siteRole: string;
    authSetting?: string;
  }): Promise<{ user: User }> {
    // TODO: Implement actual API call
    void params;
    throw new Error('createUser method not yet implemented');
  }

  async updateUser(params: {
    siteId: string;
    userId: string;
    fullName?: string;
    email?: string;
    siteRole?: string;
    authSetting?: string;
  }): Promise<{ user: User }> {
    // TODO: Implement actual API call
    void params;
    throw new Error('updateUser method not yet implemented');
  }

  async deleteUser(params: {
    siteId: string;
    userId: string;
  }): Promise<void> {
    // TODO: Implement actual API call
    void params;
    throw new Error('deleteUser method not yet implemented');
  }
}