
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInventory } from '@/hooks/useInventory';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  Package,
  Filter,
  Check
} from 'lucide-react';
import { useState } from 'react';

export function AlertsManagement() {
  const { alerts, acknowledgeAlert, inventory } = useInventory();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredAlerts = alerts.filter(alert => {
    const statusMatch = filter === 'all' || 
      (filter === 'acknowledged' && alert.acknowledged) ||
      (filter === 'unacknowledged' && !alert.acknowledged);
    
    const severityMatch = severityFilter === 'all' || alert.severity === severityFilter;
    
    return statusMatch && severityMatch;
  });

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId);
    toast({
      title: "Alert Acknowledged",
      description: "The alert has been marked as acknowledged.",
    });
  };

  const handleAcknowledgeAll = () => {
    const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
    unacknowledgedAlerts.forEach(alert => acknowledgeAlert(alert.id));
    toast({
      title: "All Alerts Acknowledged",
      description: `${unacknowledgedAlerts.length} alerts have been acknowledged.`,
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Bell className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'out_of_stock':
        return 'Out of Stock';
      case 'low_stock':
        return 'Low Stock';
      case 'reorder_needed':
        return 'Reorder Needed';
      default:
        return type;
    }
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alert Management</h1>
          <p className="text-gray-600">Manage inventory alerts and notifications</p>
        </div>
        
        {unacknowledgedCount > 0 && (
          <Button onClick={handleAcknowledgeAll} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Acknowledge All ({unacknowledgedCount})
          </Button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">
                  {alerts.filter(a => a.severity === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unacknowledged</p>
                <p className="text-2xl font-bold">{unacknowledgedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold">
                  {alerts.filter(a => a.type === 'out_of_stock').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All Alerts
              </Button>
              <Button
                variant={filter === 'unacknowledged' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unacknowledged')}
              >
                Unacknowledged
              </Button>
              <Button
                variant={filter === 'acknowledged' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('acknowledged')}
              >
                Acknowledged
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={severityFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('all')}
              >
                All Severities
              </Button>
              <Button
                variant={severityFilter === 'high' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('high')}
              >
                High
              </Button>
              <Button
                variant={severityFilter === 'medium' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('medium')}
              >
                Medium
              </Button>
              <Button
                variant={severityFilter === 'low' ? 'outline' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('low')}
              >
                Low
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>
            {filteredAlerts.length} alert(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No alerts match your current filters</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <Alert key={alert.id} className={`${alert.acknowledged ? 'opacity-75' : ''}`}>
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-start gap-3 flex-1">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{alert.itemName}</h4>
                          <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(alert.type)}
                          </Badge>
                          {alert.acknowledged && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              <Check className="h-3 w-3 mr-1" />
                              Acknowledged
                            </Badge>
                          )}
                        </div>
                        <AlertDescription className="text-sm">
                          {alert.message}
                        </AlertDescription>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            Current: {alert.currentQuantity}
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Reorder at: {alert.reorderPoint}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledge(alert.id)}
                        className="ml-4 flex-shrink-0"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </Alert>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
