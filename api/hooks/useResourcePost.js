import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addResource } from '../redux/actions';
import useFetch from "./useFetch";

const useResourcePost = uri => {
  const dispatch = useDispatch();
  const customFetch = useFetch();

  const callFetch = useCallback(
    async resource => {
      const response = await customFetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json'
        },
        body: JSON.stringify(resource)
      });

      if( response.ok ) {
        const resourceId = response.headers.get('Location');
        dispatch(addResource(resourceId, { id: resourceId, ...resource }));
        return resourceId;
      }
    },
    [uri, customFetch]
  );

  return callFetch;
};

export default useResourcePost;
