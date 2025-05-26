
import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { InventoryList } from '@/components/InventoryList';
import { AddEditItem } from '@/components/AddEditItem';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingItemId, setEditingItemId] = useState<string | undefined>();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <div className="text-white font-bold text-lg">MW</div>
          </div>
          <p className="text-gray-600">Loading M-Worx Inventory...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleEditItem = (itemId: string) => {
    setEditingItemId(itemId);
    setActiveTab('add-item');
  };

  const handleAddEditSuccess = () => {
    setEditingItemId(undefined);
    setActiveTab('inventory');
  };

  const handleAddEditCancel = () => {
    setEditingItemId(undefined);
    setActiveTab('inventory');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryList onEditItem={handleEditItem} />;
      case 'add-item':
        return (
          <AddEditItem
            itemId={editingItemId}
            onSuccess={handleAddEditSuccess}
            onCancel={handleAddEditCancel}
          />
        );
      case 'alerts':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Alerts & Notifications</h2>
            <p className="text-gray-600">Alert management interface coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Application settings coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
