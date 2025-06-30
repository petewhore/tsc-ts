import { describe, it, expect } from 'vitest';
import { 
  TableauServer, 
  PersonalAccessTokenAuth, 
  UserItem, 
  WorkbookItem,
  DatasourceItem,
  ProjectItem,
  GroupItem,
  ViewItem 
} from '../src/index.js';

describe('End-to-End Testing', () => {
  describe('Module Imports', () => {
    it('should import all main classes', () => {
      expect(TableauServer).toBeDefined();
      expect(PersonalAccessTokenAuth).toBeDefined();
      expect(UserItem).toBeDefined();
      expect(WorkbookItem).toBeDefined();
      expect(DatasourceItem).toBeDefined();
      expect(ProjectItem).toBeDefined();
      expect(GroupItem).toBeDefined();
      expect(ViewItem).toBeDefined();
    });

    it('should create instances without errors', () => {
      expect(() => new TableauServer('https://test-server.com')).not.toThrow();
      expect(() => new PersonalAccessTokenAuth('name', 'value')).not.toThrow();
      expect(() => new UserItem({ name: 'test', siteRole: 'Viewer' })).not.toThrow();
    });
  });

  describe('TableauServer Class', () => {
    let server: TableauServer;

    beforeEach(() => {
      server = new TableauServer('https://test-server.tableau.com');
    });

    it('should initialize with correct properties', () => {
      expect(server).toBeInstanceOf(TableauServer);
      expect(server.isSignedIn).toBe(false);
    });

    it('should have auth methods', () => {
      expect(server.auth).toBeDefined();
      expect(server.auth.signIn).toBeInstanceOf(Function);
      expect(server.auth.signOut).toBeInstanceOf(Function);
    });

    it('should have manager properties', () => {
      expect(server.users).toBeDefined();
      expect(server.workbooks).toBeDefined();
      expect(server.datasources).toBeDefined();
      expect(server.projects).toBeDefined();
      expect(server.groups).toBeDefined();
    });

    it('should throw error when accessing siteId without sign in', () => {
      expect(() => server.siteId).toThrow('Not signed in');
    });
  });

  describe('PersonalAccessTokenAuth', () => {
    it('should create auth with required parameters', () => {
      const auth = new PersonalAccessTokenAuth('token-name', 'token-value');
      expect(auth.name).toBe('token-name');
      expect(auth.site).toBeUndefined();
    });

    it('should create auth with site parameter', () => {
      const auth = new PersonalAccessTokenAuth('token-name', 'token-value', 'site-id');
      expect(auth.name).toBe('token-name');
      expect(auth.site).toBe('site-id');
    });

    it('should convert to AuthConfig correctly', () => {
      const auth = new PersonalAccessTokenAuth('test-token', 'test-value', 'test-site');
      const config = auth.toAuthConfig();
      
      expect(config.username).toBe('test-token');
      expect(config.token_name).toBe('test-token');
      expect(config.token_value).toBe('test-value');
      expect(config.site_id).toBe('test-site');
    });
  });

  describe('Item Classes', () => {
    describe('UserItem', () => {
      it('should create user with required fields', () => {
        const user = new UserItem({
          name: 'testuser@example.com',
          siteRole: 'Creator'
        });

        expect(user.name).toBe('testuser@example.com');
        expect(user.siteRole).toBe('Creator');
        expect(user.authSetting).toBe('ServerDefault');
        expect(user.id).toBeUndefined();
      });

      it('should create user with all fields', () => {
        const lastLogin = new Date('2023-01-01');
        const user = new UserItem({
          id: 'user-123',
          name: 'testuser@example.com',
          fullName: 'Test User',
          email: 'test@example.com',
          siteRole: 'Explorer',
          locale: 'en_US',
          language: 'en',
          lastLogin: lastLogin,
          authSetting: 'SAML'
        });

        expect(user.id).toBe('user-123');
        expect(user.fullName).toBe('Test User');
        expect(user.email).toBe('test@example.com');
        expect(user.locale).toBe('en_US');
        expect(user.language).toBe('en');
        expect(user.lastLogin).toBe(lastLogin);
        expect(user.authSetting).toBe('SAML');
      });

      it('should have toString method', () => {
        const user = new UserItem({
          id: 'user-123',
          name: 'testuser',
          siteRole: 'Viewer'
        });
        
        expect(user.toString()).toBe("UserItem(name='testuser', id='user-123', siteRole='Viewer')");
      });
    });

    describe('WorkbookItem', () => {
      it('should create workbook with required fields', () => {
        const workbook = new WorkbookItem({
          name: 'Test Workbook',
          contentUrl: 'test-workbook'
        });

        expect(workbook.name).toBe('Test Workbook');
        expect(workbook.contentUrl).toBe('test-workbook');
        expect(workbook.showTabs).toBe(false);
      });

      it('should create workbook with all fields', () => {
        const createdAt = new Date('2023-01-01');
        const updatedAt = new Date('2023-01-02');
        
        const workbook = new WorkbookItem({
          id: 'wb-123',
          name: 'Test Workbook',
          description: 'Test Description',
          contentUrl: 'test-workbook',
          showTabs: true,
          size: 1024,
          createdAt: createdAt,
          updatedAt: updatedAt,
          projectId: 'proj-123',
          ownerId: 'user-123'
        });

        expect(workbook.id).toBe('wb-123');
        expect(workbook.description).toBe('Test Description');
        expect(workbook.showTabs).toBe(true);
        expect(workbook.size).toBe(1024);
        expect(workbook.createdAt).toBe(createdAt);
        expect(workbook.updatedAt).toBe(updatedAt);
        expect(workbook.projectId).toBe('proj-123');
        expect(workbook.ownerId).toBe('user-123');
      });
    });

    describe('DatasourceItem', () => {
      it('should create datasource correctly', () => {
        const datasource = new DatasourceItem({
          name: 'Test Datasource',
          contentUrl: 'test-datasource'
        });

        expect(datasource.name).toBe('Test Datasource');
        expect(datasource.contentUrl).toBe('test-datasource');
        expect(datasource.toString()).toBe("DatasourceItem(name='Test Datasource', id='undefined', contentUrl='test-datasource')");
      });
    });

    describe('ProjectItem', () => {
      it('should create project correctly', () => {
        const project = new ProjectItem({
          name: 'Test Project'
        });

        expect(project.name).toBe('Test Project');
        expect(project.toString()).toBe("ProjectItem(name='Test Project', id='undefined')");
      });
    });

    describe('GroupItem', () => {
      it('should create group correctly', () => {
        const group = new GroupItem({
          name: 'Test Group'
        });

        expect(group.name).toBe('Test Group');
        expect(group.toString()).toBe("GroupItem(name='Test Group', id='undefined')");
      });
    });

    describe('ViewItem', () => {
      it('should create view correctly', () => {
        const view = new ViewItem({
          name: 'Test View',
          contentUrl: 'test-view'
        });

        expect(view.name).toBe('Test View');
        expect(view.contentUrl).toBe('test-view');
        expect(view.toString()).toBe("ViewItem(name='Test View', id='undefined', contentUrl='test-view')");
      });
    });
  });

  describe('Manager Classes', () => {
    let server: TableauServer;

    beforeEach(() => {
      server = new TableauServer('https://test-server.com');
    });

    it('should create managers on first access', () => {
      const usersManager = server.users;
      const workbooksManager = server.workbooks;
      const datasourcesManager = server.datasources;
      const projectsManager = server.projects;
      const groupsManager = server.groups;

      expect(usersManager).toBeDefined();
      expect(workbooksManager).toBeDefined();
      expect(datasourcesManager).toBeDefined();
      expect(projectsManager).toBeDefined();
      expect(groupsManager).toBeDefined();
    });

    it('should return same manager instance on subsequent access', () => {
      const usersManager1 = server.users;
      const usersManager2 = server.users;
      
      expect(usersManager1).toBe(usersManager2);
    });

    it('should have all expected methods on managers', () => {
      expect(server.users.get).toBeInstanceOf(Function);
      expect(server.users.getById).toBeInstanceOf(Function);
      expect(server.users.create).toBeInstanceOf(Function);
      expect(server.users.update).toBeInstanceOf(Function);
      expect(server.users.delete).toBeInstanceOf(Function);

      expect(server.workbooks.get).toBeInstanceOf(Function);
      expect(server.workbooks.update).toBeInstanceOf(Function);
      expect(server.workbooks.delete).toBeInstanceOf(Function);

      expect(server.projects.get).toBeInstanceOf(Function);
      expect(server.projects.create).toBeInstanceOf(Function);
      expect(server.projects.update).toBeInstanceOf(Function);
      expect(server.projects.delete).toBeInstanceOf(Function);
    });
  });

  describe('Error Handling', () => {
    let server: TableauServer;

    beforeEach(() => {
      server = new TableauServer('https://test-server.com');
    });

    it('should handle manager method calls when not signed in gracefully', async () => {
      // The managers handle "not signed in" gracefully by returning empty results
      const usersResult = await server.users.get();
      expect(usersResult.users).toEqual([]);
      expect(usersResult.pagination.totalAvailable).toBe(0);

      const workbooksResult = await server.workbooks.get();
      expect(workbooksResult.workbooks).toEqual([]);
      
      const datasourcesResult = await server.datasources.get();
      expect(datasourcesResult.datasources).toEqual([]);
    });

    it('should throw error when accessing siteId without sign in', () => {
      expect(() => server.siteId).toThrow('Not signed in');
    });

    it('should handle invalid user creation', () => {
      expect(() => new UserItem({ name: '', siteRole: 'InvalidRole' })).not.toThrow();
      // The validation would happen at the API level, not in the item constructor
    });
  });

  describe('Type Safety', () => {
    it('should maintain type safety for all classes', () => {
      const server = new TableauServer('https://test.com');
      const auth = new PersonalAccessTokenAuth('name', 'value');
      const user = new UserItem({ name: 'test', siteRole: 'Viewer' });

      // TypeScript should ensure these are properly typed
      expect(typeof server.isSignedIn).toBe('boolean');
      expect(typeof auth.name).toBe('string');
      expect(typeof user.name).toBe('string');
      expect(typeof user.siteRole).toBe('string');
    });
  });

  describe('Python TSC Compatibility', () => {
    it('should match Python TSC patterns', () => {
      const server = new TableauServer('https://test.com');
      
      // These should match Python TSC patterns:
      // server.users.get() -> { users: UserItem[], pagination: Pagination }
      // server.auth.sign_in(auth) -> server.auth.signIn(auth)
      // TSC.PersonalAccessTokenAuth -> PersonalAccessTokenAuth
      
      expect(server.users).toBeDefined();
      expect(server.auth.signIn).toBeDefined();
      expect(PersonalAccessTokenAuth).toBeDefined();
    });

    it('should handle pagination like Python TSC', async () => {
      // Python TSC returns (items, pagination)
      // TypeScript TSC returns { items, pagination }
      // Both patterns should be supported
      const server = new TableauServer('https://test.com');
      
      // The get() method should return { users, pagination }
      const result = await server.users.get();
      expect(result).toHaveProperty('users');
      expect(result).toHaveProperty('pagination');
      expect(Array.isArray(result.users)).toBe(true);
      expect(result.pagination).toHaveProperty('pageNumber');
      expect(result.pagination).toHaveProperty('pageSize');
      expect(result.pagination).toHaveProperty('totalAvailable');
    });
  });
});