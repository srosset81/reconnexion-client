import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addResource } from '../../api';
import { addToCollection } from '../redux/actions';
import useLoggedUser from '../../hooks/useLoggedUser';
import useLazyCollection from './useLazyCollection';
import useFetch from "../../api/hooks/useFetch";

const useOutbox = () => {
  const dispatch = useDispatch();
  const customFetch = useFetch();
  const { user } = useLoggedUser();
  const { fetch } = useLazyCollection(user.url + '/outbox');

  const post = useCallback(
    async (activity, onSuccess) => {
      activity = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        actor: user.url,
        ...activity
      };

      const response = await customFetch(user.url + '/outbox', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activity)
      });

      if (response.ok) {
        // Get activity ID from location
        activity.id = response.headers.get('Location');

        // Add activity to Redux outbox store
        dispatch(addResource(activity));
        dispatch(addToCollection(user.url + '/outbox', activity.id));

        if (onSuccess) await onSuccess();

        return true;
      } else {
        return false;
      }
    },
    [customFetch, dispatch, user]
  );

  return { post, get: fetch };
};

export default useOutbox;
