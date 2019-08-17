import React from 'react';
import { Text, View } from 'react-native';

import Page from '../components/Page';
import ObjectPreview from '../components/ObjectPreview';
import { PageTitle, Link } from '../elements/text';
import { Loader } from '../elements/ui';
import useQuery from '../hooks/useQuery';
import useLoggedUser from '../hooks/useLoggedUser';
import { SERVER_URL } from '../constants';

const ListScreen = ({ navigation }) => {
  const { data, loading, error } = useQuery(SERVER_URL + '/actor/60payscreillois/created');
  const { user, connect, disconnect } = useLoggedUser();
  const selectedTag = navigation.getParam('tag');
  return (
    <Page>
      <View style={{ paddingTop: 10, paddingLeft: 15, paddingBottom: 3 }}>
        <PageTitle center>Actions {selectedTag ? `"${selectedTag}"` : 'du Pays Creillois'}</PageTitle>
        <Text style={{ fontStyle: 'italic', fontSize: 12, textAlign: 'center', color: 'grey' }}>
          {user ? (
            <>
              Connecté en tant que {user.userName}&nbsp;
              <Link onPress={disconnect}>Se déconnecter</Link>
            </>
          ) : (
            <>
              Vous n'êtes pas connecté&nbsp;
              <Link onPress={connect}>Se connecter</Link>
            </>
          )}
        </Text>
      </View>
      {loading && <Loader />}
      {error && <Text>{error.message}</Text>}
      {data && data.map(objectId => <ObjectPreview key={objectId} objectId={objectId} />)}
    </Page>
  );
};

export default ListScreen;
