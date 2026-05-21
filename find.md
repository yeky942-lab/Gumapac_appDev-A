# Complete Line-by-Line Code Explanation for `src/` Directory

This document provides a detailed explanation of every line in all files within the `src` directory of the Kent App (React Native Pet Appointment App).

---

## Table of Contents
1. [App.js (Root)](#appjs-root)
2. [App Directory](#app-directory)
3. [Components Directory](#components-directory)
4. [Navigations Directory](#navigations-directory)
5. [Screens Directory](#screens-directory)
6. [Utils Directory](#utils-directory)

---

## App.js (Root)

**Purpose**: Main entry point of the React Native application. Sets up Redux store, persistence, navigation, and suppresses development warnings.

```javascript
import React from 'react';
```
- **Line 1**: Imports React library, required for JSX and React components

```javascript
import { NavigationContainer } from '@react-navigation/native';
```
- **Line 2**: Imports NavigationContainer from React Navigation
  - Wraps the entire app to enable navigation between screens
  - Manages navigation state and provides context to child components

```javascript
import { Provider } from 'react-redux';
```
- **Line 3**: Imports Provider from react-redux
  - Connects Redux store to React components
  - Makes store available to all components via context

```javascript
import { LogBox } from 'react-native';
```
- **Line 4**: Imports LogBox from React Native
  - Used to suppress or customize console warnings in development

```javascript
import { PersistGate } from 'redux-persist/integration/react';
```
- **Line 5**: Imports PersistGate from redux-persist
  - Delays app rendering until persisted state is rehydrated
  - Shows loading screen while restoring state from AsyncStorage

```javascript
import { store, persistor } from './src/app/store';
```
- **Line 6**: Imports Redux store and persistor from the store configuration
  - store: The main Redux store instance
  - persistor: Object that manages persistence and rehydration

```javascript
import AuthNav from './src/navigations/RootNav';
```
- **Line 7**: Imports the root navigation component
  - Handles authentication-based navigation (Auth vs Main screens)

```javascript
LogBox.ignoreLogs([
  'Deep imports from the \'react-native\' package are deprecated',
  'InteractionManager has been deprecated'
]);
```
- **Lines 10-13**: Suppresses specific React Native warnings in development
  - 'Deep imports': Warning about importing from sub-paths in react-native
  - 'InteractionManager': Deprecated API warning
  - Keeps console clean during development

```javascript
const App = () => {
```
- **Line 15**: Defines the main App component as an arrow function

```javascript
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <AuthNav />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
```
- **Lines 16-24**: Returns the app structure with nested providers
  - Provider: Wraps app with Redux store
  - PersistGate: Handles state rehydration (loading={null} shows nothing while loading)
  - NavigationContainer: Enables navigation throughout the app
  - AuthNav: Root navigation component that switches based on auth state

```javascript
};

export default App;
```
- **Lines 25-27**: Closes the component and exports it as default
  - This is the entry point that React Native uses to render the app

---

## App Directory

### src/app/store.js

**Purpose**: Configures the Redux store with Redux Persist for persistent state management and Redux Saga middleware for handling side effects.

```javascript
import { createStore, applyMiddleware } from 'redux';
```
- **Line 1**: Imports `createStore` and `applyMiddleware` from Redux library
  - `createStore`: Creates a Redux store instance
  - `applyMiddleware`: Middleware function that allows injecting custom middleware into the store

```javascript
import createSagaMiddleware from 'redux-saga';
```
- **Line 2**: Imports the Saga middleware factory from redux-saga
  - Allows handling of asynchronous side effects like API calls

```javascript
import { persistStore, persistReducer } from 'redux-persist';
```
- **Line 3**: Imports functions to persist Redux state to AsyncStorage
  - `persistReducer`: Wraps the root reducer with persistence logic
  - `persistStore`: Creates a persistor object to manage rehydration

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
```
- **Line 4**: Imports React Native's AsyncStorage
  - Used as the storage engine for persisting state

```javascript
import rootReducer from './reducers';
```
- **Line 5**: Imports the combined root reducer containing all app reducers

```javascript
import rootSaga from './sagas';
```
- **Line 6**: Imports the root saga that watches for all dispatched actions

```javascript
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [],
};
```
- **Lines 9-13**: Configures persistence settings
  - `key: 'root'`: Identifier for the persisted state in AsyncStorage
  - `storage: AsyncStorage`: Uses React Native AsyncStorage as the storage backend
  - `whitelist: []`: Empty array means NO reducers are persisted to storage (user logging out on app close)

```javascript
const persistedReducer = persistReducer(persistConfig, rootReducer);
```
- **Line 15**: Wraps the root reducer with the persist configuration
  - This creates a new reducer that handles rehydration from storage

```javascript
const sagaMiddleware = createSagaMiddleware();
```
- **Line 18**: Creates the saga middleware instance
  - Will be used to run sagas and handle async side effects

```javascript
export const store = createStore(
  persistedReducer,
  applyMiddleware(sagaMiddleware)
);
```
- **Lines 21-24**: Creates and exports the Redux store
  - Passes the persisted reducer and saga middleware to createStore
  - This is the centralized state management hub of the app

```javascript
sagaMiddleware.run(rootSaga);
```
- **Line 27**: Starts running the root saga
  - Saga watchers now listen for all dispatched actions

```javascript
export const persistor = persistStore(store);
```
- **Line 30**: Creates and exports a persistor object
  - Used by PersistGate to rehydrate state on app startup

---

### src/app/reducers/authReducer.js

**Purpose**: Manages authentication state (login, register, logout) with Redux. Handles user data, tokens, loading states, and error messages.

```javascript
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
```
- **Lines 1-3**: Define action type constants for login flow
  - `LOGIN_REQUEST`: Dispatched when login is initiated
  - `LOGIN_SUCCESS`: Dispatched when login succeeds
  - `LOGIN_FAILURE`: Dispatched when login fails

```javascript
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
```
- **Lines 4-6**: Define action type constants for registration flow

```javascript
export const LOGOUT = 'LOGOUT';
```
- **Line 7**: Define action type for logout

```javascript
export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';
```
- **Lines 8-10**: Define action type constants for fetching current user data

```javascript
const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  registerSuccess: false,
};
```
- **Lines 13-20**: Define the initial state shape
  - `user`: Currently logged-in user object (null when not authenticated)
  - `token`: JWT or auth token (null when not authenticated)
  - `isLoading`: Boolean flag for ongoing API requests
  - `isAuthenticated`: True only when user is logged in with valid token
  - `error`: Error message from failed requests
  - `registerSuccess`: Flag indicating whether registration just completed

```javascript
export default function authReducer(state = initialState, action) {
```
- **Line 23**: Defines the reducer function with default initial state

```javascript
  console.log('Reducer action:', action.type);
```
- **Line 24**: Logs all dispatched actions for debugging purposes

```javascript
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case GET_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
```
- **Lines 25-33**: Handle all REQUEST actions
  - Sets loading to true and clears any previous errors
  - Indicates an async operation is in progress

```javascript
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
```
- **Lines 35-43**: Handle successful login
  - Sets loading to false (request completed)
  - Sets authenticated to true
  - Stores the returned token and user data
  - Clears any previous errors

```javascript
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null, 
        registerSuccess: true,
      };
```
- **Lines 45-51**: Handle successful registration
  - Does not set authenticated (user must login after registering)
  - Sets registerSuccess flag to true
  - Component listens to this flag to navigate to login

```javascript
    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };
```
- **Lines 53-60**: Handle successful user fetch
  - Updates user data from API
  - Sets authenticated to true

```javascript
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case GET_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
```
- **Lines 62-71**: Handle all FAILURE actions
  - Sets loading to false
  - Sets authenticated to false
  - Clears user and token
  - Stores the error message for display to user

```javascript
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      };
```
- **Lines 73-79**: Handle logout action
  - Clears all authentication data
  - User returns to login screen

```javascript
    default:
      return state;
```
- **Lines 81-82**: Default case returns state unchanged for unknown actions

---

### src/app/reducers/index.js

**Purpose**: Combines all individual reducers into a single root reducer for Redux.

```javascript
import { combineReducers } from 'redux';
import authReducer from './authReducer';
```
- **Lines 1-2**: Import combineReducers utility and auth reducer

```javascript
const rootReducer = combineReducers({
  auth: authReducer,
});
```
- **Lines 4-6**: Combines all reducers into a root reducer
  - `auth: authReducer`: Maps the authReducer to `state.auth`
  - As more features add reducers, they would be added here
  - Example: `{ auth: authReducer, posts: postsReducer, ... }`

```javascript
export default rootReducer;
```
- **Line 8**: Exports the root reducer for use in store configuration

---

### src/app/sagas/authSaga.js

**Purpose**: Handles all asynchronous authentication operations (login, register, logout, get user) using Redux-Saga.

```javascript
import { call, put, takeLatest } from 'redux-saga/effects';
```
- **Line 1**: Imports saga effect creators
  - `call`: Calls async functions and waits for result
  - `put`: Dispatches Redux actions
  - `takeLatest`: Listens for latest dispatch of an action type

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
} from '../reducers/authReducer';
```
- **Lines 3-14**: Imports all action type constants from auth reducer

```javascript
import { authLogin, authRegister, authMe, authLogout } from '../api/auth';
```
- **Line 15**: Imports all authentication API functions

```javascript
function* loginSaga(action) {
```
- **Line 18**: Defines a generator function (saga) for handling login
  - `function*` indicates a generator function
  - `action` contains the dispatched action with email and password

```javascript
  try {
    const { email, password } = action.payload;
```
- **Lines 19-20**: Destructures email and password from the action payload

```javascript
    const result = yield call(authLogin, { email, password });
```
- **Line 22**: Calls the authLogin API function
  - `yield call()`: Executes the async function and waits for it
  - If successful, returns data with token and user
  - If fails, throws an error that's caught in the catch block

```javascript
    yield put({ 
      type: LOGIN_SUCCESS, 
      payload: { 
        token: result.token,
        user: result.user || null
      } 
    });
```
- **Lines 24-30**: Dispatches LOGIN_SUCCESS action with token and user

```javascript
  } catch (error) {
    yield put({ 
      type: LOGIN_FAILURE, 
      payload: error.message 
    });
  }
```
- **Lines 32-37**: Catches any error and dispatches LOGIN_FAILURE with error message

```javascript
function* registerSaga(action) {
  try {
    const { email, password } = action.payload;
    yield call(authRegister, { email, password });

    yield put({ 
      type: REGISTER_SUCCESS 
    });

  } catch (error) {
    yield put({ 
      type: REGISTER_FAILURE, 
      payload: error.message 
    });
  }
}
```
- **Lines 40-53**: Handler for user registration
  - Similar structure to loginSaga
  - Does NOT store the result (registration doesn't return user/token)
  - SUCCESS doesn't provide user data; user must login after

```javascript
function* getUserSaga() {
  try {
    const userData = yield call(authMe);
    
    yield put({ 
      type: GET_USER_SUCCESS, 
      payload: { user: userData } 
    });
    
  } catch (error) {
    yield put({ 
      type: GET_USER_FAILURE, 
      payload: error.message 
    });
  }
}
```
- **Lines 56-67**: Handler for fetching current user data
  - Called on app startup to verify user is still authenticated
  - Takes no parameters (token retrieved internally by authMe)

```javascript
function* logoutSaga() {
  try {
    yield call(authLogout);
  } catch (error) {
    console.log('Logout error:', error);
  }
}
```
- **Lines 70-75**: Handler for logout
  - Calls logout API (cleanup on backend)
  - Errors are logged but not dispatched (logout always succeeds locally)

```javascript
export function* watchAuth() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
  yield takeLatest(REGISTER_REQUEST, registerSaga);
  yield takeLatest(GET_USER_REQUEST, getUserSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}
```
- **Lines 78-82**: Watcher saga that listens for all auth actions
  - `takeLatest`: If action dispatched multiple times, only latest is processed
  - Prevents duplicate API calls from double-taps
  - Each line connects an action type to its saga handler

---

### src/app/sagas/index.js

**Purpose**: Root saga that orchestrates all individual sagas.

```javascript
import { all, fork } from 'redux-saga/effects';
import { watchAuth } from './authSaga';
```
- **Lines 1-2**: Imports saga combinators and the auth watcher saga

```javascript
export default function* rootSaga() {
  yield all([
    fork(watchAuth),
  ]);
}
```
- **Lines 4-8**: Defines the root saga that starts all watchers
  - `yield all()`: Runs all sagas in parallel
  - `fork(watchAuth)`: Launches the auth watcher saga as a separate task
  - As app grows, more sagas would be forked here
  - Example: `fork(watchAuth), fork(watchPosts), fork(watchNotifications)`

---

### src/app/api/config.js

**Purpose**: Defines API endpoint configuration based on environment (development vs production).

```javascript
export const API_BASE_URL = __DEV__
  ? 'http://10.61.78.128:8000/api'
  : 'https://10.61.78.128:8000/api';
```
- **Lines 1-3**: Conditional API base URL
  - `__DEV__`: React Native global variable (true in development, false in production)
  - Development: Uses HTTP to local network IP (10.61.78.128)
  - Production: Uses HTTPS to same IP
  - All API calls prepend this URL

---

### src/app/api/auth.js

**Purpose**: Handles all authentication-related API calls to the backend server.

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';
```
- **Lines 1-2**: Imports AsyncStorage for token persistence and API base URL

```javascript
const BASE_URL = API_BASE_URL;

const defaultOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};
```
- **Lines 4-9**: Sets up default fetch options
  - All API requests use JSON content type
  - Headers specify that we accept and send JSON

```javascript
export async function storeToken(token) {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.log('Error storing token:', error);
  }
}
```
- **Lines 12-18**: Stores JWT token in AsyncStorage
  - Called after successful login/register
  - Token persists across app launches
  - Errors logged but not thrown (non-critical)

```javascript
export async function getToken() {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.log('Error getting token:', error);
    return null;
  }
}
```
- **Lines 20-27**: Retrieves stored JWT token
  - Returns the token string or null if not found
  - Called before API requests that require authentication

```javascript
export async function removeToken() {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.log('Error removing token:', error);
  }
}
```
- **Lines 29-35**: Deletes token from storage
  - Called on logout

```javascript
export async function authLogin({ email, password }) {
  try {
    console.log('Attempting login with:', { email });
    
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      ...defaultOptions,
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    console.log('Login response:', data);
    
    if (response.ok) {
      if (data.token) {
        await storeToken(data.token);
        return data;
      } else {
        throw new Error('No token received');
      }
    } else {
      throw new Error(data.message || data.detail || 'Login failed');
    }
  } catch (error) {
    console.log('Login error:', error);
    throw error;
  }
}
```
- **Lines 38-65**: Handles user login
  - Line 41-47: Makes POST request to /login endpoint with credentials
  - Line 49-50: Parses JSON response
  - Line 52-58: If response OK, stores token and returns data
  - Line 59-62: Otherwise throws error with message from backend
  - Line 64-66: Catches and logs error, then re-throws for saga to handle

```javascript
export async function authRegister({ email, password, }) {
  try {
    console.log('Attempting registration with:', { email, password });
    
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      ...defaultOptions,
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    console.log('Register response:', data);
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || data.error || 'Registration failed');
    }
  } catch (error) {
    console.log('Register error:', error);
    throw error;
  }
}
```
- **Lines 68-90**: Handles user registration
  - POST request to /register endpoint
  - Returns registration response (no token stored, user must login)
  - Similar error handling to login

```javascript
export async function authMe() {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('No token found');
    }
    
    console.log('Fetching user with token:', token.substring(0, 20) + '...');
    
    const response = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    console.log('User response:', data);
    
    if (response.ok) {
      return data.user || data;
    } else {
      if (response.status === 401) {
        await removeToken();
      }
      throw new Error(data.message || data.detail || 'Failed to get user');
    }
  } catch (error) {
    console.log('authMe error:', error);
    throw error;
  }
}
```
- **Lines 93-124**: Fetches current user data
  - Retrieves stored token first
  - Makes GET request to /me endpoint with token in Authorization header
  - Returns parsed data (handles different response structures)
  - If 401 (unauthorized), removes invalid token
  - Called on app startup to check if user is still authenticated

```javascript
export async function authLogout() {
  try {
    const token = await getToken();
    
    if (token) {
      try {
        await fetch(`${BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            ...defaultOptions.headers,
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (apiError) {
        console.log('Logout API error (non-critical):', apiError);
      }
    }
    
    await removeToken();
    return { success: true };
  } catch (error) {
    console.log('Logout error:', error);
    return { success: true };
  }
}
```
- **Lines 127-148**: Handles logout
  - Attempts to call /logout API to cleanup on backend
  - API errors are caught and logged (non-critical)
  - Always removes local token regardless of API success
  - Always returns success: true so logout always completes locally

---

## Components Directory

### src/components/CustomButton.js

**Purpose**: Reusable button component with customizable styles for the entire app.

```javascript
import { Text, TouchableOpacity, View } from 'react-native';
```
- **Line 1**: Imports React Native components
  - `Text`: Renders text
  - `TouchableOpacity`: Makes views respond to touches with opacity feedback
  - `View`: Container component

```javascript
const CustomButton = ({ containerStyle, textStyle, label, onPress }) => {
```
- **Line 3**: Defines button component with props
  - `containerStyle`: Style object for outer container
  - `textStyle`: Style object for text inside button
  - `label`: Button text display
  - `onPress`: Callback function when button is pressed

```javascript
  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}
        >
          <Text style={textStyle}>{label}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
```
- **Lines 4-16**: Render structure
  - Outer View: Applies container style (background, margins, etc)
  - TouchableOpacity: Detects press and reduces opacity
  - Inner View: Centers content with padding
  - Text: Displays button label with custom text style

```javascript
export default CustomButton;
```
- **Line 18**: Exports component for use throughout app

---

### src/components/CustomTextInput.js

**Purpose**: Reusable text input component with label, customizable styles, and support for secure/password fields.

```javascript
import { Text, View, TextInput } from 'react-native';
```
- **Line 1**: Imports React Native components

```javascript
const CustomTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  textStyle,
  containerStyle,
  secureTextEntry = false,
}) => {
```
- **Lines 3-11**: Component props with defaults
  - `label`: Text label above input
  - `placeholder`: Placeholder text when empty
  - `value`: Current input value (controlled component)
  - `onChangeText`: Callback when text changes
  - `textStyle`, `containerStyle`: Custom styles
  - `secureTextEntry`: Whether to mask text (default false)

```javascript
  return (
    <View style={containerStyle}>
      <Text style={{ fontWeight: 'bold' }}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={[
          textStyle,
          {
            width: '100%',
            borderBottomWidth: 1,
          },
        ]}
      />
    </View>
  );
};
```
- **Lines 12-28**: Render structure
  - Outer View: Container with custom spacing
  - Text: Bold label above input
  - TextInput: The actual input field
    - Controlled by value prop
    - secureTextEntry hides password text
    - Styles combine custom style with default bottom border (underline effect)

```javascript
export default CustomTextInput;
```
- **Line 30**: Exports component

---

### src/components/NestedCard.js

**Purpose**: Flexible card component with optional title and nested sections for organizing UI layouts.

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
```
- **Lines 1-2**: Imports React and React Native components

```javascript
const NestedCard = ({ title, children, style }) => {
```
- **Line 4**: Main card component with props
  - `title`: Optional card title
  - `children`: Content inside card
  - `style`: Additional custom styles

```javascript
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      <View style={styles.cardContent}>{children}</View>
    </View>
  );
};
```
- **Lines 5-10**: Card render structure
  - Combines default card style with custom style
  - Shows title only if provided
  - Children wrapped in content view

```javascript
NestedCard.Section = ({ label, children, style }) => {
  return (
    <View style={[styles.section, style]}>
      {label ? <Text style={styles.sectionTitle}>{label}</Text> : null}
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};
```
- **Lines 13-19**: Nested section component
  - Attached to NestedCard as static component
  - Used inside NestedCard for sub-sections
  - Has its own styling with lighter background

```javascript
const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
```
- **Lines 22-34**: Card styles
  - Full width white card with rounded corners
  - Padding of 16 units with bottom margin
  - Shadow effect (iOS: shadow properties, Android: elevation)

```javascript
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
```
- **Lines 35-40**: Card title styling
  - Large bold dark text

```javascript
  cardContent: {
    flexDirection: 'column',
    gap: 8,
  },
```
- **Lines 41-44**: Content wrapper styling
  - Column layout with 8 unit spacing between items

```javascript
  section: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
```
- **Lines 45-51**: Section styling
  - Light gray background
  - Smaller padding and rounded corners than card

```javascript
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
```
- **Lines 52-57**: Section title styling

```javascript
  sectionContent: {
    width: '100%',
  },
});

export default NestedCard;
```
- **Lines 58-61**: Section content wrapper and component export

---

## Navigations Directory

### src/navigations/RootNav.js

**Purpose**: Top-level navigation that switches between Auth and Main screens based on authentication state.

```javascript
import React from 'react';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNav from './AuthNav';
import MainNav from './MainNav';
```
- **Lines 1-5**: Imports React, Redux hook, navigation components, and sub-navigators

```javascript
const Stack = createStackNavigator();
```
- **Line 7**: Creates a Stack Navigator instance for root-level navigation

```javascript
const RootNav = () => {
  const { isAuthenticated, token, user } = useSelector(state => state.auth);
```
- **Lines 9-10**: Component definition and selects auth state from Redux
  - Gets authenticated status, token, and user from store

```javascript
  const loggedIn = !!token && !!user && isAuthenticated;
```
- **Line 11**: Determines if user is logged in
  - Must have token AND user AND isAuthenticated flag
  - Double negation (!!) converts to boolean

```javascript
  console.log('RootNav - auth:', { isAuthenticated, token, user });
```
- **Line 13**: Logs auth state for debugging

```javascript
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!loggedIn ? (
        <Stack.Screen name="Auth" component={AuthNav} />
      ) : (
        <Stack.Screen name="Main" component={MainNav} />
      )}
    </Stack.Navigator>
  );
};
```
- **Lines 15-22**: Navigation structure
  - hides native stack header (custom header in screens)
  - If not logged in: Shows AuthNav (Login/Register screens)
  - If logged in: Shows MainNav (Dashboard/Profile screens)
  - This is the main conditional that handles authentication flow

```javascript
export default RootNav;
```
- **Line 24**: Exports the root navigator

---

### src/navigations/AuthNav.js

**Purpose**: Handles navigation between Login and Register screens for unauthenticated users.

```javascript
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from '../utils';

import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
```
- **Lines 1-5**: Imports navigation and screen components, route constants

```javascript
const Stack = createStackNavigator();
```
- **Line 7**: Creates Stack Navigator for auth flow

```javascript
const AuthNavigation = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.LOGIN}>
```
- **Lines 9-11**: Component that sets up auth navigation
  - Starts at Login screen by default

```javascript
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={Login}
        options={{
          headerShown: false,
        }}
      />
