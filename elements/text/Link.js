import React from 'react';
import { Text, TouchableWithoutFeedback } from 'react-native';

const Link = ({ onPress, style, children }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <Text style={{ textDecorationLine: 'underline', ...style }}>{children}</Text>
  </TouchableWithoutFeedback>
);

export default Link;
