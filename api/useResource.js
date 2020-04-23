import { useEffect, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resourceFetchTrigger, resourceFetchSuccess, resourceFetchFailure } from './actions';
import fetchResource from './fetchResource';
import LdpContext from './LdpContext';

const initialValues = { data: null, loading: true, error: null };

const useResource = (uri, options = { cacheOnly: false }) => {
  const dispatch = useDispatch();
  const ldp = useContext(LdpContext);

  const cachedResource = useSelector(state => state.ldp.resources[uri]);

  const callFetch = useCallback(() => {
    if (!cachedResource) {
      dispatch(resourceFetchTrigger(uri));
      ldp
        .getHeaders()
        .then(additionalHeaders => fetchResource({ uri: ldp.reformatUri(uri), additionalHeaders }))
        .then(data => dispatch(resourceFetchSuccess(uri, data)))
        .catch(error => {
          console.error(error);
          dispatch(resourceFetchFailure(uri, error.message));
        });
    }
  }, [uri, cachedResource, dispatch, ldp]);

  useEffect(() => {
    if (options.cacheOnly !== true) callFetch();
  }, [uri, options, callFetch]);

  return { ...initialValues, ...cachedResource, retry: callFetch };
};

export default useResource;