```
- **Lines 12-18**: Login screen configuration
  - Uses route constant as name
  - Custom header hidden

```javascript
      <Stack.Screen name={ROUTES.REGISTER} component={Register} />
```
- **Line 19**: Register screen (uses default header)

```javascript
    </Stack.Navigator>
  );
};

export default AuthNavigation;
```
- **Lines 20-23**: Closes navigator and exports component

---

### src/navigations/MainNav.js

**Purpose**: Handles navigation between authenticated user screens (Dashboard, Profile).

```javascript
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from '../utils';

import Dashboard from '../screens/Dashboard';
import ProfileScreen from '../screens/ProfileScreen';
```
- **Lines 1-5**: Imports navigation components and screen files

```javascript
const Stack = createStackNavigator();
```
- **Line 7**: Creates Stack Navigator for main authenticated flow

```javascript
const MainNavigation = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.DASHBOARD}>
```
- **Lines 9-11**: Component setup, starts at Dashboard

```javascript
      <Stack.Screen 
        name={ROUTES.DASHBOARD} 
        component={Dashboard} 
        options={{ headerShown: true, title: 'Dashboard' }}
      />
```
- **Lines 12-15**: Dashboard screen with visible header

```javascript
      <Stack.Screen 
        name={ROUTES.PROFILE} 
        component={ProfileScreen} 
        options={{ headerShown: true, title: 'Profile' }}
      />
