import React from 'react';
import { Text, View } from 'react-native';

import Page from '../components/Page';
import ObjectPreview from '../components/ObjectPreview';
import { PageTitle } from '../elements/text';
import { Loader } from '../elements/ui';
import useQuery from '../hooks/useQuery';
import { SERVER_URL, MAIN_ACTOR, APP_NAME } from '../constants';
import UserConnection from '../components/UserConnection';
import useLoggedUser from '../hooks/useLoggedUser';

const ListScreen = ({ navigation }) => {
  const { data, loading, error } = useQuery(SERVER_URL + MAIN_ACTOR);
  const { user } = useLoggedUser();
  const selectedTag = navigation.getParam('tag');
  return (
    <Page>
      <View style={{ paddingTop: 10, paddingLeft: 15, paddingBottom: 3 }}>
        <PageTitle center>{selectedTag ? `"${selectedTag}"` : APP_NAME}</PageTitle>
        <Text style={{ fontStyle: 'italic', fontSize: 12, textAlign: 'center', color: 'grey' }}>
          <UserConnection />
        </Text>
      </View>
      {loading && <Loader />}
      {error && <Text>{error.message}</Text>}
      {user && data && data.map(objectId => <ObjectPreview key={objectId} objectId={objectId} user={user} />)}
    </Page>
  );
};

export default ListScreen;
