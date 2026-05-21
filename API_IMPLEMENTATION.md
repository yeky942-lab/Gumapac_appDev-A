# CREAM API Implementation Guide

## Overview
This document provides a comprehensive guide to the CREAM API integration in the Sweet Scoops React Native mobile app. The API uses JWT Bearer authentication and is structured around customer operations.

## Base Configuration

**API Base URL:** `http://localhost:8000/api`  
**Authentication Type:** JWT Bearer Token  
**Token Lifetime:** 3600 seconds (1 hour)

### API Configuration Location
- File: [src/app/api/config.js](src/app/api/config.js)
- Environment: Development (localhost) and Production (same for now)

---

## Authentication System

### Token Management
- **Storage:** JWT tokens are stored exclusively in Redux state (not in AsyncStorage)
- **Token Flow:** Redux → Saga → API Calls
- **State Location:** `state.auth.token`

### Authentication Header Format
```javascript
Authorization: Bearer <jwt-token>
```

---

## API Endpoints Implementation

### 1. Public Authentication Endpoints (No Token Required)

#### 1.1 Login - Get JWT Token
**POST** `/api/login`

**File:** [src/app/api/auth.js](src/app/api/auth.js)  
**Function:** `authLogin(email, password)`

**Request:**
```javascript
{
  email: "user@example.com",
  password: "password123"
}
```

**Success Response (200):**
```javascript
{
  token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
  refresh_token: "abc123def456..."
}
```

**Redux Flow:**
```
LOGIN_REQUEST → authLogin API → LOGIN_SUCCESS → GET_USER_REQUEST
```

**Saga File:** [src/app/sagas/authSaga.js](src/app/sagas/authSaga.js)

---

#### 1.2 Customer Registration
**POST** `/api/customer/register`

**File:** [src/app/api/auth.js](src/app/api/auth.js)  
**Function:** `authRegister(email, password, fullName, phone, address)`

**Request:**
```javascript
{
  email: "newuser@example.com",
  password: "securepassword",
  fullName: "Jane Doe",
  phone: "+1234567890",
  address: "456 Oak Street"
}
```

**Success Response (200):**
```javascript
{
  message: "Registration successful. Please check your email to verify your account.",
  email: "newuser@example.com"
}
```

**Redux Flow:**
```
REGISTER_REQUEST → authRegister API → REGISTER_SUCCESS
```

**Screen:** [src/screens/auth/Register.js](src/screens/auth/Register.js)

---

#### 1.3 Verify Email
**GET** `/api/verify-email?token={verification_token}`

**File:** [src/app/api/auth.js](src/app/api/auth.js)  
**Function:** `verifyEmail(token)`

**Query Parameters:**
- `token` (string, required) - The verification token from email

