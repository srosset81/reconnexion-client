import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import styled from 'styled-components';

const FullScreenView = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Loader = ({ fullScreen, children }) => {
  const loader = (
    <>
      {children && <Text style={{ marginBottom: 10 }}>{children}</Text>}
      <ActivityIndicator size="large" color="#bdc900" />
    </>
  );

  if (fullScreen) {
    return <FullScreenView>{loader}</FullScreenView>;
  } else {
    return loader;
  }
};

export default Loader;
