import axios from 'axios';
import { User } from '../contexts/AuthContext';
import { mockUsers } from '../data/mockData';

// Mock API implementation
// In a real app, you would replace these with actual API calls
class AuthService {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate authentication
    const user = mockUsers.find(u => u.email === email && password === 'password');
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Store token in localStorage
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  }
  
  async register(userData: any): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: 'employee', // Default role for new registrations
      department: userData.department || 'General',
      position: userData.position || 'Staff',
      joinDate: new Date().toISOString(),
    };
    
    // Store token in localStorage
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return newUser;
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  async getCurrentUser(): Promise<User | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (!token || !userJson) {
      return null;
    }
    
    try {
      return JSON.parse(userJson) as User;
    } catch (error) {
      console.error('Failed to parse user data', error);
      return null;
    }
  }
  
  async forgotPassword(email: string): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, you would send an email with reset instructions
    console.log(`Password reset requested for ${email}`);
  }
  
  // For a real implementation, you would add methods for:
  // - resetPassword
  // - updateProfile
  // - changePassword
  // - verifyEmail
}

export const authService = new AuthService();