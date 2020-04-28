import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ldpReducer } from '../api';
import { activitypubReducer } from '../activitypub';

const initStore = () => {
  const store = configureStore({
    reducer: {
      ldp: activitypubReducer(ldpReducer)
    },
    middleware: [...getDefaultMiddleware()]
  });

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept(['../api', '../activitypub'], () => {
      const newLdpReducer = require('../api/redux/reducer').default;
      const newActivitypubReducer = require('../activitypub/redux/reducer').default;
      store.replaceReducer(newActivitypubReducer(newLdpReducer));
    });
  }

  return store;
};

export default initStore;
