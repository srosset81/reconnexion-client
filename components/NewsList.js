import React from 'react';
import { Text, View } from 'react-native';

import ObjectPreview from './ObjectPreview';
import { PageTitle } from '../elements/text';
import { Button } from '../elements/button';
import { Loader } from '../elements/ui';
import useQuery from '../hooks/useQuery';

const NewsList = ({ parentId }) => {
  const { data, loading, error, retry } = useQuery(`${parentId}/created`);
  if (error)
    return (
      <View>
        <Text>{error.message}</Text>
        <Button onPress={retry}>Réessayer</Button>
      </View>
    );
  return (
    <View style={{ paddingBottom: 10 }}>
      {loading ? (
        <Loader />
      ) : (
        data && (
          <>
            <View style={{ paddingTop: 10, paddingLeft: 15, paddingBottom: 3 }}>
              <PageTitle>Actualités</PageTitle>
            </View>
            {data && data.map(objectId => <ObjectPreview key={objectId} objectId={objectId} />)}
          </>
        )
      )}
    </View>
  );
};

export default NewsList;
