export class GroupItem {
  id?: string;
  name: string;
  domainName?: string;
  minimumSiteRole?: string;

  constructor(data: {
    id?: string;
    name: string;
    domainName?: string;
    minimumSiteRole?: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.domainName = data.domainName;
    this.minimumSiteRole = data.minimumSiteRole;
  }

  toString(): string {
    return `GroupItem(name='${this.name}', id='${this.id}')`;
  }
}