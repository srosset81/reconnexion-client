import React, { memo } from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
// import { Image } from 'react-native-expo-image-cache';
import { withNavigation } from 'react-navigation';
import HTML from 'react-native-render-html';
import moment from 'moment';

import { Title } from '../elements/text';
import { Status, Tags, Location } from '../elements/ui';
import { Block, LimitedView } from '../elements/layout';

import { capitalizeFirstChar } from '../functions';
import FollowButton from './FollowButton';
import { useResource } from '../api';

const ObjectPreview = ({ objectId, navigation }) => {
  const { data } = useResource(objectId, { cacheOnly: true });
  const viewDetails = () => navigation.navigate('Details', { objectId: data.id });
  return (
    <Block>
      {/*{data.image && (*/}
      {/*  <TouchableWithoutFeedback onPress={viewDetails}>*/}
      {/*    <Image*/}
      {/*      uri={data.image}*/}
      {/*      style={{ width: '100%', height: 120, resizeMode: 'cover', backgroundColor: 'lightgrey' }}*/}
      {/*    />*/}
      {/*  </TouchableWithoutFeedback>*/}
      {/*)}*/}
      <TouchableWithoutFeedback onPress={viewDetails}>
        <View style={{ padding: 15 }}>
          <Title>{capitalizeFirstChar(data.name)}</Title>
          {data.type === 'Project' && (
            <View style={{ flexDirection: 'row', marginTop: 7, marginBottom: 7 }}>
              <Status>En cours</Status>
              <Location>{data.location}</Location>
            </View>
          )}
          {data.type === 'Note' && (
            <View style={{ flexDirection: 'row', marginTop: 3, marginBottom: 3 }}>
              <Text style={{ fontStyle: 'italic' }}>{moment(data.published).fromNow()}</Text>
            </View>
          )}
          {data.content && (
            <LimitedView measureHeight={false} isOverflowing={data.content.length > 200}>
              <HTML
                html={data.content}
                tagsStyles={{
                  h2: { fontWeight: 'bold', fontSize: 14, marginTop: 10, marginBottom: 5 }
                }}
              />
            </LimitedView>
          )}
        </View>
      </TouchableWithoutFeedback>
      {data.type !== 'Note' && (
        <View style={{ padding: 15, paddingTop: 0 }}>
          <FollowButton actorUri={data.id} />
        </View>
      )}
    </Block>
  );
};

export default memo(withNavigation(ObjectPreview));
