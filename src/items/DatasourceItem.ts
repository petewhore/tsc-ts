export class DatasourceItem {
  id?: string;
  name: string;
  description?: string;
  contentUrl: string;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
  projectId?: string;
  ownerId?: string;

  constructor(data: {
    id?: string;
    name: string;
    description?: string;
    contentUrl: string;
    type?: string;
    createdAt?: Date;
    updatedAt?: Date;
    projectId?: string;
    ownerId?: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.contentUrl = data.contentUrl;
    this.type = data.type;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.projectId = data.projectId;
    this.ownerId = data.ownerId;
  }

  toString(): string {
    return `DatasourceItem(name='${this.name}', id='${this.id}', contentUrl='${this.contentUrl}')`;
  }
}