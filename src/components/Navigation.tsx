
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInventory } from '@/hooks/useInventory';
import { 
  Database, 
  Archive, 
  Bell, 
  Settings,
  Plus,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { alerts } = useInventory();
  
  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Database },
    { id: 'inventory', label: 'Inventory', icon: Archive },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unacknowledgedAlerts.length },
    { id: 'add-item', label: 'Add Item', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-12 w-12 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white border-r border-gray-200 w-64 h-full overflow-y-auto">
        <div className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-12 ${
                  isActive 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleTabChange(item.id)}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-50 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="grid grid-cols-2 gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`justify-start gap-2 h-12 ${
                  isActive 
                    ? 'bg-primary-600 text-white' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleTabChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-xs ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}
