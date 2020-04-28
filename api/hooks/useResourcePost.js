import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addResource } from '../redux/actions';
import useFetch from "./useFetch";

const useResourcePost = uri => {
  const dispatch = useDispatch();
  const customFetch = useFetch();

  const callFetch = useCallback(
    resource =>
      customFetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json'
        },
        body: JSON.stringify(resource)
      })
        .then(response => {
          const resourceId = response.headers.get('Location');
          dispatch(addResource(resourceId, { id: resourceId, ...resource }));
        }),
    [uri, customFetch]
  );

  return callFetch;
};

export default useResourcePost;
