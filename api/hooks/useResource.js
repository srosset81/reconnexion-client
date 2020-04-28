import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resourceFetchTrigger, resourceFetchSuccess, resourceFetchFailure } from '../redux/actions';
import { selectResource } from '../redux/selectors';
import useFetch from "./useFetch";

const initialValues = { data: null, loading: true, error: null };

const useResource = (uri, options = { cacheOnly: false }) => {
  const dispatch = useDispatch();
  const customFetch = useFetch();
  const cachedResource = useSelector(selectResource(uri));

  const callFetch = useCallback(() => {
    if (!cachedResource) {
      dispatch(resourceFetchTrigger(uri));
      return customFetch(uri, {
        headers: {
          Accept: 'application/ld+json'
        }
      })
        .then(response => response.json())
        .then(data => {
          dispatch(resourceFetchSuccess(uri, data));
          return data;
        })
        .catch(error => {
          console.error(error);
          dispatch(resourceFetchFailure(uri, error.message));
        });
    }
  }, [uri, cachedResource, dispatch]);

  useEffect(() => {
    if (options.cacheOnly !== true) callFetch();
  }, [uri, options, callFetch]);

  return { ...initialValues, ...cachedResource, retry: callFetch };
};

export default useResource;
