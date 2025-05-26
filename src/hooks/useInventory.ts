
import { useState, useEffect } from 'react';
import { InventoryItem, InventoryAlert, DashboardStats, ActivityLog } from '@/types/inventory';
import { useAuth } from './useAuth';

const STORAGE_KEY = 'mworx_inventory';
const ALERTS_KEY = 'mworx_alerts';
const ACTIVITIES_KEY = 'mworx_activities';

// Sample data for demonstration
const SAMPLE_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    productId: 'MWX-001',
    name: 'A4 Premium Paper',
    category: 'Paper',
    quantity: 250,
    unitPrice: 12.99,
    reorderPoint: 50,
    supplier: 'Paper Plus Suppliers',
    description: 'High-quality A4 printing paper, 80gsm',
    location: 'Warehouse A-1',
    barcode: '1234567890123',
    lastUpdated: new Date(),
    createdAt: new Date(),
    updatedBy: 'admin@mworx.com'
  },
  {
    id: '2',
    productId: 'MWX-002',
    name: 'Black Toner Cartridge',
    category: 'Ink & Toners',
    quantity: 15,
    unitPrice: 89.99,
    reorderPoint: 25,
    supplier: 'Ink Solutions Ltd',
    description: 'Compatible black toner for HP LaserJet series',
    location: 'Storage B-3',
    barcode: '2345678901234',
    lastUpdated: new Date(),
    createdAt: new Date(),
    updatedBy: 'admin@mworx.com'
  },
  {
    id: '3',
    productId: 'MWX-003',
    name: 'Large Format Printer',
    category: 'Equipment',
    quantity: 2,
    unitPrice: 2499.99,
    reorderPoint: 1,
    supplier: 'Digital Print Equipment Co',
    description: 'Professional large format inkjet printer',
    location: 'Equipment Room',
    barcode: '3456789012345',
    lastUpdated: new Date(),
    createdAt: new Date(),
    updatedBy: 'admin@mworx.com'
  }
];

export function useInventory() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const loadData = () => {
      try {
        const storedInventory = localStorage.getItem(STORAGE_KEY);
        if (storedInventory) {
          const parsed = JSON.parse(storedInventory);
          setInventory(parsed.map((item: any) => ({
            ...item,
            lastUpdated: new Date(item.lastUpdated),
            createdAt: new Date(item.createdAt)
          })));
        } else {
          setInventory(SAMPLE_INVENTORY);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_INVENTORY));
        }

        const storedAlerts = localStorage.getItem(ALERTS_KEY);
        if (storedAlerts) {
          const parsed = JSON.parse(storedAlerts);
          setAlerts(parsed.map((alert: any) => ({
            ...alert,
            createdAt: new Date(alert.createdAt)
          })));
        }

        const storedActivities = localStorage.getItem(ACTIVITIES_KEY);
        if (storedActivities) {
          const parsed = JSON.parse(storedActivities);
          setActivities(parsed.map((activity: any) => ({
            ...activity,
            timestamp: new Date(activity.timestamp)
          })));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Update alerts when inventory changes
  useEffect(() => {
    if (inventory.length > 0) {
      generateAlerts();
    }
  }, [inventory]);

  const generateAlerts = () => {
    const newAlerts: InventoryAlert[] = [];
    
    inventory.forEach(item => {
      if (item.quantity === 0) {
        newAlerts.push({
          id: `alert-${item.id}-out`,
          itemId: item.id,
          itemName: item.name,
          type: 'out_of_stock',
          message: `${item.name} is out of stock`,
          currentQuantity: item.quantity,
          reorderPoint: item.reorderPoint,
          severity: 'high',
          createdAt: new Date(),
          acknowledged: false
        });
      } else if (item.quantity <= item.reorderPoint) {
        newAlerts.push({
          id: `alert-${item.id}-low`,
          itemId: item.id,
          itemName: item.name,
          type: item.quantity <= item.reorderPoint / 2 ? 'reorder_needed' : 'low_stock',
          message: `${item.name} is running low (${item.quantity} remaining)`,
          currentQuantity: item.quantity,
          reorderPoint: item.reorderPoint,
          severity: item.quantity <= item.reorderPoint / 2 ? 'high' : 'medium',
          createdAt: new Date(),
          acknowledged: false
        });
      }
    });

    setAlerts(newAlerts);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(newAlerts));
  };

  const addActivity = (activity: Omit<ActivityLog, 'id' | 'timestamp' | 'userId' | 'userName'>) => {
    if (!user) return;

    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      timestamp: new Date(),
      ...activity
    };

    const updatedActivities = [newActivity, ...activities].slice(0, 50);
    setActivities(updatedActivities);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updatedActivities));
  };

  const addItem = (item: Omit<InventoryItem, 'id' | 'createdAt' | 'lastUpdated' | 'updatedBy'>) => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      createdAt: new Date(),
      lastUpdated: new Date(),
      updatedBy: user?.email || 'unknown',
      ...item
    };

    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInventory));

    addActivity({
      action: 'create',
      itemId: newItem.id,
      itemName: newItem.name,
      details: `Created new inventory item: ${newItem.name}`
    });
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    const updatedInventory = inventory.map(item => 
      item.id === id 
        ? { 
            ...item, 
            ...updates, 
            lastUpdated: new Date(), 
            updatedBy: user?.email || 'unknown' 
          }
        : item
    );

    setInventory(updatedInventory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInventory));

    const item = inventory.find(i => i.id === id);
    if (item) {
      addActivity({
        action: 'update',
        itemId: id,
        itemName: item.name,
        details: `Updated inventory item: ${item.name}`
      });
    }
  };

  const deleteItem = (id: string) => {
    const item = inventory.find(i => i.id === id);
    const updatedInventory = inventory.filter(item => item.id !== id);
    
    setInventory(updatedInventory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInventory));

    if (item) {
      addActivity({
        action: 'delete',
        itemId: id,
        itemName: item.name,
        details: `Deleted inventory item: ${item.name}`
      });
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    );
    setAlerts(updatedAlerts);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));
  };

  const getDashboardStats = (): DashboardStats => {
    const totalItems = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const lowStockItems = inventory.filter(item => item.quantity <= item.reorderPoint && item.quantity > 0).length;
    const outOfStockItems = inventory.filter(item => item.quantity === 0).length;
    
    const categoriesMap = new Map();
    inventory.forEach(item => {
      const category = categoriesMap.get(item.category) || { count: 0, value: 0 };
      category.count++;
      category.value += item.quantity * item.unitPrice;
      categoriesMap.set(item.category, category);
    });

    const topCategories = Array.from(categoriesMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.value - a.value);

    return {
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      categoriesCount: categoriesMap.size,
      recentActivities: activities.slice(0, 10),
      topCategories
    };
  };

  return {
    inventory,
    alerts,
    activities,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    acknowledgeAlert,
    getDashboardStats
  };
}
