import { useState, useEffect } from 'react';
import { User, UserLogin, UserRegistration, UserUpdate } from '../types/user';
import { mockUsers } from '../data/mockUsers';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Simulate loading user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem('currentUser');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: UserLogin): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials against mock users
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Usuário não encontrado' };
    }

    // In a real app, you'd verify the password hash
    // For demo purposes, any password is accepted
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false
    });

    return { success: true };
  };

  const register = async (userData: UserRegistration): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    if (mockUsers.some(u => u.email === userData.email)) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Email já está em uso' };
    }

    // Check if passwords match
    if (userData.password !== userData.confirmPassword) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Senhas não coincidem' };
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      preferences: {
        newsletter: false,
        promotions: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false
    });

    return { success: true };
  };

  const updateProfile = async (updates: UserUpdate): Promise<{ success: boolean; error?: string }> => {
    if (!authState.user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedUser: User = {
      ...authState.user,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Update in mock data
    const userIndex = mockUsers.findIndex(u => u.id === authState.user!.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    setAuthState({
      user: updatedUser,
      isAuthenticated: true,
      isLoading: false
    });

    return { success: true };
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!authState.user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Remove from mock data
    const userIndex = mockUsers.findIndex(u => u.id === authState.user!.id);
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1);
    }

    localStorage.removeItem('currentUser');
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    register,
    updateProfile,
    deleteAccount,
    logout
  };
}