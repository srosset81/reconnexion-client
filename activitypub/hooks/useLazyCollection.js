import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { collectionFetchTrigger, collectionFetchSuccess, collectionFetchFailure } from '../redux/actions';
import { useFetch, selectResource } from '../../api';

const initialValues = { data: null, loading: true, error: null };

const useLazyCollection = uri => {
  const dispatch = useDispatch();
  const customFetch = useFetch();
  const cachedCollection = useSelector(selectResource(uri));

  const callFetch = useCallback(() => {
    dispatch(collectionFetchTrigger(uri));
    return customFetch(uri, {
      headers: {
        Accept: 'application/ld+json'
      }
    })
      .then(response => response.json())
      .then(data => {
        dispatch(collectionFetchSuccess(uri, data));
        return data;
      })
      .catch(error => {
        console.error(error);
        dispatch(collectionFetchFailure(uri, error.message));
      });
  }, [uri, cachedCollection, dispatch]);

  return { ...initialValues, ...cachedCollection, fetch: callFetch, retry: callFetch };
};

export default useLazyCollection;
