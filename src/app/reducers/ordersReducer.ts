// Action Types
export const FETCH_ORDERS_REQUEST = 'FETCH_ORDERS_REQUEST';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAILURE = 'FETCH_ORDERS_FAILURE';
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';
export const CLEAR_CREATE_ORDER_STATUS = 'CLEAR_CREATE_ORDER_STATUS';
export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS';

// Types
interface Order {
  id: string;
  items: any[]; // You can define a more specific type for items
  total: number;
  status: string;
  createdAt: string;
  // Add other order properties
}

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  createOrderSuccess: boolean;
  createOrderLoading: boolean;
  createOrderError: string | null;
}

interface FetchOrdersRequestAction {
  type: typeof FETCH_ORDERS_REQUEST;
}

interface FetchOrdersSuccessAction {
  type: typeof FETCH_ORDERS_SUCCESS;
  payload: Order[];
}

interface FetchOrdersFailureAction {
  type: typeof FETCH_ORDERS_FAILURE;
  payload: string;
}

interface CreateOrderRequestAction {
  type: typeof CREATE_ORDER_REQUEST;
  payload: { items: any[]; total: number; shippingAddress?: string; paymentMethod?: string };
}

interface CreateOrderSuccessAction {
  type: typeof CREATE_ORDER_SUCCESS;
  payload: Order;
}

interface CreateOrderFailureAction {
  type: typeof CREATE_ORDER_FAILURE;
  payload: string;
}

interface ClearCreateOrderStatusAction {
  type: typeof CLEAR_CREATE_ORDER_STATUS;
}

interface UpdateOrderStatusAction {
  type: typeof UPDATE_ORDER_STATUS;
  payload: { orderId: string; status: string };
}

type OrdersAction =
  | FetchOrdersRequestAction
  | FetchOrdersSuccessAction
  | FetchOrdersFailureAction
  | CreateOrderRequestAction
  | CreateOrderSuccessAction
  | CreateOrderFailureAction
  | ClearCreateOrderStatusAction
  | UpdateOrderStatusAction;

// Initial State
const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null,
  createOrderSuccess: false,
  createOrderLoading: false,
  createOrderError: null,
};

// Reducer
export default function ordersReducer(state: OrdersState = initialState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case FETCH_ORDERS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        createOrderLoading: true,
        createOrderError: null,
        createOrderSuccess: false,
      };
    
    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        orders: action.payload,
        error: null,
      };
    
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        createOrderLoading: false,
        orders: [action.payload, ...state.orders],
        createOrderSuccess: true,
        createOrderError: null,
      };
    
    case FETCH_ORDERS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        createOrderSuccess: false,
      };

    case CREATE_ORDER_FAILURE:
      return {
        ...state,
        createOrderLoading: false,
        createOrderError: action.payload,
        createOrderSuccess: false,
      };

    case CLEAR_CREATE_ORDER_STATUS:
      return {
        ...state,
        createOrderSuccess: false,
        createOrderError: null,
      };

    case UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };
    
    default:
      return state;
  }
}
