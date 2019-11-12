import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Image } from "react-native-expo-image-cache";
import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';
import HTML from 'react-native-render-html';
import moment from 'moment';

import { PageTitle } from '../elements/text';
import { Status, Tags, Location, Loader } from '../elements/ui';
import { Button } from '../elements/button';
import Page from '../components/Page';
import NewsList from '../components/NewsList';
import FollowButton from '../components/FollowButton';

import { capitalizeFirstChar, openBrowser } from '../functions';
import useQuery from '../hooks/useQuery';
import useLoggedUser from '../hooks/useLoggedUser';
import NumFollowers from '../components/NumFollowers';

const CloseButton = styled(TouchableOpacity)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 7px;
`;

const DetailsScreen = ({ navigation }) => {
  const { data, loading, error } = useQuery(navigation.getParam('objectId'));
  const { user } = useLoggedUser();

  return (
    <Page>
      {loading && <Loader />}
      {error && <Text>{error.message}</Text>}
      {data && (
        <>
          <View style={{ padding: 15, backgroundColor: 'white' }}>
            <PageTitle>{capitalizeFirstChar(data.name)}</PageTitle>
            <CloseButton onPress={() => navigation.goBack()}>
              <AntDesign name="close" size={32} color="grey" />
            </CloseButton>
          </View>
          {data.image && (
            <View style={{ paddingBottom: 15, backgroundColor: 'white' }}>
              <Image
                uri={data.image}
                style={{ width: '100%', height: 150, resizeMode: 'cover', backgroundColor: 'lightgrey' }}
              />
            </View>
          )}
          <View style={{ padding: 15, paddingTop: 0, backgroundColor: 'white' }}>
            {data.type === 'Project' && (
              <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                <Status>En cours</Status>
                <Location>{data.location}</Location>
              </View>
            )}
            {data.type === 'Note' && (
              <View style={{ flexDirection: 'row', marginTop: -5, marginBottom: 3 }}>
                <Text style={{ fontStyle: 'italic' }}>{moment(data.published).fromNow()}</Text>
              </View>
            )}
            {data.content && (
              <HTML
                html={data.content}
                tagsStyles={{
                  h2: {
                    fontWeight: 'bold',
                    fontSize: 14,
                    marginTop: 10,
                    marginBottom: 5
                  }
                }}
              />
            )}
            {data.tag && <Tags tags={data.tag} />}
            {data.type !== 'Note' ? (
              <View style={{ marginTop: 7, marginBottom: 7 }}>
                <Text style={{ fontStyle: 'italic' }}>Création de la fiche : {moment(data.published).fromNow()}</Text>
                <Text style={{ fontStyle: 'italic' }}>Dernière mise à jour : {moment(data.updated).fromNow()}</Text>
              </View>
            ) : (
              <View style={{ height: 7 }} />
            )}
            <NumFollowers actor={data} />
            {user && <FollowButton actor={data} user={user} />}
            {data.url && <Button onPress={() => openBrowser(data.url)}>Plus d'informations</Button>}
          </View>
          {data.type === 'Project' && <NewsList parentId={data.id} />}
        </>
      )}
    </Page>
  );
};

export default DetailsScreen;
