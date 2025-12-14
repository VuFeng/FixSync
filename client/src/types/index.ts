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

// Customer types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
}

// Legacy device status (backend no longer uses, kept for UI compatibility)
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
  customer?: Customer;
  customerName?: string;
  customerPhone?: string;
  deviceType: string;
  brand?: Brand;
  model?: DeviceModel;
  imei?: string;
  color?: string;
  status?: string;
  assignedTo?: User;
  receivedDate?: string;
  expectedReturnDate?: string;
  warrantyMonths?: number;
  createdBy: User;
  note?: string;
  createdAt: string;
  updatedAt: string;
  // optional enrichments from detail API
  repairItems?: RepairItem[];
  transaction?: Transaction;
  repairSubtotal?: number;
  outstandingAmount?: number;
}

export interface DeviceRequest {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  deviceType?: string;
  brandId: string; // UUID as string
  modelId: string; // UUID as string
  imei?: string;
  color?: string;
  note?: string;
}

// Repair Item types
export interface RepairItem {
  id: string;
  deviceId: string;
  repairSessionId?: string;
  serviceId?: string;
  serviceName: string;
  serviceDescription?: string;
  partUsed?: string;
  cost: number | null;
  warrantyMonths?: number | null;
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
  repairSessionId?: string;
  total: number;
  discount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface TransactionRequest {
  deviceId: string;
  repairSessionId?: string;
  total: number;
  discount: number;
  paymentMethod: PaymentMethod;
}

// Warranty types
export interface Warranty {
  id: string;
  deviceId: string;
  repairSessionId?: string;
  repairItemId?: string;
  startDate: string;
  endDate: string;
  warrantyCode: string;
  createdAt: string;
}

export interface WarrantyRequest {
  deviceId: string;
  repairSessionId?: string;
  repairItemId?: string;
  warrantyMonths: number;
}

// Repair Session types
export interface RepairSession {
  id: string;
  deviceId: string;
  device?: Device; // Full device information
  status: DeviceStatus;
  receivedDate: string;
  expectedReturnDate?: string;
  note?: string;
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface RepairSessionRequest {
  deviceId: string;
  status?: DeviceStatus;
  receivedDate?: string;
  expectedReturnDate?: string;
  note?: string;
  assignedTo?: string;
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
