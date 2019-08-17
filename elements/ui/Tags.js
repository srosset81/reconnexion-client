import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';

export const Tag = styled(Text)`
  color: white;
  background-color: lightgrey;
  border-radius: 3px;
  align-self: flex-start;
  padding: 3px 7px;
  margin-right: 5px;
`;

const Tags = ({ tags, navigation }) =>
  tags && (
    <View style={{ flexDirection: 'row', marginTop: 7 }}>
      {tags.map((tag, i) => (
        <TouchableWithoutFeedback key={i} onPress={() => navigation.push('List', { tag: tag.name })}>
          <Tag>{tag.name}</Tag>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );

export default withNavigation(Tags);
