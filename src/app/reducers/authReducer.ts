// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const LOGOUT = 'LOGOUT';
export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';
export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';
export const CLEAR_PROFILE_UPDATE_STATUS = 'CLEAR_PROFILE_UPDATE_STATUS';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  fullName?: string;
  phone?: string;
  address?: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  registerSuccess: boolean;
  isUpdatingProfile: boolean;
  profileUpdateError: string | null;
  profileUpdateSuccess: boolean;
}

interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: { token: string; user: User };
}

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

interface RegisterRequestAction {
  type: typeof REGISTER_REQUEST;
}

interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
}

interface RegisterFailureAction {
  type: typeof REGISTER_FAILURE;
  payload: string;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

interface GetUserRequestAction {
  type: typeof GET_USER_REQUEST;
}

interface GetUserSuccessAction {
  type: typeof GET_USER_SUCCESS;
  payload: { user: User };
}

interface GetUserFailureAction {
  type: typeof GET_USER_FAILURE;
  payload: string;
}

interface UpdateProfileRequestAction {
  type: typeof UPDATE_PROFILE_REQUEST;
  payload: { fullName?: string; email?: string; phone?: string; address?: string };
}

interface UpdateProfileSuccessAction {
  type: typeof UPDATE_PROFILE_SUCCESS;
  payload: { user: User };
}

interface UpdateProfileFailureAction {
  type: typeof UPDATE_PROFILE_FAILURE;
  payload: string;
}

interface ClearProfileUpdateStatusAction {
  type: typeof CLEAR_PROFILE_UPDATE_STATUS;
}

type AuthAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | RegisterRequestAction
  | RegisterSuccessAction
  | RegisterFailureAction
  | LogoutAction
  | GetUserRequestAction
  | GetUserSuccessAction
  | GetUserFailureAction
  | UpdateProfileRequestAction
  | UpdateProfileSuccessAction
  | UpdateProfileFailureAction
  | ClearProfileUpdateStatusAction;

// Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  registerSuccess: false,
  isUpdatingProfile: false,
  profileUpdateError: null,
  profileUpdateSuccess: false,
};

// Reducer
export default function authReducer(state: AuthState = initialState, action: AuthAction): AuthState {
  console.log('Reducer action:', action.type);
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case GET_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null, 
        registerSuccess: true,
      }
      
    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };

    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        isUpdatingProfile: true,
        profileUpdateError: null,
        profileUpdateSuccess: false,
      };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        isUpdatingProfile: false,
        user: action.payload.user,
        profileUpdateSuccess: true,
        profileUpdateError: null,
      };

    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        isUpdatingProfile: false,
        profileUpdateError: action.payload,
        profileUpdateSuccess: false,
      };

    case CLEAR_PROFILE_UPDATE_STATUS:
      return {
        ...state,
        profileUpdateError: null,
        profileUpdateSuccess: false,
      };
    
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
    
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      };
    
    default:
      return state;
  }
}