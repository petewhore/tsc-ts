import { RestApi } from '../apis/RestApi.js';
import { ProjectItem } from '../items/ProjectItem.js';
import { Pagination } from '../types/Pagination.js';

export class ProjectsManager {
  constructor(private restApi: RestApi) {}

  async get(filter?: string): Promise<{ projects: ProjectItem[], pagination: Pagination }> {
    try {
      const response = await this.restApi.projectsMethods.listProjects({
        siteId: this.restApi.siteId,
        filter: filter,
        pageSize: 100,
        pageNumber: 1
      });

      const projects = (response.projects || []).map(proj => new ProjectItem({
        id: proj.id,
        name: proj.name,
        description: proj.description,
        contentPermissions: proj.contentPermissions,
        parentProjectId: proj.parentProjectId
      }));

      return {
        projects,
        pagination: new Pagination({
          pageNumber: response.pagination?.pageNumber || 1,
          pageSize: response.pagination?.pageSize || 100,
          totalAvailable: response.pagination?.totalAvailable || 0
        })
      };
    } catch (error) {
      console.warn('Projects API not available:', error);
      return {
        projects: [],
        pagination: new Pagination({ pageNumber: 1, pageSize: 100, totalAvailable: 0 })
      };
    }
  }

  async create(project: ProjectItem): Promise<ProjectItem> {
    const response = await this.restApi.projectsMethods.createProject({
      siteId: this.restApi.siteId,
      name: project.name,
      description: project.description,
      contentPermissions: project.contentPermissions,
      parentProjectId: project.parentProjectId
    });

    return new ProjectItem({
      id: response.project.id,
      name: response.project.name,
      description: response.project.description,
      contentPermissions: response.project.contentPermissions,
      parentProjectId: response.project.parentProjectId
    });
  }

  async update(project: ProjectItem): Promise<ProjectItem> {
    if (!project.id) {
      throw new Error('Project ID is required for update operation');
    }

    const response = await this.restApi.projectsMethods.updateProject({
      siteId: this.restApi.siteId,
      projectId: project.id,
      name: project.name,
      description: project.description,
      contentPermissions: project.contentPermissions,
      parentProjectId: project.parentProjectId
    });

    return new ProjectItem({
      id: response.project.id,
      name: response.project.name,
      description: response.project.description,
      contentPermissions: response.project.contentPermissions,
      parentProjectId: response.project.parentProjectId
    });
  }

  async delete(projectId: string): Promise<void> {
    await this.restApi.projectsMethods.deleteProject({
      siteId: this.restApi.siteId,
      projectId
    });
  }
}