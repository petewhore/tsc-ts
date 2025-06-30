import { RestApi } from '../apis/RestApi.js';
import { DatasourceItem } from '../items/DatasourceItem.js';
import { Pagination } from '../types/Pagination.js';

export class DatasourcesManager {
  constructor(private restApi: RestApi) {}

  async get(filter?: string): Promise<{ datasources: DatasourceItem[], pagination: Pagination }> {
    try {
      const response = await this.restApi.datasourcesMethods.listDatasources({
        siteId: this.restApi.siteId,
        filter: filter,
        pageSize: 100,
        pageNumber: 1
      });

      const datasources = (response.datasources || []).map(ds => new DatasourceItem({
        id: ds.id,
        name: ds.name,
        description: ds.description,
        contentUrl: ds.contentUrl,
        type: ds.type,
        createdAt: new Date(ds.createdAt),
        updatedAt: new Date(ds.updatedAt),
        projectId: ds.project?.id,
        ownerId: ds.owner?.id
      }));

      return {
        datasources,
        pagination: new Pagination({
          pageNumber: response.pagination?.pageNumber || 1,
          pageSize: response.pagination?.pageSize || 100,
          totalAvailable: response.pagination?.totalAvailable || 0
        })
      };
    } catch (error) {
      console.warn('Datasources API not available:', error);
      return {
        datasources: [],
        pagination: new Pagination({ pageNumber: 1, pageSize: 100, totalAvailable: 0 })
      };
    }
  }

  async update(datasource: DatasourceItem): Promise<DatasourceItem> {
    if (!datasource.id) {
      throw new Error('Datasource ID is required for update operation');
    }

    const response = await this.restApi.datasourcesMethods.updateDatasource({
      siteId: this.restApi.siteId,
      datasourceId: datasource.id,
      name: datasource.name,
      description: datasource.description,
      projectId: datasource.projectId
    });

    return new DatasourceItem({
      id: response.datasource.id,
      name: response.datasource.name,
      description: response.datasource.description,
      contentUrl: response.datasource.contentUrl,
      type: response.datasource.type,
      createdAt: new Date(response.datasource.createdAt),
      updatedAt: new Date(response.datasource.updatedAt),
      projectId: response.datasource.project?.id,
      ownerId: response.datasource.owner?.id
    });
  }

  async delete(datasourceId: string): Promise<void> {
    await this.restApi.datasourcesMethods.deleteDatasource({
      siteId: this.restApi.siteId,
      datasourceId
    });
  }
}