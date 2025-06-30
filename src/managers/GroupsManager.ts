import { RestApi } from '../apis/RestApi.js';
import { GroupItem } from '../items/GroupItem.js';
import { Pagination } from '../types/Pagination.js';

export class GroupsManager {
  constructor(private restApi: RestApi) {}

  async get(filter?: string): Promise<{ groups: GroupItem[], pagination: Pagination }> {
    try {
      const response = await this.restApi.groupsMethods.listGroups({
        siteId: this.restApi.siteId,
        filter: filter,
        pageSize: 100,
        pageNumber: 1
      });

      const groups = (response.groups || []).map(group => new GroupItem({
        id: group.id,
        name: group.name,
        domainName: group.domainName,
        minimumSiteRole: group.minimumSiteRole
      }));

      return {
        groups,
        pagination: new Pagination({
          pageNumber: response.pagination?.pageNumber || 1,
          pageSize: response.pagination?.pageSize || 100,
          totalAvailable: response.pagination?.totalAvailable || 0
        })
      };
    } catch (error) {
      console.warn('Groups API not available:', error);
      return {
        groups: [],
        pagination: new Pagination({ pageNumber: 1, pageSize: 100, totalAvailable: 0 })
      };
    }
  }

  async create(group: GroupItem): Promise<GroupItem> {
    const response = await this.restApi.groupsMethods.createGroup({
      siteId: this.restApi.siteId,
      name: group.name,
      domainName: group.domainName,
      minimumSiteRole: group.minimumSiteRole
    });

    return new GroupItem({
      id: response.group.id,
      name: response.group.name,
      domainName: response.group.domainName,
      minimumSiteRole: response.group.minimumSiteRole
    });
  }

  async update(group: GroupItem): Promise<GroupItem> {
    if (!group.id) {
      throw new Error('Group ID is required for update operation');
    }

    const response = await this.restApi.groupsMethods.updateGroup({
      siteId: this.restApi.siteId,
      groupId: group.id,
      name: group.name,
      domainName: group.domainName,
      minimumSiteRole: group.minimumSiteRole
    });

    return new GroupItem({
      id: response.group.id,
      name: response.group.name,
      domainName: response.group.domainName,
      minimumSiteRole: response.group.minimumSiteRole
    });
  }

  async delete(groupId: string): Promise<void> {
    await this.restApi.groupsMethods.deleteGroup({
      siteId: this.restApi.siteId,
      groupId
    });
  }
}