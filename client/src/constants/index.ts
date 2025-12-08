// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
  },
  // Users
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
  },
  // Brands
  BRANDS: {
    BASE: "/brands",
    ACTIVE: "/brands/active",
    BY_ID: (id: string) => `/brands/${id}`,
  },
  // Device Models
  DEVICE_MODELS: {
    BY_BRAND: (brandId: string) => `/device-models/brand/${brandId}`,
    BY_DEVICE_TYPE: (deviceType: string) =>
      `/device-models/device-type/${deviceType}`,
  },
  // Devices
  DEVICES: {
    BASE: "/devices",
    BY_ID: (id: string) => `/devices/${id}`,
    STATUS: (id: string) => `/devices/${id}/status`,
    ASSIGN: (id: string) => `/devices/${id}/assign`,
  },
  // Repair Items
  REPAIR_ITEMS: {
    BASE: "/repair-items",
    BY_DEVICE: (deviceId: string) => `/repair-items/device/${deviceId}`,
    BY_ID: (id: string) => `/repair-items/${id}`,
    TOTAL_COST: (deviceId: string) =>
      `/repair-items/device/${deviceId}/total-cost`,
  },
  // Transactions
  TRANSACTIONS: {
    BASE: "/transactions",
    BY_DEVICE: (deviceId: string) => `/transactions/device/${deviceId}`,
    BY_ID: (id: string) => `/transactions/${id}`,
    REVENUE: "/transactions/revenue",
  },
  // Warranties
  WARRANTIES: {
    BASE: "/warranties",
    BY_DEVICE: (deviceId: string) => `/warranties/device/${deviceId}`,
    BY_ID: (id: string) => `/warranties/${id}`,
    BY_CODE: (code: string) => `/warranties/code/${code}`,
    EXPIRING: "/warranties/expiring",
    EXPIRED: "/warranties/expired",
  },
  // Logs
  LOGS: {
    BY_DEVICE: (deviceId: string) => `/logs/device/${deviceId}`,
  },
  // Media
  MEDIA: {
    BASE: "/media",
    UPLOAD: "/media/upload",
    BY_ID: (id: string) => `/media/${id}`,
    DOWNLOAD: (id: string) => `/media/${id}/download`,
    BY_ENTITY: (entityType: string, entityId: string) =>
      `/media/entity/${entityType}/${entityId}`,
    BY_ENTITY_AND_TYPE: (
      entityType: string,
      entityId: string,
      mediaType: string
    ) => `/media/entity/${entityType}/${entityId}/type/${mediaType}`,
    MY_UPLOADS: "/media/my-uploads",
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER: "user",
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  DEVICES: "/devices",
  DEVICE_DETAIL: (id: string) => `/devices/${id}`,
  USERS: "/users",
  REPAIR_ITEMS: "/repair-items",
  TRANSACTIONS: "/transactions",
  WARRANTIES: "/warranties",
  SETTINGS: "/settings",
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  DEFAULT_SORT_BY: "createdAt",
  DEFAULT_SORT_DIR: "DESC",
} as const;
