import React from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';

import { statusColorMap } from '../../constants';

const StyledText = styled(Text)`
  color: ${props => props.color};
  border: ${props => props.color} 1px solid;
  border-radius: 3px;
  align-self: flex-start;
  padding: 2px 4px;
`;

const Status = ({ children }) => <StyledText color={statusColorMap[children]}>{children}</StyledText>;

export default Status;
