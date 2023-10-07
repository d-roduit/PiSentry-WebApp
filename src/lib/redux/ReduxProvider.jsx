'use client'

import { Provider } from 'react-redux';
import { reduxStore } from './index.js';

export const ReduxProvider = ({ children }) => {
  return <Provider store={reduxStore}>{children}</Provider>
}
