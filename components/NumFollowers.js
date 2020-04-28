import React from 'react';
import { Text } from 'react-native';
import { useCollection } from '../activitypub';

const NumFollowers = ({ actorUri }) => {
  const { data } = useCollection(actorUri + '/followers');
  if (data && data.length > 0) {
    return (
      <Text style={{ fontWeight: 'bold', textAlign: 'center', margin: 7 }}>
        {data.length === 1
          ? `${data.length} personne suit cette action`
          : `${data.length} personnes suivent cette action`}
      </Text>
    );
  } else {
    return null;
  }
};

export default NumFollowers;
