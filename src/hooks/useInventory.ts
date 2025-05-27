
import { useState, useEffect } from 'react';
import { InventoryItem, InventoryAlert, DashboardStats, ActivityLog } from '@/types/inventory';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export function useInventory() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    loadInventoryData();
    loadAlertsData();
    loadActivitiesData();
  }, []);

  const loadInventoryData = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unit_price.toString()),
        reorderPoint: item.reorder_point,
        supplier: item.supplier,
        description: item.description,
        location: item.location,
        barcode: item.barcode,
        lastUpdated: new Date(item.updated_at),
        createdAt: new Date(item.created_at),
        updatedBy: item.updated_by
      }));

      setInventory(formattedData);
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  };

  const loadAlertsData = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map(alert => ({
        id: alert.id,
        itemId: alert.item_id,
        itemName: alert.item_name,
        type: alert.alert_type as 'low_stock' | 'out_of_stock' | 'reorder_needed',
        message: alert.message,
        currentQuantity: alert.current_quantity,
        reorderPoint: alert.reorder_point,
        severity: alert.severity as 'low' | 'medium' | 'high',
        createdAt: new Date(alert.created_at),
        acknowledged: alert.acknowledged
      }));

      setAlerts(formattedData);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const loadActivitiesData = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedData = data.map(activity => ({
        id: activity.id,
        userId: activity.user_id,
        userName: activity.user_name,
        action: activity.action as 'create' | 'update' | 'delete' | 'export' | 'login' | 'logout',
        itemId: activity.item_id,
        itemName: activity.item_name,
        details: activity.details,
        timestamp: new Date(activity.timestamp)
      }));

      setActivities(formattedData);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAlerts = async (inventoryData: InventoryItem[]) => {
    try {
      // Clear existing alerts
      await supabase.from('inventory_alerts').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      const alertsToInsert = [];
      
      inventoryData.forEach(item => {
        if (item.quantity === 0) {
          alertsToInsert.push({
            item_id: item.id,
            item_name: item.name,
            alert_type: 'out_of_stock',
            message: `${item.name} is out of stock`,
            current_quantity: item.quantity,
            reorder_point: item.reorderPoint,
            severity: 'high'
          });
        } else if (item.quantity <= item.reorderPoint) {
          alertsToInsert.push({
            item_id: item.id,
            item_name: item.name,
            alert_type: item.quantity <= item.reorderPoint / 2 ? 'reorder_needed' : 'low_stock',
            message: `${item.name} is running low (${item.quantity} remaining)`,
            current_quantity: item.quantity,
            reorder_point: item.reorderPoint,
            severity: item.quantity <= item.reorderPoint / 2 ? 'high' : 'medium'
          });
        }
      });

      if (alertsToInsert.length > 0) {
        const { error } = await supabase
          .from('inventory_alerts')
          .insert(alertsToInsert);

        if (error) throw error;
      }

      await loadAlertsData();
    } catch (error) {
      console.error('Error generating alerts:', error);
    }
  };

  const addActivity = async (activity: Omit<ActivityLog, 'id' | 'timestamp' | 'userId' | 'userName'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          user_name: user.name,
          action: activity.action,
          item_id: activity.itemId,
          item_name: activity.itemName,
          details: activity.details
        });

      if (error) throw error;
      await loadActivitiesData();
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const addItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'lastUpdated' | 'updatedBy'>) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert({
          product_id: item.productId,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          reorder_point: item.reorderPoint,
          supplier: item.supplier,
          description: item.description,
          location: item.location,
          barcode: item.barcode,
          updated_by: user?.email || 'unknown'
        })
        .select()
        .single();

      if (error) throw error;

      await loadInventoryData();
      await generateAlerts(inventory);

      await addActivity({
        action: 'create',
        itemId: data.id,
        itemName: item.name,
        details: `Created new inventory item: ${item.name}`
      });
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const updateData: any = {};
      
      if (updates.productId) updateData.product_id = updates.productId;
      if (updates.name) updateData.name = updates.name;
      if (updates.category) updateData.category = updates.category;
      if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
      if (updates.unitPrice !== undefined) updateData.unit_price = updates.unitPrice;
      if (updates.reorderPoint !== undefined) updateData.reorder_point = updates.reorderPoint;
      if (updates.supplier) updateData.supplier = updates.supplier;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.barcode !== undefined) updateData.barcode = updates.barcode;
      
      updateData.updated_by = user?.email || 'unknown';

      const { error } = await supabase
        .from('inventory_items')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await loadInventoryData();
      await generateAlerts(inventory);

      const item = inventory.find(i => i.id === id);
      if (item) {
        await addActivity({
          action: 'update',
          itemId: id,
          itemName: item.name,
          details: `Updated inventory item: ${item.name}`
        });
      }
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const item = inventory.find(i => i.id === id);
      
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadInventoryData();
      await generateAlerts(inventory);

      if (item) {
        await addActivity({
          action: 'delete',
          itemId: id,
          itemName: item.name,
          details: `Deleted inventory item: ${item.name}`
        });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('inventory_alerts')
        .update({ acknowledged: true })
        .eq('id', alertId);

      if (error) throw error;
      await loadAlertsData();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
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
