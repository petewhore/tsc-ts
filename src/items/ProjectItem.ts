export class ProjectItem {
  id?: string;
  name: string;
  description?: string;
  contentPermissions?: string;
  parentProjectId?: string;

  constructor(data: {
    id?: string;
    name: string;
    description?: string;
    contentPermissions?: string;
    parentProjectId?: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.contentPermissions = data.contentPermissions;
    this.parentProjectId = data.parentProjectId;
  }

  toString(): string {
    return `ProjectItem(name='${this.name}', id='${this.id}')`;
  }
}