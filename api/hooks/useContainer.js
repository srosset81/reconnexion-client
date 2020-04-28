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

  const callFetch = useCallback(() => {
    if (!cachedContainer) {
      dispatch(containerFetchTrigger(uri));
      return customFetch(uri, {
        headers: {
          Accept: 'application/ld+json'
        }
      })
        .then(response => response.json())
        .then(data => {
          dispatch(containerFetchSuccess(uri, data));
          return data;
        })
        .catch(error => {
          console.error(error);
          dispatch(containerFetchFailure(uri, error.message));
        });
    }
  }, [uri, cachedContainer, dispatch]);

  useEffect(() => {
    if (options.cacheOnly !== true) callFetch();
  }, [uri, options, callFetch]);

  return { ...initialValues, ...cachedContainer, retry: callFetch };
};

export default useContainer;
