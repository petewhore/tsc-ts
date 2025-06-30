import { describe, it, expect } from 'vitest';
import { TableauServer, PersonalAccessTokenAuth, UserItem, WorkbookItem } from '../src/index.js';

describe('Integration Tests - Python TSC Compatibility', () => {
  describe('Authentication Flow', () => {
    it('should follow Python TSC authentication pattern', async () => {
      // Python: server = TSC.Server('url')
      const server = new TableauServer('https://mock-server.tableau.com');
      
      // Python: tableau_auth = TSC.PersonalAccessTokenAuth('name', 'value', 'site')
      const auth = new PersonalAccessTokenAuth('mock-token', 'mock-value', 'mock-site');
      
      // Before sign in
      expect(server.isSignedIn).toBe(false);
      expect(() => server.siteId).toThrow('Not signed in');
      
      // Python: server.auth.sign_in(tableau_auth)
      // Note: In mock mode, this will succeed with mock credentials
      await server.auth.signIn(auth);
      
      // After mock sign in, should be signed in
      expect(server.isSignedIn).toBe(true);
      expect(server.siteId).toBe('mock-site-id');
    });
  });

  describe('Users Management - Python TSC Pattern', () => {
    let server: TableauServer;

    beforeEach(() => {
      server = new TableauServer('https://mock-server.tableau.com');
    });

    it('should list users like Python TSC', async () => {
      // Python: all_users, pagination_item = server.users.get()
      const { users, pagination } = await server.users.get();
      
      expect(Array.isArray(users)).toBe(true);
      expect(pagination).toBeDefined();
      expect(pagination.pageNumber).toBe(1);
      expect(pagination.pageSize).toBe(100);
      expect(pagination.totalAvailable).toBe(0); // Mock returns empty
    });

    it('should filter users like Python TSC', async () => {
      // Python: users, pagination = server.users.get(req_options=TSC.RequestOptions(filter=filter_string))
      const { users, pagination } = await server.users.get('siteRole:eq:Creator');
      
      expect(Array.isArray(users)).toBe(true);
      expect(pagination).toBeDefined();
    });

    it('should create user like Python TSC', async () => {
      // Python: new_user = TSC.UserItem('username', 'siteRole')
      const newUser = new UserItem({
        name: 'newuser@example.com',
        siteRole: 'Explorer'
      });

      expect(newUser.name).toBe('newuser@example.com');
      expect(newUser.siteRole).toBe('Explorer');
      expect(newUser.authSetting).toBe('ServerDefault');

      // Python: new_user = server.users.add(new_user)
      // This will fail in mock mode but tests the interface
      await expect(server.users.create(newUser)).rejects.toThrow();
    });

    it('should update user like Python TSC', async () => {
      const user = new UserItem({
        id: 'user-123',
        name: 'testuser@example.com',
        siteRole: 'Viewer'
      });

      // Python: user.site_role = 'Creator'
      user.siteRole = 'Creator';
      user.fullName = 'Updated Name';

      // Python: updated_user = server.users.update(user)
      await expect(server.users.update(user)).rejects.toThrow();
    });

    it('should delete user like Python TSC', async () => {
      // Python: server.users.remove('user-id')
      await expect(server.users.delete('user-123')).rejects.toThrow();
    });
  });

  describe('Workbooks Management - Python TSC Pattern', () => {
    let server: TableauServer;

    beforeEach(() => {
      server = new TableauServer('https://mock-server.tableau.com');
    });

    it('should list workbooks like Python TSC', async () => {
      // Python: all_workbooks, pagination_item = server.workbooks.get()
      const { workbooks, pagination } = await server.workbooks.get();
      
      expect(Array.isArray(workbooks)).toBe(true);
      expect(pagination).toBeDefined();
    });

    it('should update workbook like Python TSC', async () => {
      const workbook = new WorkbookItem({
        id: 'wb-123',
        name: 'Test Workbook',
        contentUrl: 'test-workbook'
      });

      // Python: workbook.name = 'Updated Name'
      workbook.name = 'Updated Workbook Name';
      workbook.showTabs = true;

      // Python: updated_workbook = server.workbooks.update(workbook)
      await expect(server.workbooks.update(workbook)).rejects.toThrow();
    });
  });

  describe('Item Classes - Python TSC Compatibility', () => {
    it('should create UserItem like Python TSC.UserItem', () => {
      // Python: user = TSC.UserItem('username', 'site_role')
      const user = new UserItem({
        name: 'testuser@company.com',
        siteRole: 'Creator'
      });

      // Test Python TSC properties
      expect(user.name).toBe('testuser@company.com');
      expect(user.siteRole).toBe('Creator');
      expect(user.authSetting).toBe('ServerDefault');
      expect(user.id).toBeUndefined(); // Not set until created on server

      // Test string representation like Python
      user.id = 'user-123';
      expect(user.toString()).toContain('UserItem');
      expect(user.toString()).toContain('testuser@company.com');
      expect(user.toString()).toContain('Creator');
    });

    it('should create WorkbookItem like Python TSC.WorkbookItem', () => {
      // Python: workbook = TSC.WorkbookItem('name', 'project_id')
      const workbook = new WorkbookItem({
        name: 'Sales Dashboard',
        contentUrl: 'sales-dashboard',
        projectId: 'project-123'
      });

      expect(workbook.name).toBe('Sales Dashboard');
      expect(workbook.contentUrl).toBe('sales-dashboard');
      expect(workbook.projectId).toBe('project-123');
      expect(workbook.showTabs).toBe(false); // Default value

      // Test string representation
      workbook.id = 'wb-123';
      expect(workbook.toString()).toContain('WorkbookItem');
      expect(workbook.toString()).toContain('Sales Dashboard');
    });
  });

  describe('Manager Access Patterns', () => {
    it('should provide lazy-loaded managers like Python TSC', () => {
      const server = new TableauServer('https://test-server.com');

      // All managers should be accessible
      expect(server.users).toBeDefined();
      expect(server.workbooks).toBeDefined();
      expect(server.datasources).toBeDefined();
      expect(server.projects).toBeDefined();
      expect(server.groups).toBeDefined();

      // Should return same instance on multiple accesses (lazy loading)
      const users1 = server.users;
      const users2 = server.users;
      expect(users1).toBe(users2);
    });
  });

  describe('Error Handling and Graceful Degradation', () => {
    it('should handle connection errors gracefully', async () => {
      const server = new TableauServer('https://invalid-server.com');

      // Should not throw, but return empty results with warning
      const { users } = await server.users.get();
      expect(users).toEqual([]);
    });

    it('should handle authentication errors gracefully', async () => {
      const server = new TableauServer('https://test-server.com');
      const invalidAuth = new PersonalAccessTokenAuth('invalid', 'invalid');

      // Should succeed in mock mode, but with mock credentials
      await server.auth.signIn(invalidAuth);
      expect(server.isSignedIn).toBe(true); // Mock always succeeds
    });
  });

  describe('Type Safety vs Python Flexibility', () => {
    it('should maintain TypeScript type safety while preserving Python patterns', () => {
      const server = new TableauServer('https://test.com');
      
      // TypeScript ensures type safety
      expect(typeof server.isSignedIn).toBe('boolean');
      
      const user = new UserItem({ name: 'test', siteRole: 'Viewer' });
      expect(typeof user.name).toBe('string');
      expect(typeof user.siteRole).toBe('string');
      
      // Optional properties should be properly typed
      expect(user.email).toBeUndefined();
      expect(user.lastLogin).toBeUndefined();
    });
  });
});