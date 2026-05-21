// Action Types
export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const FETCH_PRODUCT_DETAILS_REQUEST = 'FETCH_PRODUCT_DETAILS_REQUEST';
export const FETCH_PRODUCT_DETAILS_SUCCESS = 'FETCH_PRODUCT_DETAILS_SUCCESS';
export const FETCH_PRODUCT_DETAILS_FAILURE = 'FETCH_PRODUCT_DETAILS_FAILURE';
export const CLEAR_PRODUCT_DETAILS = 'CLEAR_PRODUCT_DETAILS';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  // Add other product properties
}

interface ProductsState {
  products: Product[];
  productDetails: Product | null;
  isLoading: boolean;
  isLoadingDetails: boolean;
  error: string | null;
  detailsError: string | null;
}

interface FetchProductsRequestAction {
  type: typeof FETCH_PRODUCTS_REQUEST;
}

interface FetchProductsSuccessAction {
  type: typeof FETCH_PRODUCTS_SUCCESS;
  payload: Product[];
}

interface FetchProductsFailureAction {
  type: typeof FETCH_PRODUCTS_FAILURE;
  payload: string;
}

interface FetchProductDetailsRequestAction {
  type: typeof FETCH_PRODUCT_DETAILS_REQUEST;
}

interface FetchProductDetailsSuccessAction {
  type: typeof FETCH_PRODUCT_DETAILS_SUCCESS;
  payload: Product;
}

interface FetchProductDetailsFailureAction {
  type: typeof FETCH_PRODUCT_DETAILS_FAILURE;
  payload: string;
}

interface ClearProductDetailsAction {
  type: typeof CLEAR_PRODUCT_DETAILS;
}

type ProductsAction =
  | FetchProductsRequestAction
  | FetchProductsSuccessAction
  | FetchProductsFailureAction
  | FetchProductDetailsRequestAction
  | FetchProductDetailsSuccessAction
  | FetchProductDetailsFailureAction
  | ClearProductDetailsAction;

// Initial State
const initialState: ProductsState = {
  products: [],
  productDetails: null,
  isLoading: false,
  isLoadingDetails: false,
  error: null,
  detailsError: null,
};

// Reducer
export default function productsReducer(state: ProductsState = initialState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        products: action.payload,
        error: null,
      };
    
    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case FETCH_PRODUCT_DETAILS_REQUEST:
      return {
        ...state,
        isLoadingDetails: true,
        detailsError: null,
      };
    
    case FETCH_PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoadingDetails: false,
        productDetails: action.payload,
        detailsError: null,
      };
    
    case FETCH_PRODUCT_DETAILS_FAILURE:
      return {
        ...state,
        isLoadingDetails: false,
        detailsError: action.payload,
      };

    case CLEAR_PRODUCT_DETAILS:
      return {
        ...state,
        productDetails: null,
        detailsError: null,
      };
    
    default:
      return state;
  }
}
