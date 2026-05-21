import { takeLatest, call, put, select } from 'redux-saga/effects';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_DETAILS_REQUEST,
  FETCH_PRODUCT_DETAILS_SUCCESS,
  FETCH_PRODUCT_DETAILS_FAILURE,
} from '../reducers/productsReducer';
import { fetchProducts, fetchProductDetails } from '../api/products';
import { RootState } from '../store';

// Action interfaces
interface FetchProductDetailsAction {
  type: typeof FETCH_PRODUCT_DETAILS_REQUEST;
  payload: string; // productId
}

function* fetchProductsSaga(): Generator<any, void, any> {
  try {
    // Get token from Redux state
    const { token } = yield select((state: RootState) => state.auth);
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    console.log('🔄 [SAGA] Fetching all products');
    const products = yield call(fetchProducts, token);
    console.log('✅ [SAGA] Products fetched successfully');
    yield put({ type: FETCH_PRODUCTS_SUCCESS, payload: products });
  } catch (error) {
    console.log('❌ [SAGA] Fetch products error:', (error as Error).message);
    yield put({ type: FETCH_PRODUCTS_FAILURE, payload: (error as Error).message });
  }
}

function* fetchProductDetailsSaga(action: FetchProductDetailsAction): Generator<any, void, any> {
  try {
    // Get token from Redux state
    const { token } = yield select((state: RootState) => state.auth);
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    const productId = action.payload;
    console.log(`🔄 [SAGA] Fetching product details for ID: ${productId}`);
    const productDetails = yield call(fetchProductDetails, token, productId);
    console.log('✅ [SAGA] Product details fetched successfully');
    yield put({ type: FETCH_PRODUCT_DETAILS_SUCCESS, payload: productDetails });
  } catch (error) {
    console.log('❌ [SAGA] Fetch product details error:', (error as Error).message);
    yield put({ type: FETCH_PRODUCT_DETAILS_FAILURE, payload: (error as Error).message });
  }
}

export function* watchProducts(): Generator<any, void, any> {
  yield takeLatest(FETCH_PRODUCTS_REQUEST, fetchProductsSaga);
  yield takeLatest(FETCH_PRODUCT_DETAILS_REQUEST, fetchProductDetailsSaga);
}
