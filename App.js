import React from 'react';
import { createStackNavigator, createAppContainer, NavigationActions } from 'react-navigation';
import { Provider } from 'react-redux';
import * as Font from 'expo-font';
import { Notifications } from 'expo';
import moment from 'moment';
import 'moment/locale/fr';

import store from './config/store';

import ListScreen from './screens/ListScreen';
import DetailsScreen from './screens/DetailsScreen';

moment.locale('fr');

const AppNavigator = createStackNavigator(
  {
    List: {
      screen: ListScreen
    },
    Details: {
      screen: DetailsScreen
    }
  },
  {
    initialRouteName: 'List',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false
    };
    this.navigator = null;
  }

  async componentDidMount() {
    await Font.loadAsync({
      geomanist: require('./assets/fonts/geomanist-regular.ttf')
    });

    this.setState({ fontsLoaded: true });

    const notificationSubscription = Notifications.addListener(this.onReceiveNotification);
  }

  onReceiveNotification = notification => {
    let route = {};
    console.log('Notification received', notification);

    if (notification.origin === 'selected' && this.navigator) {
      switch (notification.data.type) {
        case 'activity.create':
          route = { routeName: 'Details', params: { objectId: notification.data.url } };
          break;

        default:
          route = { routeName: 'List' };
          break;
      }

      this.navigator.dispatch(NavigationActions.navigate(route));
    }
  };

  render() {
    if (!this.state.fontsLoaded) return null;

    return (
      <Provider store={store}>
        <AppContainer ref={nav => (this.navigator = nav)} />
      </Provider>
    );
  }
}

export default App;