**Success Response (200):**
```javascript
{
  message: "Your email has been successfully verified"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid verification token

---

#### 1.4 Resend Verification Email
**POST** `/api/resend-verification`

**File:** [src/app/api/auth.js](src/app/api/auth.js)  
**Function:** `resendVerificationEmail(email)`

**Request:**
```javascript
{
  email: "user@example.com"
}
```

**Success Response (200):**
```javascript
{
  message: "Verification email sent successfully"
}
```

**Status Codes:**
- 200: Success
- 404: No account found with this email

---

### 2. Protected Product Endpoints (JWT Required)

#### 2.1 Get All Available Products
**GET** `/api/customer/products`

**File:** [src/app/api/products.js](src/app/api/products.js)  
**Function:** `fetchProducts(token)`

**Success Response (200):**
```javascript
[
  {
    id: 1,
    name: "Premium Ice Cream",
    price: "12.99",
    category: "Premium",
    stock: 25,
    isLimited: false,
    isActive: true
  }
]
```

**Redux Flow:**
```
FETCH_PRODUCTS_REQUEST → fetchProducts API → FETCH_PRODUCTS_SUCCESS
```

**Saga File:** [src/app/sagas/productsSaga.js](src/app/sagas/productsSaga.js)

---

#### 2.2 Get Single Product Details
**GET** `/api/customer/products/{id}`

**File:** [src/app/api/products.js](src/app/api/products.js)  
**Function:** `fetchProductDetails(token, productId)`

**Path Parameters:**
- `id` (integer, required) - Product ID

**Success Response (200):**
```javascript
{
  id: 1,
  name: "Premium Ice Cream",
  description: "Delicious vanilla flavor",
  price: "12.99",
  category: "Premium",
  stock: 25,
  isLimited: false,
  isActive: true
}
```

**Redux Flow:**
```
FETCH_PRODUCT_DETAILS_REQUEST → fetchProductDetails API → FETCH_PRODUCT_DETAILS_SUCCESS
```

---

### 3. Protected Order Endpoints (JWT Required)

#### 3.1 Get All User's Orders
**GET** `/api/customer/orders`

**File:** [src/app/api/orders.js](src/app/api/orders.js)  
**Function:** `fetchOrders(token)`

**Success Response (200):**
```javascript
[
  {
    id: 1,
    orderNumber: "ORD64a2f8c1b2d3e",
    status: "completed",
    total: "38.97",
    date: "2024-01-20T14:30:00+00:00"
  }
]
```

**Redux Flow:**
```
FETCH_ORDERS_REQUEST → fetchOrders API → FETCH_ORDERS_SUCCESS
```

**Saga File:** [src/app/sagas/ordersSaga.js](src/app/sagas/ordersSaga.js)

---

#### 3.2 Get Single Order Details
**GET** `/api/customer/orders/{id}`

**File:** [src/app/api/orders.js](src/app/api/orders.js)  
**Function:** `fetchOrderDetails(token, orderId)`

**Path Parameters:**
- `id` (integer, required) - Order ID

**Success Response (200):**
```javascript
{
  id: 1,
  orderNumber: "ORD64a2f8c1b2d3e",
  status: "completed",
  total: "38.97",
  date: "2024-01-20T14:30:00+00:00",
  items: [
    {
      product: "Premium Ice Cream",
      quantity: 3,
      price: "12.99"
    }
  ]
}
```

---

#### 3.3 Create New Order
**POST** `/api/customer/orders`

**File:** [src/app/api/orders.js](src/app/api/orders.js)  
**Function:** `createOrder(token, orderData)`

**Request:**
```javascript
{
  items: [
    {
      productId: 1,
      quantity: 3
    }
  ],
  shippingAddress: "123 Main St"
}
```

**Success Response (200):**
```javascript
{
  id: 1,
  orderNumber: "ORD64a2f8c1b2d3e",
  status: "pending",
  total: "38.97",
  date: "2024-01-20T14:30:00+00:00"
}
```

**Redux Flow:**
```
CREATE_ORDER_REQUEST → createOrder API → CREATE_ORDER_SUCCESS → CLEAR_CART
```

---

### 4. Protected User Profile Endpoints (JWT Required)

#### 4.1 Get User Profile
**GET** `/api/customer/profile`

**File:** [src/app/api/auth.js](src/app/api/auth.js)  
**Function:** `authMe(token)`

**Success Response (200):**
```javascript
{
  id: 1,
  email: "user@example.com",
  fullName: "John Doe",
  phone: "+1234567890",
  address: "123 Main St"
}
```

**Redux Flow:**
```
GET_USER_REQUEST → authMe API → GET_USER_SUCCESS
```

---

#### 4.2 Update User Profile
**PUT** `/api/customer/profile`

**File:** [src/app/api/auth.js](src/app/api/auth.js)  
**Function:** `updateProfile(token, profileData)`

**Request:**
```javascript
{
  fullName: "Jane Doe",
  phone: "+1234567890",
  address: "456 Oak Street"
}
```

**Success Response (200):**
```javascript
{
  id: 1,
  email: "user@example.com",
  fullName: "Jane Doe",
  phone: "+1234567890",
  address: "456 Oak Street"
}
```

---

### 5. Logout
**POST** `/api/logout`

**File:** [src/app/api/auth.js](src/app/api/auth.js)  
**Function:** `authLogout(token)`

**Redux Flow:**
```
LOGOUT → authLogout API → Redux State Reset
```

---

## Redux State Architecture

### Auth State
```javascript
{
  user: { /* user object */ } | null,
  token: "jwt_token_string" | null,
  isLoading: boolean,
  isAuthenticated: boolean,
  error: string | null,
  registerSuccess: boolean
}
```

**Files:**
- Reducer: [src/app/reducers/authReducer.js](src/app/reducers/authReducer.js)
- Saga: [src/app/sagas/authSaga.js](src/app/sagas/authSaga.js)

### Products State
```javascript
{
  products: [ /* product array */ ],
  productDetails: { /* single product */ } | null,
  isLoading: boolean,
  isLoadingDetails: boolean,
  error: string | null,
  detailsError: string | null
}
```

**Files:**
- Reducer: [src/app/reducers/productsReducer.js](src/app/reducers/productsReducer.js)
- Saga: [src/app/sagas/productsSaga.js](src/app/sagas/productsSaga.js)

### Orders State
```javascript
{
  orders: [ /* order array */ ],
  isLoading: boolean,
  error: string | null,
  createOrderLoading: boolean,
  createOrderError: string | null
}
```

**Files:**
- Reducer: [src/app/reducers/ordersReducer.js](src/app/reducers/ordersReducer.js)
- Saga: [src/app/sagas/ordersSaga.js](src/app/sagas/ordersSaga.js)

---

## Error Handling

### Standard HTTP Status Codes
| Code | Meaning | Handling |
|------|---------|----------|
| 200 | Success | Return data |
| 400 | Bad Request | Show user-friendly error message |
| 401 | Unauthorized | Redirect to login |
| 404 | Not Found | Show "Not found" message |
| 500 | Server Error | Show "Something went wrong" message |

### Error Flow
```
API Error → Saga catches error → PUT action with error message
→ Reducer updates error state → Component shows alert/message
```

---

## Data Models

### User Model
```javascript
{
  id: number,
  email: string,
  fullName: string,
  phone: string,
  address: string,
  isVerified: boolean,
  isActive: boolean,
  createdAt: string (ISO 8601 date)
}
```

### Product Model
```javascript
{
  id: number,
  name: string,
  description: string,
  price: string (decimal as string),
  category: string,
  stock: number,
  isLimited: boolean,
  isActive: boolean
}
```

### Order Model
```javascript
{
  id: number,
  orderNumber: string,
  status: "pending" | "processing" | "completed" | "cancelled",
  total: string (decimal as string),
  date: string (ISO 8601 date),
  items: [
    {
      product: string,
      quantity: number,
      price: string
    }
  ]
}
```

---

## Screen Integration

### Authentication Screens
- **[src/screens/auth/Login.js](src/screens/auth/Login.js)** - Login screen
  - Dispatches: `LOGIN_REQUEST`
  - Uses: `useSelector` for loading, error, isAuthenticated

- **[src/screens/auth/Register.js](src/screens/auth/Register.js)** - Registration screen
  - Dispatches: `REGISTER_REQUEST`
  - Fields: email, password, fullName, phone, address

### Product Screens
- **[src/screens/ProductsScreen.js](src/screens/ProductsScreen.js)** - Product listing
  - Dispatches: `FETCH_PRODUCTS_REQUEST`
  - Uses: `products`, `isLoading`

- **[src/screens/ProductDetailScreen.js](src/screens/ProductDetailScreen.js)** - Product details
  - Dispatches: `FETCH_PRODUCT_DETAILS_REQUEST`
  - Uses: `productDetails`, `isLoadingDetails`

### Order Screens
- **[src/screens/OrdersScreen.js](src/screens/OrdersScreen.js)** - Order listing
  - Dispatches: `FETCH_ORDERS_REQUEST`
  - Uses: `orders`, `isLoading`

- **[src/screens/OrderDetailScreen.js](src/screens/OrderDetailScreen.js)** - Order details
  - Dispatches: `FETCH_ORDER_DETAILS_REQUEST`
  - Uses: `orderDetails`, `isLoadingDetails`

### Other Screens
- **[src/screens/ProfileScreen.js](src/screens/ProfileScreen.js)** - User profile
  - Uses: `user` from auth state

---

## Common Implementation Patterns

### Dispatching an API Request
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_PRODUCTS_REQUEST } from '../../app/reducers/productsReducer';

const MyScreen = () => {
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });
  }, [dispatch]);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
};
```

