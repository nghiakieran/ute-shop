/**
 * Mock Authentication Utilities
 * For testing without backend
 */

// Mock users database
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@uteshop.com',
    password: '123456',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=000&color=fff',
  },
  {
    id: '2',
    email: 'user@uteshop.com',
    password: '123456',
    name: 'John Doe',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=000&color=fff',
  },
  {
    id: '3',
    email: 'test@test.com',
    password: '123456',
    name: 'Test User',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Test+User&background=000&color=fff',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthUtils = {
  /**
   * Mock login
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await delay(800); // Simulate network delay

    const user = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    const mockUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role as 'admin' | 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      user: mockUser,
      accessToken: `mock_token_${user.id}_${Date.now()}`,
      refreshToken: `mock_refresh_${user.id}_${Date.now()}`,
    };
  },

  /**
   * Mock register
   */
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    // Password is stored but not validated in mock (use password variable to avoid unused warning)
    console.log('Register with password length:', password.length);
    await delay(800);

    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email đã được sử dụng');
    }

    const newUser: User = {
      id: `${Date.now()}`,
      email,
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=000&color=fff`,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      user: newUser,
      accessToken: `mock_token_${newUser.id}_${Date.now()}`,
      refreshToken: `mock_refresh_${newUser.id}_${Date.now()}`,
    };
  },

  /**
   * Mock get profile
   */
  getProfile: async (): Promise<User> => {
    await delay(300);

    // Return first mock user as default
    const user = MOCK_USERS[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role as 'admin' | 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Mock forgot password - send OTP
   */
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    await delay(800);

    // Check if email exists
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('Email not found');
    }

    // In real app, send OTP via email
    // For mock, we'll use fixed OTP: 123456
    console.log('🔐 Mock OTP Code:', '123456');
    console.log('📧 Sent to:', email);

    return {
      success: true,
      message: 'OTP sent successfully',
    };
  },

  /**
   * Mock verify OTP
   */
  verifyOtp: async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
    await delay(600);

    // Check if email exists
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('Email not found');
    }

    // Mock OTP is always 123456
    if (otp !== '123456') {
      throw new Error('Invalid OTP code');
    }

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  },

  /**
   * Mock reset password
   */
  resetPassword: async (email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    await delay(800);

    // Verify OTP again
    if (otp !== '123456') {
      throw new Error('Invalid OTP code');
    }

    // Check if email exists
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('Email not found');
    }

    // In real app, update password in database
    console.log('✅ Password reset successfully for:', email);
    console.log('🔑 New password:', newPassword);

    return {
      success: true,
      message: 'Password reset successfully',
    };
  },
};

// Log mock credentials for easy access
console.log('🔐 Mock Login Credentials:');
console.log('━'.repeat(50));
MOCK_USERS.forEach(user => {
  console.log(`📧 Email: ${user.email}`);
  console.log(`🔑 Password: ${user.password}`);
  console.log(`👤 Name: ${user.name}`);
  console.log('━'.repeat(50));
});

