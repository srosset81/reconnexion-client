import React from 'react';
import { ScrollView, View, ImageBackground } from 'react-native';
import styled from 'styled-components/native';
import Constants from 'expo-constants';

const StatusBar = styled(View)`
  background-color: #bdc900;
  height: ${Constants.statusBarHeight};
`;

const StyledScrollView = styled(ScrollView)`
  flex: 1;
`;

export default class Page extends React.Component {
  render() {
    return (
      <View>
        <ImageBackground
          source={require('../assets/fond_1920.jpg')}
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
        >
          <StatusBar />
          <StyledScrollView>{this.props.children}</StyledScrollView>
        </ImageBackground>
      </View>
    );
  }
}
