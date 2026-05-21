# CREAM API - Quick Reference Guide

## 🚀 Quick Start

### 1. Login
```javascript
// In Login.js screen
dispatch({ 
  type: LOGIN_REQUEST, 
  payload: { email: "user@example.com", password: "password123" } 
});
```

### 2. Register
```javascript
// In Register.js screen
dispatch({ 
  type: REGISTER_REQUEST, 
  payload: { 
    email: "new@example.com",
    password: "securepass",
    fullName: "John Doe",
    phone: "+1234567890",
    address: "123 Main St"
  } 
});
```

### 3. Fetch Products
```javascript
// In ProductsScreen.js
useEffect(() => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });
}, [dispatch]);

const { products, isLoading, error } = useSelector(state => state.products);
```

### 4. Create Order
```javascript
// In CartScreen.js or CheckoutScreen.js
dispatch({
  type: CREATE_ORDER_REQUEST,
  payload: {
    items: [{ productId: 1, quantity: 2 }],
    shippingAddress: "456 Oak St"
  }
});
```

---

## 📌 Common Patterns

### Fetching Data with Loading State
```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, ActivityIndicator, FlatList, Text } from 'react-native';
import { FETCH_PRODUCTS_REQUEST } from '../../app/reducers/productsReducer';

const ProductsScreen = () => {
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  if (isLoading) return <ActivityIndicator size="large" />;

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      keyExtractor={item => item.id.toString()}
    />
  );
};
```

### Handling Authentication State
```javascript
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const navigation = useNavigation();
  const { isAuthenticated, token } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthNav' }],
      });
    }
  }, [isAuthenticated, token]);

  return null; // RootNav handles navigation
};
```

### Error Handling
```javascript
const handleAction = async () => {
  try {
    dispatch({ type: ACTION_REQUEST, payload: data });
  } catch (error) {
    Alert.alert('Error', 'Something went wrong');
    console.log('Error details:', error);
  }
};
```

---

## 🔑 Redux Actions Reference

### Auth Actions
```javascript
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT
} from '../../app/reducers/authReducer';

// Use in dispatch:
dispatch({ type: LOGIN_REQUEST, payload: { email, password } });
dispatch({ type: LOGOUT });
```

### Product Actions
```javascript
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_DETAILS_REQUEST,
  FETCH_PRODUCT_DETAILS_SUCCESS,
  FETCH_PRODUCT_DETAILS_FAILURE,
  CLEAR_PRODUCT_DETAILS
} from '../../app/reducers/productsReducer';

// Use in dispatch:
dispatch({ type: FETCH_PRODUCTS_REQUEST });
dispatch({ type: FETCH_PRODUCT_DETAILS_REQUEST, payload: productId });
dispatch({ type: CLEAR_PRODUCT_DETAILS });
```

### Order Actions
```javascript
import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE
} from '../../app/reducers/ordersReducer';

// Use in dispatch:
dispatch({ type: FETCH_ORDERS_REQUEST });
dispatch({ type: CREATE_ORDER_REQUEST, payload: orderData });
```

---

## 🎯 Redux State Structure

### Access Auth State
```javascript
const { user, token, isLoading, isAuthenticated, error } = 
  useSelector(state => state.auth);
```

### Access Products State
```javascript
const { products, productDetails, isLoading, isLoadingDetails, error, detailsError } = 
  useSelector(state => state.products);
```

### Access Orders State
```javascript
const { orders, isLoading, error, createOrderLoading, createOrderError } = 
  useSelector(state => state.orders);
```

### Access Cart State
```javascript
const { items, total, itemCount } = 
  useSelector(state => state.cart);
```

---

## 🔗 API Functions Reference

### Authentication APIs
```javascript
import {
  authLogin,
  authRegister,
  authMe,
  updateProfile,
  verifyEmail,
  resendVerificationEmail,
  authLogout
} from '../../app/api/auth';

// These are called by sagas, but you can use them directly if needed:
// const result = await authLogin({ email, password });
```

### Product APIs
```javascript
import {
  fetchProducts,
  fetchProductDetails
} from '../../app/api/products';

// Called with token parameter:
// const products = await fetchProducts(token);
// const details = await fetchProductDetails(token, productId);
```

### Order APIs
```javascript
import {
  fetchOrders,
  fetchOrderDetails,
  createOrder
} from '../../app/api/orders';

// Called with token parameter:
// const orders = await fetchOrders(token);
// const order = await fetchOrderDetails(token, orderId);
// const newOrder = await createOrder(token, orderData);
```

---

## 🐛 Debugging Tips

### 1. View Redux State
```javascript
// Add this to any component to inspect Redux state
const appState = useSelector(state => state);
console.log('Current Redux State:', appState);
```

### 2. Monitor API Calls
Look for console logs with emoji prefixes:
- 🔐 `[AUTH]` - Authentication operations
- 📦 `[PRODUCTS]` - Product operations
- 📋 `[ORDERS]` - Order operations
- 🔄 `[SAGA]` - Saga operations