```
- **Lines 16-19**: Profile screen with visible header

```javascript
    </Stack.Navigator>
  );
};

export default MainNavigation;
```
- **Lines 20-23**: Close and export

---

### src/navigations/index.js

**Purpose**: Aggregates route constants for easy importing and centralized route management.

```javascript
export { default as IMG } from './images';
export { default as ROUTES } from './routes';
```
- **Lines 1-2**: Re-exports images and routes as named exports
  - Allows `import { ROUTES } from '../utils'` instead of longer path
  - Centralizes public API of utils module

---

## Screens Directory

### src/screens/auth/Login.js

**Purpose**: Handles user login with email and password, displays errors, and handles navigation.

```javascript
import { useState, useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View, ActivityIndicator, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { ROUTES } from '../../utils';
import { LOGIN_REQUEST } from '../../app/reducers/authReducer';
```
- **Lines 1-9**: Imports all needed React, React Native, and custom components

```javascript
const Login = () => {
  const [emailAdd, setEmailAdd] = useState('');
  const [password, setPassword] = useState('');
```
- **Lines 11-13**: Component and state for form inputs

```javascript
  const navigation = useNavigation();
  const dispatch = useDispatch();
```
- **Lines 15-16**: Gets navigation and Redux dispatch

```javascript
  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);
```
- **Line 19**: Selects auth state from Redux

```javascript
  console.log('[SCREEN] Login screen loaded');
```
- **Line 22**: Logs when screen mounts

```javascript
  useEffect(() => {
    if (error) {
      console.log(`[ERROR] Login failed: ${error}`);
      Alert.alert('Login Failed', error);
    }
  }, [error]);
```
- **Lines 24-29**: Effect that shows error alert when error state changes
  - Only runs when error dependency changes
  - Prevents repeated alerts for same error

```javascript
  useEffect(() => {
    if (isAuthenticated) {
      console.log('[SUCCESS] User authenticated successfully, redirecting');
      // RootNav will handle switching to MainNav with Dashboard
    }
  }, [isAuthenticated, navigation]);
```
- **Lines 31-37**: Effect that logs when user authenticates
  - RootNav automatically switches to MainNav when isAuthenticated changes
  - No manual navigation needed

```javascript
  const handleLogin = () => {
    console.log('[ACTION] Login button pressed');
    console.log(`[DATA] Email: ${emailAdd}, Password entered: ${password ? 'Yes' : 'No'}`);

    if (emailAdd === '' || password === '') {
      console.log('[VALIDATION] Empty fields detected');
      Alert.alert(
        'Invalid Credentials',
        'Please enter valid email address and password',
      );
      return;
    }

    console.log('[VALIDATION] All fields filled, dispatching LOGIN_REQUEST');
    
    dispatch({ 
      type: LOGIN_REQUEST, 
      payload: { email: emailAdd, password } 
    });
  };
```
- **Lines 39-57**: Login button handler
  - Validates inputs (both fields required)
  - Dispatches LOGIN_REQUEST to Redux
  - Redux flow: LOGIN_REQUEST → authSaga → API call → LOGIN_SUCCESS or LOGIN_FAILURE

```javascript
  const handleRegisterPress = () => {
    console.log('[ACTION] Register link pressed');
    navigation.navigate(ROUTES.REGISTER);
  };
```
- **Lines 59-62**: Navigates to Register screen

```javascript
  return (
    <ImageBackground
      source={{ uri: 'https://i.imgur.com/4NJl8sD.jpg' }}
      style={styles.background}
    >
      <View style={styles.overlay} />
```
- **Lines 64-69**: Renders full-screen image background with dark overlay

```javascript
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Enter your details to access your account</Text>

        <CustomTextInput
          label={'Email Address'}
          placeholder={'Enter Email Address'}
          value={emailAdd}
          onChangeText={setEmailAdd}
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />
```
- **Lines 70-81**: Form title and first input
  - Email input controlled by emailAdd state
  - onChangeText updates state on every keystroke

```javascript
        <CustomTextInput
          label={'Password'}
          placeholder={'Enter Password'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />
```
- **Lines 82-89**: Password input with secureTextEntry to hide text

```javascript
        <CustomButton
          label={isLoading ? "LOGGING IN..." : "Sign In"}
          containerStyle={[styles.button, isLoading && { backgroundColor: 'gray' }]}
          textStyle={styles.buttonText}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator color="white" />}
        </CustomButton>
```
- **Lines 90-97**: Login button
  - Shows "LOGGING IN..." text while loading
  - Turns gray while loading to indicate disabled state
  - Shows spinner during loading

```javascript
        <View style={styles.footerLinks}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleRegisterPress}>
            <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};