### Error Handling in Screens
```javascript
useEffect(() => {
  if (error) {
    console.log('❌ Error occurred:', error);
    Alert.alert('Error', error);
  }
}, [error]);
```

---

## Logging System

### Log Prefixes
- 🔐 `[AUTH]` - Authentication operations
- 📦 `[PRODUCTS]` - Product operations
- 📋 `[ORDERS]` - Order operations
- 🔄 `[SAGA]` - Redux saga operations
- ✅ - Success operations
- ❌ - Error operations
- ⚠️ - Warning operations

### Example Logs
```
🔐 [AUTH] Attempting login with email: user@example.com
✅ [AUTH] Login response status: 200
🔄 [SAGA] Fetching all products
✅ [SAGA] Products fetched successfully
❌ [SAGA] Fetch products error: No authentication token available
```

---

## Development Tips

### Testing API Calls Locally
1. Ensure backend server is running on `http://localhost:8000`
2. Check network logs in React Native debugger
3. Monitor console logs for [AUTH], [PRODUCTS], [ORDERS] prefixes

### Common Issues & Solutions

**Issue:** "No authentication token available"
- **Solution:** Ensure user is logged in and token is stored in Redux state

**Issue:** "401 Unauthorized"
- **Solution:** Token may have expired (1 hour TTL). User needs to login again.

