import React from 'react';
import { useDispatch } from 'react-redux';
import { followActor, unfollowActor } from '../functions';
import { Button } from '../elements/button';
import useForceUpdate from '../hooks/useForceUpdate';
import useLoggedUser from '../hooks/useLoggedUser';
import { Resource, addToCollection, removeFromCollection } from '../api';

const FollowButton = ({ actorUri }) => {
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  const { user } = useLoggedUser();

  const follow = async () => {
    await followActor(actorUri);
    if (user) {
      await dispatch(addToCollection(user.url + '/following', actorUri));
    }
    // Not clean but for some reasons the data are not automatically updated
    forceUpdate();
  };

  const unfollow = async () => {
    await unfollowActor(actorUri);
    if (user) {
      await dispatch(removeFromCollection(user.url + '/following', actorUri));
    }
    // Not clean but for some reasons the data are not automatically updated
    forceUpdate();
  };

  return user ? (
    <Resource uri={user.url + '/following'} options={{ cacheOnly: true }}>
      {({ data }) =>
        data && data.includes(actorUri) ? (
          <Button onPress={unfollow}>Ne plus suivre</Button>
        ) : (
          <Button onPress={follow}>Suivre</Button>
        )
      }
    </Resource>
  ) : (
    <Button onPress={follow}>Suivre</Button>
  );
};

export default FollowButton;
