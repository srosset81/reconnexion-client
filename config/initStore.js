import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ldpReducer } from '../api';

const initStore = () => {
  const store = configureStore({
    reducer: {
      ldp: ldpReducer
    },
    middleware: [...getDefaultMiddleware()]
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../api/reducer', () => store.replaceReducer(reducer));
  }

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('../api/reducer', () => {
      const newLdpReducer = require('../api/reducer').default;
      store.replaceReducer(newLdpReducer);
    });
  }

  return store;
};

export default initStore;