**Issue:** "CORS errors"
- **Solution:** Verify backend is properly configured for CORS

**Issue:** "Network timeout"
- **Solution:** Check if backend server is running. API timeout is set to 30 seconds.

---

## Security Considerations

1. **Token Storage:** Tokens are stored in Redux state only, NOT in AsyncStorage
2. **Token Lifetime:** 1 hour - implement automatic logout after expiry
3. **Sensitive Data:** Passwords are only transmitted during login/register
4. **HTTPS:** Use HTTPS in production (currently set to HTTP for development)

---

## API Response Handling

All API functions follow this pattern:
1. Log the operation (with emoji prefix)
2. Validate input
3. Make fetch request
4. Parse response JSON
5. Check `response.ok` status
6. Return data or throw error
7. Log result (success or error)

### Example API Function Structure
```javascript
export async function fetchProducts(token) {
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
  } catch (error) {
    console.log('❌ [PRODUCTS] Fetch products error:', error.message);
    throw error;
  }
}
```

---

## Next Steps & Future Enhancements

### Implemented
- ✅ Login & Registration
- ✅ JWT Token Management
- ✅ Product Listing & Details
- ✅ Order Listing & Details
- ✅ User Profile Retrieval
- ✅ Order Creation
- ✅ Email Verification Endpoints

### To Implement
- [ ] Email Verification UI Flow
- [ ] Password Reset Flow
- [ ] Profile Update Screen
- [ ] Cart Management Integration
- [ ] Payment Processing Integration
- [ ] Real-time Order Status Updates
- [ ] Push Notifications

---

## File Structure Summary

```
src/app/
├── api/
│   ├── config.js          (API configuration)
│   ├── auth.js            (Auth endpoints)
│   ├── products.js        (Product endpoints)
│   └── orders.js          (Order endpoints)
├── reducers/
│   ├── authReducer.js     (Auth state)
│   ├── productsReducer.js (Product state)
│   ├── ordersReducer.js   (Order state)
│   └── cartReducer.js     (Cart state)
└── sagas/
    ├── authSaga.js        (Auth saga)
    ├── productsSaga.js    (Product saga)
    └── ordersSaga.js      (Order saga)
```

---

**Last Updated:** April 23, 2026  
**API Version:** CREAM API v1.0  
**App Version:** 0.0.1
