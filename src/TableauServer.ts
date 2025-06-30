import { RestApi } from './apis/RestApi.js';
import { PersonalAccessTokenAuth } from './auth/PersonalAccessTokenAuth.js';
import { AuthConfig } from './types/AuthConfig.js';
import { UsersManager } from './managers/UsersManager.js';
import { WorkbooksManager } from './managers/WorkbooksManager.js';
import { DatasourcesManager } from './managers/DatasourcesManager.js';
import { ProjectsManager } from './managers/ProjectsManager.js';
import { GroupsManager } from './managers/GroupsManager.js';

/**
 * Main entry point for Tableau Server Client
 * Compatible with Python tableauserverclient patterns
 */
export class TableauServer {
  private _restApi: RestApi;
  private _usersManager?: UsersManager;
  private _workbooksManager?: WorkbooksManager;
  private _datasourcesManager?: DatasourcesManager;
  private _projectsManager?: ProjectsManager;
  private _groupsManager?: GroupsManager;

  constructor(serverUrl: string, useServerVersion: boolean = true) {
    this._restApi = new RestApi(serverUrl);
  }

  /**
   * Authentication methods
   */
  get auth() {
    return {
      signIn: async (authConfig: PersonalAccessTokenAuth | AuthConfig): Promise<void> => {
        if (authConfig instanceof PersonalAccessTokenAuth) {
          await this._restApi.signIn(authConfig.toAuthConfig());
        } else {
          await this._restApi.signIn(authConfig);
        }
      },
      signOut: async (): Promise<void> => {
        await this._restApi.signOut();
      }
    };
  }

  /**
   * Users manager - lazy loaded
   */
  get users(): UsersManager {
    if (!this._usersManager) {
      this._usersManager = new UsersManager(this._restApi);
    }
    return this._usersManager;
  }

  /**
   * Workbooks manager - lazy loaded
   */
  get workbooks(): WorkbooksManager {
    if (!this._workbooksManager) {
      this._workbooksManager = new WorkbooksManager(this._restApi);
    }
    return this._workbooksManager;
  }

  /**
   * Datasources manager - lazy loaded
   */
  get datasources(): DatasourcesManager {
    if (!this._datasourcesManager) {
      this._datasourcesManager = new DatasourcesManager(this._restApi);
    }
    return this._datasourcesManager;
  }

  /**
   * Projects manager - lazy loaded
   */
  get projects(): ProjectsManager {
    if (!this._projectsManager) {
      this._projectsManager = new ProjectsManager(this._restApi);
    }
    return this._projectsManager;
  }

  /**
   * Groups manager - lazy loaded
   */
  get groups(): GroupsManager {
    if (!this._groupsManager) {
      this._groupsManager = new GroupsManager(this._restApi);
    }
    return this._groupsManager;
  }

  /**
   * Get server info
   */
  async serverInfo() {
    return await this._restApi.getServerInfo();
  }

  /**
   * Get current site ID
   */
  get siteId(): string {
    return this._restApi.siteId;
  }

  /**
   * Check if signed in
   */
  get isSignedIn(): boolean {
    return this._restApi.isSignedIn;
  }
}