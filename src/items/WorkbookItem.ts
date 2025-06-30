/**
 * Workbook item class compatible with Python TSC WorkbookItem
 */
export class WorkbookItem {
  id?: string;
  name: string;
  description?: string;
  contentUrl: string;
  showTabs: boolean;
  size?: number;
  createdAt?: Date;
  updatedAt?: Date;
  projectId?: string;
  ownerId?: string;

  constructor(data: {
    id?: string;
    name: string;
    description?: string;
    contentUrl: string;
    showTabs?: boolean;
    size?: number;
    createdAt?: Date;
    updatedAt?: Date;
    projectId?: string;
    ownerId?: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.contentUrl = data.contentUrl;
    this.showTabs = data.showTabs ?? false;
    this.size = data.size;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.projectId = data.projectId;
    this.ownerId = data.ownerId;
  }

  /**
   * String representation
   */
  toString(): string {
    return `WorkbookItem(name='${this.name}', id='${this.id}', contentUrl='${this.contentUrl}')`;
  }
}