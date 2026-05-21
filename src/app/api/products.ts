import { API_BASE_URL } from './config';

const BASE_URL = API_BASE_URL;

const defaultOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

/**
 * Get all available products
 * GET /api/customer/products
 */
export async function fetchProducts(token: string): Promise<any[]> {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    console.log('📦 [PRODUCTS] Fetching all products');
    
    const response = await fetch(`${BASE_URL}/customer/products`, {
      method: 'GET',
      headers: {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    console.log('✅ [PRODUCTS] Fetch products response status:', response.status);
    
    if (response.ok) {
      return Array.isArray(data) ? data : data.products || data;
    } else {
      throw new Error(data.message || 'Failed to fetch products');
    }
  } catch (error: any) {
    console.log('❌ [PRODUCTS] Fetch products error:', error.message);
    throw error;
  }
}

/**
 * Get single product details
 * GET /api/customer/products/{id}
 */
export async function fetchProductDetails(token: string, productId: string | number): Promise<any> {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    if (!productId) {
      throw new Error('Product ID is required');
    }
    
    console.log(`🔍 [PRODUCTS] Fetching product details for ID: ${productId}`);
    
    const response = await fetch(`${BASE_URL}/customer/products/${productId}`, {
      method: 'GET',
      headers: {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    console.log('✅ [PRODUCTS] Fetch product details response status:', response.status);
    
    if (response.ok) {
      return data.product || data;
    } else {
      throw new Error(data.error === 'not_found' ? 'Product not found' : (data.message || 'Failed to fetch product details'));
    }
  } catch (error: any) {
    console.log('❌ [PRODUCTS] Fetch product details error:', error.message);
    throw error;
  }
}
