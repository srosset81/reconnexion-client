import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '../elements/button';
import useLoggedUser from '../hooks/useLoggedUser';
import {
  useOutbox,
  Collection,
  followActivity,
  undoActivity,
  addToCollection,
  removeFromCollection
} from '../activitypub';
import { useFetch } from '../api';
import { registerForPushNotifications } from '../functions';
import { Alert } from 'react-native';

const FollowButton = ({ actorUri }) => {
  const dispatch = useDispatch();
  const { user } = useLoggedUser();
  const outbox = useOutbox();
  const fetch = useFetch();

  const follow = useCallback(async () => {
    await outbox.post(followActivity(actorUri), () => {
      dispatch(addToCollection(user.url + '/following', actorUri));
      dispatch(addToCollection(actorUri + '/followers', user.url));
      const pushToken = registerForPushNotifications();
      if( pushToken ) {
        fetch('/devices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/ld+json',
          },
          body: JSON.stringify({
            ownedBy: user.url,
            pushToken
          })
        });
      }
      Alert.alert('Message', 'Vous suivez maintenant cette action.');
    });
  }, [outbox, actorUri, user]);

  const unfollow = useCallback(async () => {
    const outboxCollection = await outbox.get();

    if (outboxCollection.totalItems > 0) {
      // Try to find a Follow activity for this actor
      // If we don't, we will not send an Undo activity
      const followActivity = outboxCollection.orderedItems.find(
        activity => activity.type === 'Follow' && activity.object === actorUri
      );

      if (followActivity) {
        await outbox.post(undoActivity(followActivity), () => {
          dispatch(removeFromCollection(user.url + '/following', actorUri));
          dispatch(removeFromCollection(actorUri + '/followers', user.url));
          Alert.alert('Message', 'Vous ne suivez plus cette action.');
        });
      }
    }
  }, [outbox, actorUri, user]);

  return user ? (
    <Collection uri={user.url + '/following'} options={{ cacheOnly: true }}>
      {({ data }) => {
        return data && data.includes(actorUri) ? (
          <Button onPress={unfollow}>Ne plus suivre</Button>
        ) : (
          <Button onPress={follow}>Suivre</Button>
        )
      }
      }
    </Collection>
  ) : (
    <Button onPress={follow}>Suivre</Button>
  );
};

export default FollowButton;
