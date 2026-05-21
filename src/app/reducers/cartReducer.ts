// Action Types
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
export const CLEAR_CART = 'CLEAR_CART';
export const SET_PAYMENT_METHOD = 'SET_PAYMENT_METHOD';

// Types
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  // Add other properties as needed
}

interface CartState {
  items: CartItem[];
  paymentMethod: string;
}

interface AddToCartAction {
  type: typeof ADD_TO_CART;
  payload: CartItem;
}

interface RemoveFromCartAction {
  type: typeof REMOVE_FROM_CART;
  payload: { id: string };
}

interface UpdateCartItemAction {
  type: typeof UPDATE_CART_ITEM;
  payload: CartItem;
}

interface SetPaymentMethodAction {
  type: typeof SET_PAYMENT_METHOD;
  payload: string;
}

interface ClearCartAction {
  type: typeof CLEAR_CART;
}

type CartAction =
  | AddToCartAction
  | RemoveFromCartAction
  | UpdateCartItemAction
  | SetPaymentMethodAction
  | ClearCartAction;

// Initial State
const initialState: CartState = {
  items: [],
  paymentMethod: 'Cash on delivery',
};

// Reducer
export default function cartReducer(state: CartState = initialState, action: CartAction): CartState {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      };
    }
    
    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    
    case UPDATE_CART_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case SET_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };
    
    case CLEAR_CART:
      return {
        ...state,
        items: [],
      };
    
    default:
      return state;
  }
}
