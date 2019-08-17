import React from 'react';
import { followActor } from '../functions';
import { Button } from '../elements/button';
import useQuery from '../hooks/useQuery';

const FollowButton = ({ actor, user }) => {
  const actorId = actor.type === 'Note' ? actor.attributedTo : actor.id;
  const { data, loading } = useQuery(actorId + '/followers');

  const numFollowers = data ? data.length : 0;

  if (!data || !user || !data.includes(user.url)) {
    return (
      <Button onPress={() => followActor(actorId)}>{numFollowers > 0 ? `Suivre (${numFollowers})` : 'Suivre'}</Button>
    );
  } else {
    return <Button>{numFollowers > 0 ? `Abonné (${numFollowers})` : 'Abonné'}</Button>;
  }
};

export default FollowButton;
