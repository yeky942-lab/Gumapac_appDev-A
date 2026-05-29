import { API_BASE_URL } from './config';

const BASE_URL = API_BASE_URL;

const defaultOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

// NOTE: AsyncStorage removed - all auth data managed exclusively in Redux Reducer
// All tokens are managed by Redux state only

/**
 * Helper function to safely parse JSON response
 */
async function parseResponse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');
  const text = await response.text();
  
  console.log(`[API] Response status: ${response.status}, content-type: ${contentType}`);
  
  // Check if response is HTML (error page from server)
  if (text.startsWith('<')) {
    console.log('[API] Server returned HTML instead of JSON - possible backend error');
    throw new Error('Backend server error - received HTML response. Please check backend API status.');
  }
  
  // Try to parse as JSON
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log('[API] Failed to parse response as JSON:', e);
    throw new Error('Invalid response format from server');
  }
}

/**
 * Login - Get JWT Token
 * POST /api/login
 */
export async function authLogin({ email, password }: { email: string; password: string }): Promise<{ token: string; user?: any }> {
  try {
    console.log('🔐 [AUTH] Attempting login with email:', email);
    console.log(`🔐 [AUTH] Calling endpoint: ${BASE_URL}/login`);
    
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      ...defaultOptions,
      body: JSON.stringify({ email, password }),
    });
    
    const data = await parseResponse(response);
    console.log('✅ [AUTH] Login response status:', response.status);
    
    if (response.ok) {
      if (data.token) {
        // Token returned to be managed by Redux Reducer only - NOT stored locally
        return data;
      } else {
        throw new Error('No token received from server');
      }
    } else {
      throw new Error(data.message || data.detail || 'Login failed');
    }
  } catch (error: any) {
    console.log('❌ [AUTH] Login error:', error.message);
    throw error;
  }
}

/**
 * Customer Registration
 * POST /api/customer/register
 */
export async function authRegister({ email, password, fullName, phone, address }: { email: string; password: string; fullName?: string; phone?: string; address?: string }): Promise<any> {
  try {
    console.log('📝 [AUTH] Attempting registration with email:', email);
    console.log(`📝 [AUTH] Calling endpoint: ${BASE_URL}/customer/register`);
    
    const response = await fetch(`${BASE_URL}/customer/register`, {
      method: 'POST',
      ...defaultOptions,
      body: JSON.stringify({ 
        email, 
        password, 
        fullName: fullName || '', 
        phone: phone || '',
        address: address || ''
      }),
    });
    
    const data = await parseResponse(response);
    console.log('✅ [AUTH] Registration response status:', response.status);
    
    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      throw new Error(data.error || data.message || 'Registration failed');
    }
  } catch (error: any) {
    console.log('❌ [AUTH] Registration error:', error.message);
    throw error;
  }
}

/**
 * Verify Email
 * GET /api/verify-email?token={verification_token}
 */
export async function verifyEmail(token: string): Promise<{ success: boolean; message?: string }> {
  try {
    console.log('✉️ [AUTH] Verifying email with token');
    
    const response = await fetch(`${BASE_URL}/verify-email?token=${token}`, {
      method: 'GET',
      ...defaultOptions,
    });
    
    const data = await parseResponse(response);
    console.log('✅ [AUTH] Email verification response status:', response.status);
    
    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      throw new Error(data.error || data.message || 'Email verification failed');
    }
  } catch (error: any) {
    console.log('❌ [AUTH] Email verification error:', error.message);
    throw error;
  }
}

/**
 * Resend Verification Email
 * POST /api/resend-verification
 */
export async function resendVerificationEmail(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    console.log('✉️ [AUTH] Resending verification email to:', email);
    
    const response = await fetch(`${BASE_URL}/resend-verification`, {
      method: 'POST',
      ...defaultOptions,
      body: JSON.stringify({ email }),
    });
    
    const data = await parseResponse(response);
    console.log('✅ [AUTH] Resend verification response status:', response.status);
    
    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      throw new Error(data.error || data.message || 'Failed to resend verification email');
    }
  } catch (error: any) {
    console.log('❌ [AUTH] Resend verification error:', error.message);
    throw error;
  }
}

/**
 * Get current user profile
 * GET /api/customer/profile
 * Token passed from Redux state - NOT retrieved from local storage
 */
export async function authMe(token: string): Promise<{ user: any; success: boolean }> {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    console.log('👤 [AUTH] Fetching user profile');
    
    const response = await fetch(`${BASE_URL}/customer/profile`, {
      method: 'GET',
      headers: {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await parseResponse(response);
    console.log('✅ [AUTH] User profile response status:', response.status);
    
    if (response.ok) {
      // Handle different response structures
      return { user: data.user || data, success: true };
    } else {
      throw new Error(data.message || data.detail || 'Failed to fetch user profile');
    }
  } catch (error: any) {
    console.log('❌ [AUTH] authMe error:', error.message);
    throw error;
  }
}

/**
 * Update user profile
 * PUT /api/customer/profile
 */
export async function updateProfile(token: string, profileData: any): Promise<{ user: any; success: boolean }> {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    console.log('✏️ [AUTH] Updating user profile');
    
    const response = await fetch(`${BASE_URL}/customer/profile`, {
      method: 'PUT',
      headers: {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    const data = await parseResponse(response);
    console.log('✅ [AUTH] Profile update response status:', response.status);
    
    if (response.ok) {
      return { user: data.user || data, success: true };
    } else {
      throw new Error(data.message || data.detail || 'Failed to update profile');
    }
  } catch (error: any) {
    console.log('❌ [AUTH] Update profile error:', error.message);
    throw error;
  }
}

/**
 * Register FCM token
 * POST /api/fcm/token
 */
export async function registerFCMToken(token: string, fcmToken: string, deviceName?: string, deviceType?: string): Promise<{ success: boolean; message?: string }> {
  try {
    console.log('📱 [FCM] Registering FCM token with backend');
    
    const response = await fetch(`${BASE_URL}/fcm/token`, {
      method: 'POST',
      headers: {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        token: fcmToken,
        device_name: deviceName || 'Android Device',
        device_type: deviceType || 'android'
      }),
    });
    
    const data = await parseResponse(response);
    console.log('✅ [FCM] FCM token registration response status:', response.status);
    
    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      throw new Error(data.error || data.message || 'Failed to register FCM token');
    }
  } catch (error: any) {
    console.log('❌ [FCM] FCM token registration error:', error.message);
    throw error;
  }
}

/**
 * Logout
 * Token passed from Redux state - no local storage operations
 */
export async function authLogout(token: string | null): Promise<{ success: boolean }> {
  try {
    if (token) {
      // Call logout API (optional)
      try {
        console.log('🚪 [AUTH] Calling logout API');
        
        const response = await fetch(`${BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            ...defaultOptions.headers,
            'Authorization': `Bearer ${token}`,
          },
        });
        
        try {
          await parseResponse(response);
        } catch (e) {
          // Logout endpoint might not return JSON, so we ignore parse errors
          console.log('ℹ️ [AUTH] Logout response parsing note:', (e as Error).message);
        }
        
        console.log('✅ [AUTH] Logout API call completed');
      } catch (apiError: any) {
        console.log('ℹ️ [AUTH] Logout API error (non-critical):', apiError.message);
      }
    }
    
    return { success: true };
  } catch (error: any) {
    console.log('ℹ️ [AUTH] Logout error:', error.message);
    return { success: true }; // Still return success even if API fails
  }
}