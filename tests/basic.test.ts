import { describe, it, expect } from 'vitest';
import { TableauServer, PersonalAccessTokenAuth, UserItem, WorkbookItem } from '../src/index.js';

describe('TableauServer', () => {
  it('should create server instance', () => {
    const server = new TableauServer('https://your-server.com');
    expect(server).toBeDefined();
    expect(server.isSignedIn).toBe(false);
  });

  it('should create PersonalAccessTokenAuth', () => {
    const auth = new PersonalAccessTokenAuth('token-name', 'token-value', 'site-id');
    expect(auth.name).toBe('token-name');
    expect(auth.site).toBe('site-id');
  });

  it('should create UserItem', () => {
    const user = new UserItem({
      name: 'testuser',
      siteRole: 'Viewer'
    });
    expect(user.name).toBe('testuser');
    expect(user.siteRole).toBe('Viewer');
    expect(user.authSetting).toBe('ServerDefault');
  });

  it('should create WorkbookItem', () => {
    const workbook = new WorkbookItem({
      name: 'Test Workbook',
      contentUrl: 'test-workbook',
      showTabs: true
    });
    expect(workbook.name).toBe('Test Workbook');
    expect(workbook.contentUrl).toBe('test-workbook');
    expect(workbook.showTabs).toBe(true);
  });
});

describe('Managers', () => {
  it('should have access to managers', () => {
    const server = new TableauServer('https://your-server.com');
    expect(server.users).toBeDefined();
    expect(server.workbooks).toBeDefined();
    expect(server.datasources).toBeDefined();
    expect(server.projects).toBeDefined();
    expect(server.groups).toBeDefined();
  });
});

describe('Authentication', () => {
  it('should have auth methods', () => {
    const server = new TableauServer('https://your-server.com');
    expect(server.auth.signIn).toBeDefined();
    expect(server.auth.signOut).toBeDefined();
  });
});