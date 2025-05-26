
export interface InventoryItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  reorderPoint: number;
  supplier: string;
  description?: string;
  location?: string;
  barcode?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedBy: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  lastLogin: Date;
  isActive: boolean;
}

export interface InventoryAlert {
  id: string;
  itemId: string;
  itemName: string;
  type: 'low_stock' | 'out_of_stock' | 'reorder_needed';
  message: string;
  currentQuantity: number;
  reorderPoint: number;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  acknowledged: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'export' | 'login' | 'logout';
  itemId?: string;
  itemName?: string;
  details: string;
  timestamp: Date;
}

export interface DashboardStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categoriesCount: number;
  recentActivities: ActivityLog[];
  topCategories: { name: string; count: number; value: number }[];
}

export const CATEGORIES = [
  'Paper',
  'Ink & Toners',
  'Equipment',
  'Finishing Materials',
  'Software',
  'Maintenance Supplies',
  'Office Supplies',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];
