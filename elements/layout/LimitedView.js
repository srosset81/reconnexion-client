import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

const StyledView = styled(View)`
  ${props => (props.height ? `max-height: ${props.height};` : '')} overflow: hidden;
`;

class LimitedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.measureHeight ? null : this.props.maxHeight
    };
  }

  // Only called if measureHeight is true
  onLayout = event => {
    const { height } = event.nativeEvent.layout;
    if (height > this.props.maxHeight) {
      this.setState({ height: this.props.maxHeight });
    }
  };

  render() {
    const { children, measureHeight, isOverflowing, gradientHeight } = this.props;
    return (
      <StyledView onLayout={measureHeight ? null : this.onLayout} height={isOverflowing ? this.state.height : null}>
        {children}
        {isOverflowing && this.state.height && (
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: gradientHeight
            }}
          />
        )}
      </StyledView>
    );
  }
}

LimitedView.defaultProps = {
  measureHeight: true, // If true, we will call onLayout to measure the height of the child (can be slow)
  isOverflowing: true, // Toggle gradient on or off
  maxHeight: 120,
  gradientHeight: 120
};

export default LimitedView;
