import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInventory } from '@/hooks/useInventory';
import { 
  Archive, 
  Bell, 
  Database, 
  Clock,
} from 'lucide-react';

export function Dashboard() {
  const { getDashboardStats, alerts, activities } = useInventory();
  const stats = getDashboardStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">Total Items</p>
                <p className="text-3xl font-bold">{stats.totalItems}</p>
              </div>
              <Database className="h-8 w-8 text-primary-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100 text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
              </div>
              <Archive className="h-8 w-8 text-secondary-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-warning-500 to-warning-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-warning-100 text-sm font-medium">Low Stock</p>
                <p className="text-3xl font-bold">{stats.lowStockItems}</p>
              </div>
              <Bell className="h-8 w-8 text-warning-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-danger-500 to-danger-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-danger-100 text-sm font-medium">Out of Stock</p>
                <p className="text-3xl font-bold">{stats.outOfStockItems}</p>
              </div>
              <Archive className="h-8 w-8 text-danger-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>
              Latest inventory alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.itemName}</p>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                  <Badge 
                    variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {alert.severity}
                  </Badge>
                </div>
              ))}
              {alerts.length === 0 && (
                <p className="text-gray-500 text-center py-4">No alerts at this time</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest inventory management activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.details}</p>
                    <p className="text-xs text-gray-600">
                      by {activity.userName} • {activity.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {activity.action}
                  </Badge>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activities</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory by Category</CardTitle>
          <CardDescription>
            Distribution of inventory value across categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topCategories.map((category) => (
              <div key={category.name} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-sm">{category.name}</h3>
                <p className="text-2xl font-bold text-primary-600">{category.count}</p>
                <p className="text-xs text-gray-600">{formatCurrency(category.value)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
