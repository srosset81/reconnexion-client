import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';
import { useResource } from '../api';
import { wrapInArray } from '../functions';

export const StyledTag = styled(Text)`
  color: white;
  background-color: lightgrey;
  border-radius: 3px;
  align-self: flex-start;
  padding: 3px 7px;
  margin-right: 5px;
`;

const Tag = ({ tagUri }) => {
  const { data, loading, error } = useResource(tagUri);
  if (loading || error) return null;
  return <StyledTag>{data['pair:preferedLabel']}</StyledTag>;
};

const Tags = ({ tags, navigation }) =>
  tags && (
    <View style={{ flexDirection: 'row', marginTop: 7 }}>
      {wrapInArray(tags).map((tag, i) => (
        // <TouchableWithoutFeedback key={i} onPress={() => navigation.push('List', { tag: tag.name })}>
        <Tag key={i} tagUri={tag} />
        // </TouchableWithoutFeedback>
      ))}
    </View>
  );

export default withNavigation(Tags);
