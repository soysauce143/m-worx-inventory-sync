
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/hooks/useInventory';
import { InventoryItem, CATEGORIES } from '@/types/inventory';
import { toast } from 'sonner';

interface AddEditItemProps {
  itemId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddEditItem({ itemId, onSuccess, onCancel }: AddEditItemProps) {
  const { inventory, addItem, updateItem } = useInventory();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    category: '',
    quantity: '',
    unitPrice: '',
    reorderPoint: '',
    supplier: '',
    description: '',
    location: '',
    barcode: ''
  });

  const isEdit = !!itemId;
  const item = isEdit ? inventory.find(i => i.id === itemId) : null;

  useEffect(() => {
    if (item) {
      setFormData({
        productId: item.productId,
        name: item.name,
        category: item.category,
        quantity: item.quantity.toString(),
        unitPrice: item.unitPrice.toString(),
        reorderPoint: item.reorderPoint.toString(),
        supplier: item.supplier,
        description: item.description || '',
        location: item.location || '',
        barcode: item.barcode || ''
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.productId || !formData.name || !formData.category || 
          !formData.quantity || !formData.unitPrice || !formData.reorderPoint || 
          !formData.supplier) {
        toast.error('Please fill in all required fields');
        return;
      }

      const quantity = parseInt(formData.quantity);
      const unitPrice = parseFloat(formData.unitPrice);
      const reorderPoint = parseInt(formData.reorderPoint);

      if (isNaN(quantity) || quantity < 0) {
        toast.error('Quantity must be a valid number');
        return;
      }

      if (isNaN(unitPrice) || unitPrice < 0) {
        toast.error('Unit price must be a valid number');
        return;
      }

      if (isNaN(reorderPoint) || reorderPoint < 0) {
        toast.error('Reorder point must be a valid number');
        return;
      }

      // Check for duplicate product ID (only when adding or changing product ID)
      if (!isEdit || formData.productId !== item?.productId) {
        const existingItem = inventory.find(i => i.productId === formData.productId);
        if (existingItem) {
          toast.error('Product ID already exists');
          return;
        }
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const itemData = {
        productId: formData.productId,
        name: formData.name,
        category: formData.category,
        quantity,
        unitPrice,
        reorderPoint,
        supplier: formData.supplier,
        description: formData.description,
        location: formData.location,
        barcode: formData.barcode
      };

      if (isEdit && itemId) {
        updateItem(itemId, itemData);
        toast.success('Item updated successfully');
      } else {
        addItem(itemData);
        toast.success('Item added successfully');
      }

      onSuccess();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Item' : 'Add New Item'}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product ID *</Label>
              <Input
                id="productId"
                value={formData.productId}
                onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
                placeholder="MWX-001"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="A4 Premium Paper"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                placeholder="Supplier Name"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="100"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price *</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                placeholder="12.99"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reorderPoint">Reorder Point *</Label>
              <Input
                id="reorderPoint"
                type="number"
                min="0"
                value={formData.reorderPoint}
                onChange={(e) => setFormData(prev => ({ ...prev, reorderPoint: e.target.value }))}
                placeholder="25"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Warehouse A-1"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                placeholder="1234567890123"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Item description and notes..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-primary-600 hover:bg-primary-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (isEdit ? 'Update Item' : 'Add Item')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
