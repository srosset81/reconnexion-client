import React, { useState } from 'react';
import { followActor, unfollowActor } from '../functions';
import { Button } from '../elements/button';
import useQuery from '../hooks/useQuery';

const FollowButton = ({ actor, user }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const actorId = actor.type === 'Note' ? actor.attributedTo : actor.id;
  const { data } = useQuery(user.url + '/following');
  if (!isFollowing && data && data.includes(actorId)) setIsFollowing(true);

  if (isFollowing) {
    return (
      <Button
        onPress={async () => {
          setIsFollowing(false);
          await unfollowActor(actorId);
        }}
      >
        Ne plus suivre
      </Button>
    );
  } else {
    return (
      <Button
        onPress={async () => {
          setIsFollowing(true);
          await followActor(actorId);
        }}
      >
        Suivre
      </Button>
    );
  }
};

export default FollowButton;
