import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './reducers';
import rootSaga from './sagas';

// Redux Persist config
// EXAM REQUIREMENT: NO AsyncStorage for auth - all data managed in Reducer only
// Blacklist ensures auth reducer is NEVER persisted to local storage
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [], // Empty = NO reducers persisted (all data in memory only)
  blacklist: ['auth'], // Explicitly ensure auth is never persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer as any);

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create store
export const store = createStore(
  persistedReducer,
  applyMiddleware(sagaMiddleware)
);

// Run saga
sagaMiddleware.run(rootSaga);

// Create persistor
export const persistor = persistStore(store);

// Define RootState type
export type RootState = ReturnType<typeof rootReducer>;