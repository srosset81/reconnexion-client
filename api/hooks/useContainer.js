import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { containerFetchTrigger, containerFetchSuccess, containerFetchFailure } from '../redux/actions';
import { selectResource } from '../redux/selectors';
import useFetch from "./useFetch";

const initialValues = { data: null, loading: true, error: null };

const useContainer = (uri, options = { cacheOnly: false }) => {
  const dispatch = useDispatch();
  const customFetch = useFetch();
  const cachedContainer = useSelector(selectResource(uri));

  const callFetch = useCallback(async () => {
    dispatch(containerFetchTrigger(uri));

    const response = await customFetch(uri, {
      headers: {
        Accept: 'application/ld+json'
      }
    });

    if( response.ok ) {
      const json = await response.json();
      dispatch(containerFetchSuccess(uri, json));
      return json;
    } else {
      dispatch(containerFetchFailure(uri, response.statusText))
    }
  }, [uri, cachedContainer, dispatch]);

  useEffect(() => {
    if (!cachedContainer && options.cacheOnly !== true) callFetch();
  }, [uri, options, callFetch]);

  return { ...initialValues, ...cachedContainer, retry: callFetch };
};

export default useContainer;
