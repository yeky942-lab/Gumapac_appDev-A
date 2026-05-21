import { takeLatest, call, put, select } from 'redux-saga/effects';
import { Alert } from 'react-native';
import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
} from '../reducers/ordersReducer';
import { CLEAR_CART } from '../reducers/cartReducer';
import { fetchOrders, createOrder } from '../api/orders';
import { RootState } from '../store';

// Action interfaces
interface CreateOrderAction {
  type: typeof CREATE_ORDER_REQUEST;
  payload: { items: any[]; total: number; shippingAddress?: string; paymentMethod?: string };
}

function* fetchOrdersSaga(): Generator<any, void, any> {
  try {
    // Get token from Redux state
    const { token } = yield select((state: RootState) => state.auth);
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    const orders = yield call(fetchOrders, token);
    yield put({ type: FETCH_ORDERS_SUCCESS, payload: orders });
  } catch (error) {
    console.log('❌ [SAGA] Fetch orders error:', (error as Error).message);
    yield put({ type: FETCH_ORDERS_FAILURE, payload: (error as Error).message });
  }
}

function* createOrderSaga(action: CreateOrderAction): Generator<any, void, any> {
  try {
    // Get token from Redux state
    const { token } = yield select((state: RootState) => state.auth);
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    const order = yield call(createOrder, token, action.payload);
    yield put({ type: CREATE_ORDER_SUCCESS, payload: order });
    yield put({ type: CLEAR_CART });
  } catch (error) {
    console.log('❌ [SAGA] Create order error:', (error as Error).message);
    yield put({ type: CREATE_ORDER_FAILURE, payload: (error as Error).message });
    Alert.alert('Error', (error as Error).message || 'Failed to create order');
  }
}

export function* watchOrders(): Generator<any, void, any> {
  yield takeLatest(FETCH_ORDERS_REQUEST, fetchOrdersSaga);
  yield takeLatest(CREATE_ORDER_REQUEST, createOrderSaga);
}
