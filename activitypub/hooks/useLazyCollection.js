import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { collectionFetchTrigger, collectionFetchSuccess, collectionFetchFailure } from '../redux/actions';
import { useFetch, selectResource } from '../../api';

const initialValues = { data: null, loading: true, error: null };

const useLazyCollection = uri => {
  const dispatch = useDispatch();
  const customFetch = useFetch();
  const cachedCollection = useSelector(selectResource(uri));

  const callFetch = useCallback(async () => {
    dispatch(collectionFetchTrigger(uri));
    const response = await customFetch(uri, {
      headers: {
        Accept: 'application/ld+json'
      }
    });
    if( response.ok ) {
      const json = await response.json();
      dispatch(collectionFetchSuccess(uri, json));
      return json;
    } else {
      dispatch(collectionFetchFailure(uri, response.statusText));
    }
  }, [uri, dispatch]);

  return { ...initialValues, ...cachedCollection, fetch: callFetch, retry: callFetch };
};

export default useLazyCollection;
