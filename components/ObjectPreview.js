import React from 'react';
import { View, ImageBackground, TouchableWithoutFeedback, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import { useSelector } from 'react-redux';
import HTML from 'react-native-render-html';
import moment from 'moment';

import { Title } from '../elements/text';
import { Status, Tags, Location } from '../elements/ui';
import { Block, LimitedView } from '../elements/layout';

import { capitalizeFirstChar } from '../functions';

const ObjectPreview = ({ objectId, navigation }) => {
  const data = useSelector(state => state.queries[objectId].data);
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Details', { objectId: data.id })}>
      <Block>
        {data.image && (
          <ImageBackground source={{ uri: data.image }} style={{ width: '100%', height: 120 }} resizeMode="cover" />
        )}
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
            <LimitedView>
              <HTML
                html={data.content}
                tagsStyles={{
                  h2: { fontWeight: 'bold', fontSize: 14, marginTop: 10, marginBottom: 5 }
                }}
              />
            </LimitedView>
          )}
          {data.tag && <Tags tags={data.tag} />}
        </View>
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default withNavigation(ObjectPreview);
