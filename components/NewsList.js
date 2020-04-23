import React from 'react';
import { Text, View } from 'react-native';

import ObjectPreview from './ObjectPreview';
import { PageTitle } from '../elements/text';
import { Button } from '../elements/button';
import { Loader } from '../elements/ui';
import { useSparqlQuery } from '../api';
import { getNewsByAction } from '../queries';

const NewsList = ({ actionUri }) => {
  const { data, loading, error, retry } = useSparqlQuery(getNewsByAction({ actionUri }));
  if (error)
    return (
      <View style={{ padding: 15 }}>
        <Text>{error === 'Network request failed' ? 'Problème de connexion Internet' : error}</Text>
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