```
- **Lines 98-106**: Footer with register link

```javascript
const styles = {
  background: { ... },
  overlay: { ... },
  formWrapper: { ... },
  // ... more styles
};
```
- **Lines 109+**: StyleSheet objects defining all component styles

---

### src/screens/auth/Register.js

**Purpose**: Handles new user registration with email, password, and password confirmation.

```javascript
import { useState, useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View, ActivityIndicator, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { ROUTES } from '../../utils';
import { REGISTER_REQUEST } from '../../app/reducers/authReducer';
```
- **Lines 1-9**: Same imports as Login but for REGISTER_REQUEST action

```javascript
const Register = () => {
  const [emailAdd, setEmailAdd] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
```
- **Lines 11-14**: Component and three input states
  - confirmPassword to verify user typed password correctly

```javascript
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isLoading, error, registerSuccess } = useSelector(state => state.auth || {});
```
- **Lines 16-18**: Navigation, dispatch, and selects registerSuccess flag

```javascript
  console.log('[SCREEN] Register screen loaded');
```
- **Line 21**: Log screen mount

```javascript
  useEffect(() => {
    if (registerSuccess) {
      console.log('[SUCCESS] Registration successful, redirecting to login');
      Alert.alert('Success', 'Registration successful! Please login.');
      navigation.navigate(ROUTES.LOGIN);
    }
  }, [registerSuccess, navigation]);
```
- **Lines 23-29**: Effect triggered when registration succeeds
  - Shows success alert
  - Navigates to login so user can log in with new account

```javascript
  useEffect(() => {
    if (error) {
      console.log(`[ERROR] Registration failed: ${error}`);
      Alert.alert('Registration Failed', error);
    }
  }, [error]);
```
- **Lines 31-36**: Effect to show error alerts

```javascript
  const handleRegister = () => {
    console.log('[ACTION] Register button pressed');
    console.log(`[DATA] Email: ${emailAdd}, Password entered: ${password ? 'Yes' : 'No'}`);

    if (emailAdd === '' || password === '' || confirmPassword === '') {
      console.log('[VALIDATION] Empty fields detected');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      console.log('[VALIDATION] Passwords do not match');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    console.log('[VALIDATION] All fields valid, dispatching REGISTER_REQUEST');
    
    dispatch({ 
      type: REGISTER_REQUEST, 
      payload: { email: emailAdd, password } 
    });
  };
```
- **Lines 38-56**: Register button handler
  - Validates all fields filled
  - Validates passwords match
  - Dispatches REGISTER_REQUEST with email and password (confirmPassword not sent to API)

```javascript
  const handleLoginPress = () => {
    console.log('[ACTION] Login link pressed');
    navigation.navigate(ROUTES.LOGIN);
  };
```
- **Lines 58-61**: Navigate to login screen

```javascript
  return (
    <ImageBackground ...>
      <View style={styles.overlay} />
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.subtitle}>Join us to pamper your furry friends</Text>

        <CustomTextInput
          label={'Email Address'}
          placeholder={'Enter Email Address'}
          value={emailAdd}
          onChangeText={setEmailAdd}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />
```
- **Lines 63-79**: Similar layout to Login with email input
  - Added keyboardType="email-address" for email keyboard
  - autoCapitalize="none" prevents auto-capitalizing

```javascript
        <CustomTextInput
          label={'Password'}
          placeholder={'Enter Password'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />
        <CustomTextInput
          label={'Confirm Password'}
          placeholder={'Confirm Password'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />
```
- **Lines 80-98**: Two password inputs for validation

```javascript
        <CustomButton
          label={isLoading ? "REGISTERING..." : "Sign Up"}
          containerStyle={[styles.button, isLoading && { backgroundColor: 'gray' }]}
          textStyle={styles.buttonText}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator color="white" />}
        </CustomButton>

        <View style={styles.footerLinks}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleLoginPress}>
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};
```
- **Lines 99-115**: Sign Up button and login link

---

### src/screens/Dashboard.js

**Purpose**: Main authenticated screen showing user dashboard with stats and appointment information.

```javascript
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { API_BASE_URL } from '../app/api/config';
import { ROUTES } from '../utils';
import { LOGOUT } from '../app/reducers/authReducer';
import NestedCard from '../components/NestedCard';
```
- **Lines 1-8**: Imports including API config, routes, and NestedCard component

```javascript
const Dashboard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { token, user, isAuthenticated } = useSelector(state => state.auth);
```
- **Lines 11-14**: Component setup and selects auth data

```javascript
  const handleLogout = () => {
    console.log('[ACTION] Logout button pressed');
    dispatch({ type: LOGOUT });
    navigation.reset({ index: 0, routes: [{ name: ROUTES.LOGIN }] });
  };
```
- **Lines 16-20**: Logout handler
  - Dispatches LOGOUT action (clears auth state)
  - Resets navigation stack to Login screen

```javascript
  const [displayStats, setDisplayStats] = useState([
    { id: 'bookings', label: 'TOTAL BOOKINGS', value: 0, subtitle: 'Lifetime appointments' },
    { id: 'pets', label: 'MY PETS', value: 0, subtitle: 'Furry companions' },
    { id: 'next', label: 'NEXT APPOINTMENT', value: 'None', subtitle: 'No upcoming appointments' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
```
- **Lines 23-29**: State for dashboard stats with default values
  - displayStats: Array of stat objects to display
  - loading and error states for API calls

```javascript
  const handleBooking = () => {
    console.log('Book Appointment pressed');
    // TODO: navigate to create booking screen once it exists
  };
```
- **Lines 31-35**: Placeholder for booking feature (not implemented yet)

```javascript
  useEffect(() => {
    async function loadDashboard() {
      if (!isAuthenticated || !token) {
        setError('Please login to view dashboard data.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data.stats)) {
          setDisplayStats(data.stats);
        } else if (data.data?.stats) {
          setDisplayStats(data.data.stats);
        } else {
          setError('Received unexpected dashboard format, using cached stats.');
        }
      } catch (ex) {
        console.warn('Dashboard fetch error:', ex);
        setError(ex.message || 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [isAuthenticated, token]);
```
- **Lines 37-76**: Effect that loads dashboard data
  - Checks if authenticated before fetching
  - Makes GET request to /dashboard API with token
  - Handles different response formats (data.stats or data.data.stats)
  - Sets loading and error states appropriately
  - Runs when isAuthenticated or token changes

```javascript
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#6992CC" />
          <Text style={styles.subtitle}>Loading data...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.errorState}></View>
```
- **Lines 78+**: Render structure
  - ScrollView for long content
  - Top bar with title and logout button
  - Conditional rendering: shows loading spinner or error message

---

### src/screens/HomeScreen.js

**Purpose**: Simple home screen with user greeting and navigation to other screens.

```javascript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { LOGOUT } from '../app/reducers/authReducer';
import NestedCard from '../components/NestedCard';
```
- **Lines 1-6**: Imports

```javascript
const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);

  console.log('[SCREEN] Home screen loaded');
```
- **Lines 8-12**: Component setup, gets user from Redux state

```javascript
  const handleLogout = () => {
    console.log('[ACTION] Logout button pressed');
    console.log(`[USER] Logging out: ${user?.email || 'unknown'}`);
    dispatch({ type: LOGOUT });
  };
```
- **Lines 14-18**: Logout handler

```javascript
  const handleProfilePress = () => {
    console.log('[ACTION] Profile button pressed');
    navigation.navigate('Profile');
  };
```
- **Lines 20-23**: Navigate to Profile screen

```javascript
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.welcome}>Welcome, {user.fullName || user.email}!</Text>
          <Text style={styles.email}>Email: {user.email}</Text>
        </View>
      )}

      <NestedCard title="Quick Actions">
        <NestedCard.Section label="Navigation">
          <Text>Use this section to group related actions and create nested UI.
          </Text>
          <TouchableOpacity
            style={[styles.profileButton, { marginVertical: 4 }]}
            onPress={handleProfilePress}
          >
            <Text style={styles.buttonText}>Go to Profile</Text>
          </TouchableOpacity>
        </NestedCard.Section>

        <NestedCard.Section label="Account">
          <TouchableOpacity
            style={[styles.logoutButton, { marginVertical: 4 }]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </NestedCard.Section>
      </NestedCard>

    </View>
  );
};
```
- **Lines 25+**: Render structure
  - Shows user greeting with name or email
  - Uses NestedCard with sections for organization
  - Profile and Logout buttons

---

### src/screens/ProfileScreen.js

**Purpose**: Simple placeholder profile screen with back navigation.

```javascript
import { Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 40 }}>ProfileScreen</Text>
      <Button
        title="Go back to Home"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default ProfileScreen;
```
- **Lines 1-16**: Minimal profile screen placeholder
  - Shows "ProfileScreen" text
  - Back button to return to previous screen
  - Ready for future expansion with actual profile content

---

## Utils Directory

### src/utils/routes.js

**Purpose**: Central repository of all route/screen names used throughout the app.

```javascript
const ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  DASHBOARD: 'Dashboard',
  PROFILE: 'Profile',
};