### 3. Check Network Activity
Enable Network tab in React Native Debugger to see actual API calls and responses

### 4. Verify Token Storage
```javascript
const { token } = useSelector(state => state.auth);
console.log('Current Token:', token ? 'EXISTS' : 'MISSING');
```

---

## ⚠️ Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `No authentication token available` | User not logged in | Check if user is authenticated in RootNav |
| `401 Unauthorized` | Token expired | Implement token refresh or redirect to login |
| `Network timeout` | Backend not running | Start backend server on localhost:8000 |
| `Products not loading` | Token not passed to saga | Verify auth.token exists in Redux state |
| `CORS error` | Backend CORS not configured | Configure backend for CORS |

---

## 📝 Logging Template for New Features

When adding new functionality, follow this logging pattern:

```javascript
// In API function
console.log('🔄 [FEATURE] Starting operation');
// ... do operation ...
console.log('✅ [FEATURE] Operation successful');

// In Saga
console.log('🔄 [SAGA] Dispatching action');
// ... saga logic ...
console.log('✅ [SAGA] Action completed');

// For errors
console.log('❌ [FEATURE] Error occurred:', error.message);
```

---

## 🚀 Performance Tips

### 1. Avoid Unnecessary Re-renders
```javascript
// Use selector to pick only needed data
const products = useSelector(state => state.products.products);
// Instead of:
const entireState = useSelector(state => state);
```

### 2. Use useCallback for Handlers
```javascript
import { useCallback } from 'react';

const handlePress = useCallback(() => {
  dispatch({ type: ACTION_REQUEST });
}, [dispatch]);
```

### 3. Memoize Components
```javascript
import { memo } from 'react';

const ProductCard = memo(({ product }) => {
  return <Text>{product.name}</Text>;
});
```

---

## 🔐 Security Reminders

1. **Never store sensitive data in Redux state for long** - Token expires in 1 hour
2. **Always use HTTPS in production** - Currently set to HTTP for development
3. **Never log full tokens or passwords** - Only log first 20 characters if needed
4. **Validate input before sending to API** - Check email format, password strength
5. **Handle token expiry gracefully** - Redirect to login on 401 error

---

## 📱 Screen Component Template

```javascript
import { useState, useEffect } from 'react';
import { Alert, View, ActivityIndicator, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// Import your action types
import { ACTION_REQUEST } from '../../app/reducers/yourReducer';

const YourScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // Get state from Redux
  const { data, isLoading, error } = useSelector(state => state.yourSlice);

  // Fetch data on mount
  useEffect(() => {
    console.log('[SCREEN] YourScreen mounted, fetching data');
    dispatch({ type: ACTION_REQUEST });
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.log('[ERROR] Action failed:', error);
      Alert.alert('Error', error);
    }
  }, [error]);

  // Render
  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (!data || data.length === 0) {
    return <Text>No data available</Text>;
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <YourComponent item={item} />
      )}
      keyExtractor={item => item.id.toString()}
    />
  );
};

export default YourScreen;
```

---

## 🆘 Need Help?

### Documentation Files
- **API_IMPLEMENTATION.md** - Complete API documentation
- **CHANGES_SUMMARY.md** - Summary of all changes made
- **README.md** - Project overview

### Check These First
1. Redux DevTools to inspect state
2. Console logs with emoji prefixes
3. Network tab for API requests
4. React DevTools for component state

### Common Files to Reference
- `src/screens/auth/Login.js` - Login implementation example
- `src/screens/ProductsScreen.js` - Data fetching example
- `src/app/sagas/authSaga.js` - Saga pattern example
- `src/app/api/auth.js` - API function pattern

---

## ✅ Implementation Checklist

When integrating a new feature:
- [ ] Create API function in `src/app/api/`
- [ ] Create action types in reducer
- [ ] Create saga in `src/app/sagas/`
- [ ] Update root reducer in `src/app/reducers/index.js`
- [ ] Update root saga in `src/app/sagas/index.js`
- [ ] Create screen component or update existing
- [ ] Test with Redux DevTools
- [ ] Add console logging with emoji prefix
- [ ] Document in API_IMPLEMENTATION.md

---

## 📊 API Response Formats

### Success Response Format
```javascript
{
  data: { /* actual data */ },
  message: "Operation successful",
  status: 200
}
```

### Error Response Format
```javascript
{
  error: "error_code",
  message: "Human readable error message",
  status: 400
}
```

---

## 🎓 Learning Resources

### Redux Documentation
- https://redux.js.org/
- https://react-redux.js.org/

### Redux-Saga Documentation
- https://redux-saga.js.org/

### React Native Navigation
- https://reactnavigation.org/

### CREAM API Specification
- See API_IMPLEMENTATION.md for complete specification

---

**Last Updated:** April 23, 2026  
**Version:** 1.0  
**Status:** ✅ Ready for Development
