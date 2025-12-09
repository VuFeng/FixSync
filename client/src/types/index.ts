// Common types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// User types
export const Role = {
  ADMIN: "ADMIN",
  TECHNICIAN: "TECHNICIAN",
  RECEPTIONIST: "RECEPTIONIST",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  user: User;
}

// Device types
export const DeviceStatus = {
  RECEIVED: "RECEIVED",
  INSPECTING: "INSPECTING",
  WAITING_PARTS: "WAITING_PARTS",
  REPAIRING: "REPAIRING",
  COMPLETED: "COMPLETED",
  RETURNED: "RETURNED",
} as const;

export type DeviceStatus = (typeof DeviceStatus)[keyof typeof DeviceStatus];

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceModel {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  deviceType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  customerName: string;
  customerPhone: string;
  deviceType: string;
  brand?: Brand;
  model?: DeviceModel;
  imei?: string;
  color?: string;
  receivedDate: string;
  expectedReturnDate?: string;
  warrantyMonths?: number;
  createdBy: User;
  assignedTo?: User;
  status: DeviceStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceRequest {
  customerName: string;
  customerPhone: string;
  deviceType?: string;
  brandId: string; // UUID as string
  modelId: string; // UUID as string
  imei?: string;
  color?: string;
  receivedDate: string; // ISO datetime string
  expectedReturnDate?: string; // ISO datetime string
  warrantyMonths?: number;
  assignedTo?: string; // UUID as string
  status?: DeviceStatus;
  note?: string;
}

// Repair Item types
export interface RepairItem {
  id: string;
  deviceId: string;
  serviceId?: string;
  serviceName: string;
  serviceDescription?: string;
  partUsed?: string;
  cost: number;
  warrantyMonths?: number;
  description?: string;
  createdAt: string;
}

// Transaction types
export const PaymentMethod = {
  CASH: "CASH",
  MOMO: "MOMO",
  BANKING: "BANKING",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface Transaction {
  id: string;
  deviceId: string;
  total: number;
  discount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

// Warranty types
export interface Warranty {
  id: string;
  deviceId: string;
  repairItemId?: string;
  startDate: string;
  endDate: string;
  warrantyCode: string;
  createdAt: string;
}

// Media types
export const MediaType = {
  IMAGE: "IMAGE",
  DOCUMENT: "DOCUMENT",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
  OTHER: "OTHER",
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];

export const EntityType = {
  DEVICE: "DEVICE",
  USER: "USER",
  BRAND: "BRAND",
  DEVICEMODEL: "DEVICEMODEL",
  REPAIRITEM: "REPAIRITEM",
  TRANSACTION: "TRANSACTION",
  WARRANTY: "WARRANTY",
  LOG: "LOG",
} as const;

export type EntityType = (typeof EntityType)[keyof typeof EntityType];

export interface Media {
  id: string;
  originalFilename: string;
  storedFilename: string;
  filePath: string;
  fileSize: number;
  contentType: string;
  mediaType: MediaType;
  entityType?: EntityType;
  entityId?: string;
  description?: string;
  uploadedBy: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  url?: string;
}

// Realtime Log types
export const ActionType = {
  CREATED: "CREATED",
  UPDATED: "UPDATED",
  ASSIGNED: "ASSIGNED",
  STATUS_CHANGED: "STATUS_CHANGED",
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export interface RealtimeLog {
  id: string;
  deviceId: string;
  action: ActionType;
  detail: string;
  createdBy: User;
  createdAt: string;
}
