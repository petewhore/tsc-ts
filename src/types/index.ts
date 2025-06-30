// Core Tableau Server Client Types

export interface TableauServerConfig {
  serverUrl: string;
  siteName?: string;
  apiVersion?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface AuthCredentials {
  username: string;
  password: string;
  contentUrl?: string;
}

export interface PersonalAccessTokenCredentials {
  tokenName: string;
  tokenValue: string;
  contentUrl?: string;
}

export interface AuthResponse {
  token: string;
  siteId: string;
  userId: string;
  credentials: {
    token: string;
    site: {
      id: string;
      contentUrl: string;
    };
    user: {
      id: string;
    };
  };
}

// Site Types
export interface Site {
  id: string;
  name: string;
  contentUrl: string;
  adminMode: string;
  userQuota: number;
  storageQuota: number;
  disableSubscriptions: boolean;
  subscribeOthersEnabled: boolean;
  revisionHistoryEnabled: boolean;
  revisionLimit: number;
  state: 'Active' | 'Suspended';
}

export interface CreateSiteRequest {
  name: string;
  contentUrl: string;
  adminMode?: 'ContentAndUsers' | 'ContentOnly';
  userQuota?: number;
  storageQuota?: number;
  disableSubscriptions?: boolean;
  subscribeOthersEnabled?: boolean;
  revisionHistoryEnabled?: boolean;
  revisionLimit?: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  siteRole: SiteRole;
  locale?: string;
  language?: string;
  email?: string;
  fullName?: string;
  lastLogin?: string;
  externalAuthUserId?: string;
  domain?: {
    name: string;
  };
}

export type SiteRole = 
  | 'SiteAdministrator'
  | 'Creator'
  | 'Explorer'
  | 'ExplorerCanPublish'
  | 'Viewer'
  | 'Unlicensed'
  | 'ReadOnly';

export interface CreateUserRequest {
  name: string;
  siteRole: SiteRole;
  email?: string;
  password?: string;
  fullName?: string;
  locale?: string;
  language?: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  contentPermissions: 'ManagedByOwner' | 'LockedToProject' | 'LockedToProjectWithoutNested';
  parentProjectId?: string;
  controllingPermissionsProjectId?: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
  };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  contentPermissions?: 'ManagedByOwner' | 'LockedToProject' | 'LockedToProjectWithoutNested';
  parentProjectId?: string;
}

// Workbook Types
export interface Workbook {
  id: string;
  name: string;
  description?: string;
  webpageUrl: string;
  showTabs: boolean;
  size: number;
  createdAt: string;
  updatedAt: string;
  encryptExtracts: boolean;
  defaultViewId?: string;
  contentUrl: string;
  project: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
  };
  tags: Tag[];
  views: View[];
}

export interface PublishWorkbookRequest {
  name: string;
  description?: string;
  projectId: string;
  showTabs?: boolean;
  generateThumbnailsAsUser?: boolean;
  encryptExtracts?: boolean;
  skipConnectionCheck?: boolean;
  overwrite?: boolean;
  asJob?: boolean;
  connections?: Connection[];
  credentials?: EmbeddedCredentials;
}

// Datasource Types
export interface Datasource {
  id: string;
  name: string;
  description?: string;
  contentUrl: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  encryptExtracts: boolean;
  hasExtracts: boolean;
  size: number;
  isCertified: boolean;
  certificationNote?: string;
  project: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
  };
  tags: Tag[];
}

export interface PublishDatasourceRequest {
  name: string;
  description?: string;
  projectId: string;
  encryptExtracts?: boolean;
  overwrite?: boolean;
  asJob?: boolean;
  connections?: Connection[];
  credentials?: EmbeddedCredentials;
}

// View Types
export interface View {
  id: string;
  name: string;
  contentUrl: string;
  webpageUrl: string;
  createdAt: string;
  updatedAt: string;
  viewUrlName: string;
  sheetType: string;
  hidden: boolean;
  workbook: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
  tags: Tag[];
  usage: {
    totalViewCount: number;
  };
}

export interface ViewImageOptions {
  resolution?: 'high' | 'standard';
  maxAge?: number;
  vf?: Record<string, string>;
}

export interface ViewPdfOptions {
  type?: 'A3' | 'A4' | 'A5' | 'B5' | 'Executive' | 'Folio' | 'Ledger' | 'Legal' | 'Letter' | 'Note' | 'Quarto' | 'Tabloid';
  orientation?: 'Portrait' | 'Landscape';
  maxAge?: number;
  vf?: Record<string, string>;
}

// Connection Types
export interface Connection {
  id: string;
  type: string;
  serverAddress: string;
  serverPort: string;
  username?: string;
  password?: string;
  embed?: boolean;
  queryTagging?: boolean;
}

export interface EmbeddedCredentials {
  name: string;
  password: string;
  embed: boolean;
  oAuth?: boolean;
}

// Tag Types
export interface Tag {
  label: string;
}