export default ROUTES;
```
- **Lines 1-6**: Object mapping route names
  - All navigation screens reference these constants
  - Easy to refactor: change here once, applies everywhere
  - Prevents typos in navigation.navigate() calls

---

### src/utils/images.js

**Purpose**: Centralized image URLs for the application.

```javascript
export default {
  LOGO: 'https://png.pngtree.com/templates/md/20180510/md_5af41d8680cc9.png',
  LOGO2: 'https://i.ytimg.com/vi/gmkp0W-sEao/maxresdefault.jpg',
};
```
- **Lines 1-3**: Object with image URLs
  - Instead of embedding URLs in components, reference from here
  - Easy to swap image URLs or host them elsewhere later
  - Extensible for adding more images

---

### src/utils/index.js

**Purpose**: Re-exports all utilities with a clean public API.

```javascript
export { default as IMG } from './images';
export { default as ROUTES } from './routes';
```
- **Lines 1-2**: Re-exports images and routes
  - Allows shorter imports: `import { ROUTES } from '../utils'`
  - Instead of: `import ROUTES from '../utils/routes.js'`
  - Centralizes the public API of the utils folder
  - Easy to add more exports: `export { default as CONSTANTS } from './constants'`

---

## Architecture Summary

### Data Flow
1. **Redux Store** (store.js): Single source of truth for app state
2. **Reducers** (reducers/): Pure functions that update state
3. **Sagas** (sagas/): Handle async side effects and API calls
4. **Components**: Display state and dispatch actions on user interaction
5. **Screens**: Full-page components for different routes

### Authentication Flow
1. User enters credentials on Login screen
2. Dispatches LOGIN_REQUEST action
3. Saga watches for LOGIN_REQUEST
4. Saga calls authLogin API function
5. API response triggers LOGIN_SUCCESS or LOGIN_FAILURE
6. Reducer updates auth state
7. Components re-render with new auth state
8. RootNav detects isAuthenticated change and switches screens

### Navigation Flow
- **RootNav**: Top-level conditional (Auth vs Main)
- **AuthNav**: Login/Register screens
- **MainNav**: Dashboard/Profile screens
- Navigation happens via stack navigator

### State Management Pattern
- Simple Redux setup (one reducer for auth)
- Redux Saga for async operations
- Redux Persist for persistence (currently disabled)
- Easy to extend with more reducers/sagas for new features

