import { configureStore } from '@reduxjs/toolkit';
import { useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { rootReducer } from './rootReducer.js';
import { middleware } from './middleware.js';

export const reduxStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware)
  },
});
export const useDispatch = () => useReduxDispatch();
export const useSelector = useReduxSelector;
