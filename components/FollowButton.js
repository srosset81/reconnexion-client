import React from 'react';
import { useDispatch } from "react-redux";
import { followActor, unfollowActor } from '../functions';
import { Button } from '../elements/button';
import useQuery from '../hooks/useQuery';
import useForceUpdate from "../hooks/useForceUpdate";

const FollowButton = ({ actor, user, color }) => {
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  const actorId = actor.type === 'Note' ? actor.attributedTo : actor.id;
  const { data } = useQuery(user.url + '/following', { cacheOnly: true });

  if (data && data.includes(actorId)) {
    return (
      <Button
        onPress={async () => {
          await unfollowActor(actorId);
          await dispatch({ type: 'REMOVE_FROM_DATA_LIST', endpoint: user.url + '/following', value: actorId });
          // Not clean but for some reasons the data are not automatically updated
          forceUpdate();
        }}
        color={color}
      >
        Ne plus suivre
      </Button>
    );
  } else {
    return (
      <Button
        onPress={async () => {
          await followActor(actorId);
          await dispatch({ type: 'ADD_TO_DATA_LIST', endpoint: user.url + '/following', value: actorId });
            // Not clean but for some reasons the data are not automatically updated
          forceUpdate();
        }}
        color={color}
      >
        Suivre
      </Button>
    );
  }
};

export default FollowButton;
