import { Credentials } from '../types/Credentials.js';
import { AuthConfig } from '../types/AuthConfig.js';
import { UsersMethods } from '../methods/UsersMethods.js';
import { WorkbooksMethods } from '../methods/WorkbooksMethods.js';
import { DatasourcesMethods } from '../methods/DatasourcesMethods.js';
import { ProjectsMethods } from '../methods/ProjectsMethods.js';
import { GroupsMethods } from '../methods/GroupsMethods.js';
import { AuthenticationMethods } from '../methods/AuthenticationMethods.js';

export class RestApi {
  private _creds?: Credentials;
  private readonly _host: string;
  private readonly _baseUrl: string;
  private _usersMethods?: UsersMethods;
  private _workbooksMethods?: WorkbooksMethods;
  private _datasourcesMethods?: DatasourcesMethods;
  private _projectsMethods?: ProjectsMethods;
  private _groupsMethods?: GroupsMethods;
  private _authMethods?: AuthenticationMethods;

  constructor(serverUrl: string) {
    this._host = serverUrl;
    this._baseUrl = `${serverUrl}/api/3.21`;
    this._authMethods = new AuthenticationMethods(this._baseUrl);
  }

  async signIn(authConfig: AuthConfig): Promise<void> {
    const result = await this._authMethods!.signIn(authConfig);
    this._creds = {
      token: result.credentials.token,
      siteId: result.credentials.site.id,
      userId: result.credentials.user?.id,
    };
  }

  async signOut(): Promise<void> {
    if (this._creds) {
      await this._authMethods!.signOut();
      this._creds = undefined;
    }
  }

  async getServerInfo(): Promise<any> {
    return await this._authMethods!.getServerInfo();
  }

  get siteId(): string {
    if (!this._creds) {
      throw new Error('Not signed in');
    }
    return this._creds.siteId;
  }

  get isSignedIn(): boolean {
    return !!this._creds;
  }

  get usersMethods(): UsersMethods {
    if (!this._usersMethods) {
      if (!this._creds) {
        throw new Error('Not signed in');
      }
      this._usersMethods = new UsersMethods(this._baseUrl, this._creds);
    }
    return this._usersMethods;
  }

  get workbooksMethods(): WorkbooksMethods {
    if (!this._workbooksMethods) {
      if (!this._creds) {
        throw new Error('Not signed in');
      }
      this._workbooksMethods = new WorkbooksMethods(this._baseUrl, this._creds);
    }
    return this._workbooksMethods;
  }

  get datasourcesMethods(): DatasourcesMethods {
    if (!this._datasourcesMethods) {
      if (!this._creds) {
        throw new Error('Not signed in');
      }
      this._datasourcesMethods = new DatasourcesMethods(this._baseUrl, this._creds);
    }
    return this._datasourcesMethods;
  }

  get projectsMethods(): ProjectsMethods {
    if (!this._projectsMethods) {
      if (!this._creds) {
        throw new Error('Not signed in');
      }
      this._projectsMethods = new ProjectsMethods(this._baseUrl, this._creds);
    }
    return this._projectsMethods;
  }

  get groupsMethods(): GroupsMethods {
    if (!this._groupsMethods) {
      if (!this._creds) {
        throw new Error('Not signed in');
      }
      this._groupsMethods = new GroupsMethods(this._baseUrl, this._creds);
    }
    return this._groupsMethods;
  }
}