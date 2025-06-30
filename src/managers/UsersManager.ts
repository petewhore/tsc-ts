import { RestApi } from '../apis/RestApi.js';
import { UserItem } from '../items/UserItem.js';
import { Pagination } from '../types/Pagination.js';

/**
 * Manager for user operations.
 * Equivalent to Python TSC server.users.
 */
export class UsersManager {
  constructor(private restApi: RestApi) {}

  /**
   * Get all users on the site
   * @param filter - Optional filter string (field:operator:value)
   * @returns Promise containing users and pagination info
   */
  async get(filter?: string): Promise<{ users: UserItem[], pagination: Pagination }> {
    try {
      const response = await this.restApi.usersMethods.listUsers({
        siteId: this.restApi.siteId,
        filter: filter,
        pageSize: 100,
        pageNumber: 1
      });

      const users = (response.users || []).map(user => new UserItem({
        id: user.id,
        name: user.name,
        fullName: user.fullName,
        email: user.email,
        siteRole: user.siteRole,
        locale: user.locale,
        language: user.language,
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
        authSetting: user.authSetting
      }));

      return {
        users,
        pagination: new Pagination({
          pageNumber: response.pagination?.pageNumber || 1,
          pageSize: response.pagination?.pageSize || 100,
          totalAvailable: response.pagination?.totalAvailable || 0
        })
      };
    } catch (error) {
      console.warn('Users API not available:', error);
      return {
        users: [],
        pagination: new Pagination({ pageNumber: 1, pageSize: 100, totalAvailable: 0 })
      };
    }
  }

  /**
   * Get a specific user by ID
   */
  async getById(userId: string): Promise<UserItem> {
    const response = await this.restApi.usersMethods.getUser(this.restApi.siteId, userId);
    return new UserItem({
      id: response.user.id,
      name: response.user.name,
      fullName: response.user.fullName,
      email: response.user.email,
      siteRole: response.user.siteRole,
      locale: response.user.locale,
      language: response.user.language,
      lastLogin: response.user.lastLogin ? new Date(response.user.lastLogin) : undefined,
      authSetting: response.user.authSetting
    });
  }

  /**
   * Create a new user
   */
  async create(user: UserItem): Promise<UserItem> {
    const response = await this.restApi.usersMethods.createUser({
      siteId: this.restApi.siteId,
      name: user.name,
      siteRole: user.siteRole,
      authSetting: user.authSetting
    });

    return new UserItem({
      id: response.user.id,
      name: response.user.name,
      fullName: response.user.fullName,
      email: response.user.email,
      siteRole: response.user.siteRole,
      locale: response.user.locale,
      language: response.user.language,
      lastLogin: response.user.lastLogin ? new Date(response.user.lastLogin) : undefined,
      authSetting: response.user.authSetting
    });
  }

  /**
   * Update a user
   */
  async update(user: UserItem): Promise<UserItem> {
    if (!user.id) {
      throw new Error('User ID is required for update operation');
    }

    const response = await this.restApi.usersMethods.updateUser({
      siteId: this.restApi.siteId,
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      siteRole: user.siteRole,
      authSetting: user.authSetting
    });

    return new UserItem({
      id: response.user.id,
      name: response.user.name,
      fullName: response.user.fullName,
      email: response.user.email,
      siteRole: response.user.siteRole,
      locale: response.user.locale,
      language: response.user.language,
      lastLogin: response.user.lastLogin ? new Date(response.user.lastLogin) : undefined,
      authSetting: response.user.authSetting
    });
  }

  /**
   * Delete a user
   */
  async delete(userId: string): Promise<void> {
    await this.restApi.usersMethods.deleteUser({
      siteId: this.restApi.siteId,
      userId
    });
  }
}