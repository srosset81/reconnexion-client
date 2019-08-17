import styled from 'styled-components/native';
import { Text } from 'react-native';

export const PageTitle = styled(Text)`
  font-family: geomanist;
  font-size: 28;
  font-weight: bold;
  padding-right: 20px;
  ${props => props.center && `text-align: center;`}
`;

export const Title = styled(Text)`
  font-family: geomanist;
  font-size: 20;
  font-weight: bold;
`;

export Link from './Link';
