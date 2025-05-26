
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/inventory';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@mworx.com',
    name: 'M-Worx Administrator',
    role: 'admin',
    lastLogin: new Date(),
    isActive: true
  },
  {
    id: '2',
    email: 'manager@mworx.com',
    name: 'Inventory Manager',
    role: 'manager',
    lastLogin: new Date(),
    isActive: true
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('mworx_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('mworx_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in production, this would be a real API call
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser && (password === 'mworx123' || password === 'admin123')) {
      const authenticatedUser = {
        ...foundUser,
        lastLogin: new Date()
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('mworx_user', JSON.stringify(authenticatedUser));
      
      // Log the activity
      const activities = JSON.parse(localStorage.getItem('mworx_activities') || '[]');
      activities.unshift({
        id: Date.now().toString(),
        userId: authenticatedUser.id,
        userName: authenticatedUser.name,
        action: 'login',
        details: 'User logged in successfully',
        timestamp: new Date()
      });
      localStorage.setItem('mworx_activities', JSON.stringify(activities.slice(0, 50)));
      
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    if (user) {
      // Log the activity
      const activities = JSON.parse(localStorage.getItem('mworx_activities') || '[]');
      activities.unshift({
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        action: 'logout',
        details: 'User logged out',
        timestamp: new Date()
      });
      localStorage.setItem('mworx_activities', JSON.stringify(activities.slice(0, 50)));
    }
    
    setUser(null);
    localStorage.removeItem('mworx_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
