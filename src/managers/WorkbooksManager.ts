import { RestApi } from '../apis/RestApi.js';
import { WorkbookItem } from '../items/WorkbookItem.js';
import { Pagination } from '../types/Pagination.js';

export class WorkbooksManager {
  constructor(private restApi: RestApi) {}

  async get(filter?: string): Promise<{ workbooks: WorkbookItem[], pagination: Pagination }> {
    try {
      const response = await this.restApi.workbooksMethods.listWorkbooks({
        siteId: this.restApi.siteId,
        filter: filter,
        pageSize: 100,
        pageNumber: 1
      });

      const workbooks = (response.workbooks || []).map(wb => new WorkbookItem({
        id: wb.id,
        name: wb.name,
        description: wb.description,
        contentUrl: wb.contentUrl,
        showTabs: wb.showTabs,
        size: wb.size,
        createdAt: new Date(wb.createdAt),
        updatedAt: new Date(wb.updatedAt),
        projectId: wb.project?.id,
        ownerId: wb.owner?.id
      }));

      return {
        workbooks,
        pagination: new Pagination({
          pageNumber: response.pagination?.pageNumber || 1,
          pageSize: response.pagination?.pageSize || 100,
          totalAvailable: response.pagination?.totalAvailable || 0
        })
      };
    } catch (error) {
      console.warn('Workbooks API not available:', error);
      return {
        workbooks: [],
        pagination: new Pagination({ pageNumber: 1, pageSize: 100, totalAvailable: 0 })
      };
    }
  }

  async update(workbook: WorkbookItem): Promise<WorkbookItem> {
    if (!workbook.id) {
      throw new Error('Workbook ID is required for update operation');
    }

    const response = await this.restApi.workbooksMethods.updateWorkbook({
      siteId: this.restApi.siteId,
      workbookId: workbook.id,
      name: workbook.name,
      description: workbook.description,
      projectId: workbook.projectId,
      showTabs: workbook.showTabs
    });

    return new WorkbookItem({
      id: response.workbook.id,
      name: response.workbook.name,
      description: response.workbook.description,
      contentUrl: response.workbook.contentUrl,
      showTabs: response.workbook.showTabs,
      size: response.workbook.size,
      createdAt: new Date(response.workbook.createdAt),
      updatedAt: new Date(response.workbook.updatedAt),
      projectId: response.workbook.project?.id,
      ownerId: response.workbook.owner?.id
    });
  }

  async delete(workbookId: string): Promise<void> {
    await this.restApi.workbooksMethods.deleteWorkbook({
      siteId: this.restApi.siteId,
      workbookId
    });
  }
}