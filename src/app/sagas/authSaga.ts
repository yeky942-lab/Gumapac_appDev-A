import { call, put, takeLatest, select } from 'redux-saga/effects';
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
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  LOGOUT,
} from '../reducers/authReducer';
import { authLogin, authRegister, authMe, authLogout, updateProfile } from '../api/auth';
import { RootState } from '../store';

// Action interfaces
interface LoginAction {
  type: typeof LOGIN_REQUEST;
  payload: { email: string; password: string };
}

interface RegisterAction {
  type: typeof REGISTER_REQUEST;
  payload: { email: string; password: string; fullName?: string; phone?: string; address?: string };
}

interface GetUserAction {
  type: typeof GET_USER_REQUEST;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

// Login Saga
function* loginSaga(action: LoginAction): Generator<any, void, any> {
  try {
    const { email, password } = action.payload;
    console.log('🔐 [SAGA] Login request for:', email);
    
    // authLogin throws on error, returns data directly on success
    const result = yield call(authLogin, { email, password });
    
    console.log('✅ [SAGA] Login successful');
    
    yield put({ 
      type: LOGIN_SUCCESS, 
      payload: { 
        token: result.token,
        user: result.user || null
      } 
    });

    // Fetch user profile after successful login
    yield put({ type: GET_USER_REQUEST });

  } catch (error) {
    console.log('❌ [SAGA] Login error:', (error as Error).message);
    yield put({ 
      type: LOGIN_FAILURE, 
      payload: (error as Error).message 
    });
  }
}

// Register Saga
function* registerSaga(action: RegisterAction): Generator<any, void, any> {
  try {
    const { email, password, fullName, phone, address } = action.payload;
    // authRegister throws on error, returns data directly on success
    yield call(authRegister, { 
      email, 
      password, 
      fullName: fullName || '',
      phone: phone || '',
      address: address || ''
    });

    yield put({ 
      type: REGISTER_SUCCESS 
    });

  } catch (error) {
    console.log('❌ [SAGA] Register error:', (error as Error).message);
    yield put({ 
      type: REGISTER_FAILURE, 
      payload: (error as Error).message 
    });
  }
}

// Get User Saga - token from Redux state, NOT AsyncStorage
function* getUserSaga(action: GetUserAction): Generator<any, void, any> {
  try {
    console.log('👤 [SAGA] Fetching user profile');
    
    // Get token from Redux state (not from local storage)
    const { token } = yield select((state: RootState) => state.auth);
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    // authMe throws on error, returns user data directly on success
    const userData = yield call(authMe, token);
    
    console.log('✅ [SAGA] User profile fetched successfully');
    
    yield put({ 
      type: GET_USER_SUCCESS, 
      payload: { user: userData } 
    });
    
  } catch (error) {
    console.log('❌ [SAGA] Get user error:', (error as Error).message);
    yield put({ 
      type: GET_USER_FAILURE, 
      payload: (error as Error).message 
    });
  }
}

interface UpdateProfileAction {
  type: typeof UPDATE_PROFILE_REQUEST;
  payload: { fullName?: string; email?: string; phone?: string; address?: string };
}

function* updateProfileSaga(action: UpdateProfileAction): Generator<any, void, any> {
  try {
    console.log('👤 [SAGA] Profile update request');
    const { token } = yield select((state: RootState) => state.auth);
    if (!token) {
      throw new Error('No authentication token available');
    }

    const profileData = action.payload;
    const result = yield call(updateProfile, token, profileData);

    console.log('✅ [SAGA] Profile updated successfully');
    yield put({ type: UPDATE_PROFILE_SUCCESS, payload: { user: result.user || result } });
  } catch (error) {
    console.log('❌ [SAGA] Update profile error:', (error as Error).message);
    yield put({ type: UPDATE_PROFILE_FAILURE, payload: (error as Error).message });
  }
}

// Logout Saga - token from Redux state, NOT AsyncStorage
function* logoutSaga(action: LogoutAction): Generator<any, void, any> {
  try {
    console.log('🚪 [SAGA] Logout request');
    
    // Get token from Redux state (not from local storage)
    const { token } = yield select((state: RootState) => state.auth);
    
    yield call(authLogout, token);
    
    console.log('✅ [SAGA] Logout completed');
  } catch (error) {
    console.log('⚠️  [SAGA] Logout error (non-critical):', (error as Error).message);
  }
}

// Watcher Saga
export function* watchAuth(): Generator<any, void, any> {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
  yield takeLatest(REGISTER_REQUEST, registerSaga);
  yield takeLatest(GET_USER_REQUEST, getUserSaga);
  yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfileSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}