// Permission Types
export interface Permission {
  user?: {
    id: string;
    name: string;
  };
  group?: {
    id: string;
    name: string;
  };
  capabilities: Capability[];
}

export interface Capability {
  name: string;
  mode: 'Allow' | 'Deny';
}

// Group Types
export interface Group {
  id: string;
  name: string;
  domain?: {
    name: string;
  };
  minimumSiteRole?: SiteRole;
  users?: User[];
}

export interface CreateGroupRequest {
  name: string;
  minimumSiteRole?: SiteRole;
}

// Job Types
export interface Job {
  id: string;
  mode: string;
  type: string;
  progress: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  finishCode?: number;
  notes?: JobNote[];
}

export interface JobNote {
  type: string;
  value: string;
}

// Subscription Types
export interface Subscription {
  id: string;
  subject: string;
  message?: string;
  attachImage: boolean;
  attachPdf: boolean;
  pageOrientation?: 'Portrait' | 'Landscape';
  pageSizeOption?: string;
  sendIfViewEmpty: boolean;
  suspended: boolean;
  schedule: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
  content: {
    id: string;
    name: string;
    type: 'Workbook' | 'View';
  };
}

export interface CreateSubscriptionRequest {
  subject: string;
  message?: string;
  userId: string;
  scheduleId: string;
  contentType: 'Workbook' | 'View';
  contentId: string;
  attachImage?: boolean;
  attachPdf?: boolean;
  pageOrientation?: 'Portrait' | 'Landscape';
  pageSizeOption?: string;
  sendIfViewEmpty?: boolean;
}

// Schedule Types
export interface Schedule {
  id: string;
  name: string;
  priority: number;
  type: 'Extract' | 'Subscription' | 'Flow';
  frequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly';
  nextRunAt?: string;
  state: 'Active' | 'Suspended';
  createdAt: string;
  updatedAt: string;
  frequencyDetails?: FrequencyDetails;
}

export interface FrequencyDetails {
  start?: string;
  end?: string;
  intervals?: Interval[];
}

export interface Interval {
  hours?: string;
  minutes?: string;
  weekDay?: string;
  monthDay?: string;
}

// Flow Types
export interface Flow {
  id: string;
  name: string;
  description?: string;
  webpageUrl: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
  };
  tags: Tag[];
}

export interface PublishFlowRequest {
  name: string;
  description?: string;
  projectId: string;
  overwrite?: boolean;
  connections?: Connection[];
  credentials?: EmbeddedCredentials;
}

// Metric Types
export interface Metric {
  id: string;
  name: string;
  description?: string;
  webpageUrl: string;
  createdAt: string;
  updatedAt: string;
  suspended: boolean;
  project: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
  };
  underlyingView: {
    id: string;
    name: string;
  };
  tags: Tag[];
}

// Webhook Types
export interface Webhook {
  id: string;
  name: string;
  url: string;
  event: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookRequest {
  name: string;
  url: string;
  event: string;
  isEnabled?: boolean;
}

// Alert Types
export interface DataAlert {
  id: string;
  subject: string;
  frequency: 'Once' | 'Frequently' | 'Hourly' | 'Daily' | 'Weekly';
  public: boolean;
  suspended: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
  };
  view: {
    id: string;
    name: string;
  };
  condition: AlertCondition;
}

export interface AlertCondition {
  operator: 'eq' | 'gt' | 'gteq' | 'lt' | 'lteq' | 'neq';
  threshold: number;
}

export interface CreateDataAlertRequest {
  subject: string;
  frequency: 'Once' | 'Frequently' | 'Hourly' | 'Daily' | 'Weekly';
  condition: AlertCondition;
  viewId: string;
  public?: boolean;
}

// Pagination Types
export interface PaginationOptions {
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalAvailable: number;
  };
}

// Filter Types
export interface FilterOptions {
  filter?: string;
  sort?: string;
  fields?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  code: string;
  summary: string;
  detail: string;
}

// Extract Types
export interface ExtractRefreshTask {
  id: string;
  priority: number;
  consecutiveFailedCount: number;
  type: 'FullRefresh' | 'IncrementalRefresh';
  schedule?: {
    id: string;
    name: string;
  };
  datasource?: {
    id: string;
    name: string;
  };
  workbook?: {
    id: string;
    name: string;
  };
}

// Custom View Types
export interface CustomView {
  id: string;
  name: string;
  shared: boolean;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
  owner: {
    id: string;
    name: string;
  };
  view: {
    id: string;
    name: string;
  };
}

// Utility Types
export type TableauServerClientOptions = TableauServerConfig & {
  credentials?: AuthCredentials | PersonalAccessTokenCredentials;
};

export type ContentType = 'workbook' | 'datasource' | 'view' | 'project' | 'flow' | 'metric';

export interface DownloadOptions {
  includeExtract?: boolean;
  filepath?: string;
}

export interface ContentReference {
  id: string;
  type: ContentType;
  name?: string;
}