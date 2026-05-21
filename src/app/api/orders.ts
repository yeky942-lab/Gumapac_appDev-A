import { API_BASE_URL } from './config';

const BASE_URL = API_BASE_URL;

const defaultOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

/**
 * Get all user's orders
 * GET /api/customer/orders
 */
export async function fetchOrders(token: string): Promise<any[]> {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    console.log('📋 [ORDERS] Fetching all orders');
    
    const response = await fetch(`${BASE_URL}/customer/orders`, {
      method: 'GET',
      headers: {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    console.log('✅ [ORDERS] Fetch orders response status:', response.status);
    
    if (response.ok) {
      return Array.isArray(data) ? data : data.orders || data;
    } else {
      throw new Error(data.message || 'Failed to fetch orders');
    }
  } catch (error: any) {
    console.log('❌ [ORDERS] Fetch orders error:', error.message);
    throw error;
  }
}

/**
 * Get single order details
 * GET /api/customer/orders/{id}
 */
export async function fetchOrderDetails(token: string, orderId: string | number): Promise<any> {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    if (!orderId) {
      throw new Error('Order ID is required');
    }
    
    console.log(`🔍 [ORDERS] Fetching order details for ID: ${orderId}`);
    
    const response = await fetch(`${BASE_URL}/customer/orders/${orderId}`, {
      method: 'GET',
      headers: {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    console.log('✅ [ORDERS] Fetch order details response status:', response.status);
    
    if (response.ok) {
      return data.order || data;
    } else {
      throw new Error(data.error === 'not_found' ? 'Order not found' : (data.message || 'Failed to fetch order details'));
    }
  } catch (error: any) {
    console.log('❌ [ORDERS] Fetch order details error:', error.message);
    throw error;
  }
}

/**
 * Create new order
 * POST /api/customer/orders
 */
export async function createOrder(token: string, orderData: any): Promise<any> {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    if (!orderData) {
      throw new Error('Order data is required');
    }
    
    console.log('➕ [ORDERS] Creating new order');
    
    const response = await fetch(`${BASE_URL}/customer/orders`, {
      method: 'POST',
      headers: {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    
    const data = await response.json();
    console.log('✅ [ORDERS] Create order response status:', response.status);
    
    if (response.ok) {
      return data.order || data;
    } else {
      throw new Error(data.message || 'Failed to create order');
    }
  } catch (error: any) {
    console.log('❌ [ORDERS] Create order error:', error.message);
    throw error;
  }
}
