import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApi } from '../functions';

const useQuery = endpoint => {
  const dispatch = useDispatch();
  const cachedQuery = useSelector(state => state.queries[endpoint]);

  const callFetch = () => {
    if (!cachedQuery) {
      dispatch({ type: 'QUERY_TRIGGER', endpoint });
      fetchApi(endpoint)
        .then(data => {
          dispatch({ type: 'QUERY_SUCCESS', endpoint, data });
        })
        .catch(error => {
          dispatch({ type: 'QUERY_FAILURE', endpoint, error });
        });
    }
  };

  useEffect(callFetch);

  return { ...cachedQuery, retry: callFetch } || { data: null, loading: true, error: null, retry: callFetch };
};

export default useQuery;
