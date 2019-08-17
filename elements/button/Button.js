import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(TouchableHighlight)`
  padding: 6px 8px;
  background-color: #bdc900;
  border-radius: 4px;
  border: 1px solid #fff;
  margin-top: 5px;
`;

const ButtonText = styled(Text)`
  color: #fff;
  font-family: geomanist;
  font-size: 18px;
  text-align: center;
`;

const Button = ({ onPress, children }) => (
  <Container onPress={onPress}>
    <ButtonText>{children}</ButtonText>
  </Container>
);

export default Button;
