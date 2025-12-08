/**
 * Local Storage Utility Functions
 */

import { STORAGE_KEYS } from '@/constants';

class StorageUtils {
  // Generic storage methods
  setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error saving to localStorage: ${error}`);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) return null;
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${error}`);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  }

  // Auth-specific methods
  setAccessToken(token: string): void {
    this.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getAccessToken(): string | null {
    return this.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
  }

  setRefreshToken(token: string): void {
    this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return this.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setUserData(user: User): void {
    this.setItem(STORAGE_KEYS.USER_DATA, user);
  }

  getUserData(): User | null {
    return this.getItem<User>(STORAGE_KEYS.USER_DATA);
  }

  clearAuth(): void {
    this.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    this.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }
}

export const storageUtils = new StorageUtils();
