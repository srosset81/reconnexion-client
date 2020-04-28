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

  const callFetch = useCallback(async () => {
    dispatch(resourceFetchTrigger(uri));

    const response = await customFetch(uri, {
      headers: {
        Accept: 'application/ld+json'
      }
    });

    if( response.ok ) {
      const json = await response.json();
      dispatch(resourceFetchSuccess(uri, json));
      return json;
    } else {
      dispatch(resourceFetchFailure(uri, response.statusText));
    }
  }, [uri, cachedResource, dispatch]);

  useEffect(() => {
    if (!cachedResource && options.cacheOnly !== true) callFetch();
  }, [options, callFetch]);

  return { ...initialValues, ...cachedResource, retry: callFetch };
};

export default useResource;
