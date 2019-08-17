import React from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';
import { capitalizeFirstChar } from '../../functions';

const StyledText = styled(Text)`
  font-style: italic;
  color: grey;
  align-self: flex-start;
  padding: 2px 2px 2px 7px;
`;

const Location = ({ children }) => <StyledText>{capitalizeFirstChar(children.name)}</StyledText>;

export default Location;
