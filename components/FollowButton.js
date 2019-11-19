import React from 'react';
import { useDispatch } from 'react-redux';
import { followActor, unfollowActor } from '../functions';
import { Button } from '../elements/button';
import useForceUpdate from '../hooks/useForceUpdate';
import useLoggedUser from '../hooks/useLoggedUser';
import Query from './Query';

const FollowButton = ({ actorUri }) => {
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  const { user } = useLoggedUser();

  const follow = async () => {
    await followActor(actorUri);
    if (user) {
      await dispatch({ type: 'ADD_TO_DATA_LIST', endpoint: user.url + '/following', value: actorUri });
    }
    // Not clean but for some reasons the data are not automatically updated
    forceUpdate();
  };

  const unfollow = async () => {
    await unfollowActor(actorUri);
    if (user) {
      await dispatch({ type: 'REMOVE_FROM_DATA_LIST', endpoint: user.url + '/following', value: actorUri });
    }
    // Not clean but for some reasons the data are not automatically updated
    forceUpdate();
  };

  return user ? (
    <Query endpoint={user.url + '/following'} options={{ cacheOnly: true }}>
      {({ data }) =>
        data && data.includes(actorUri) ? (
          <Button onPress={unfollow}>Ne plus suivre</Button>
        ) : (
          <Button onPress={follow}>Suivre</Button>
        )
      }
    </Query>
  ) : (
    <Button onPress={follow}>Suivre</Button>
  );
};

export default FollowButton;
