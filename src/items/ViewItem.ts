export class ViewItem {
  id?: string;
  name: string;
  contentUrl: string;
  workbookId?: string;

  constructor(data: {
    id?: string;
    name: string;
    contentUrl: string;
    workbookId?: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.contentUrl = data.contentUrl;
    this.workbookId = data.workbookId;
  }

  toString(): string {
    return `ViewItem(name='${this.name}', id='${this.id}', contentUrl='${this.contentUrl}')`;
  }
}