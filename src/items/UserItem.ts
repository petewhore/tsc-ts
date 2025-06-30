/**
 * User item class compatible with Python TSC UserItem
 */
export class UserItem {
  id?: string;
  name: string;
  fullName?: string;
  email?: string;
  siteRole: string;
  locale?: string;
  language?: string;
  lastLogin?: Date;
  authSetting?: string;

  constructor(data: {
    id?: string;
    name: string;
    fullName?: string;
    email?: string;
    siteRole: string;
    locale?: string;
    language?: string;
    lastLogin?: Date;
    authSetting?: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.fullName = data.fullName;
    this.email = data.email;
    this.siteRole = data.siteRole;
    this.locale = data.locale;
    this.language = data.language;
    this.lastLogin = data.lastLogin;
    this.authSetting = data.authSetting || 'ServerDefault';
  }

  /**
   * String representation
   */
  toString(): string {
    return `UserItem(name='${this.name}', id='${this.id}', siteRole='${this.siteRole}')`;
  }
}