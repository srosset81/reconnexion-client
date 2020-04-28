import React from 'react';
import { createAppContainer, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as ReduxProvider } from 'react-redux';
import * as Font from 'expo-font';
import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';
import moment from 'moment';
import 'moment/locale/fr';

import { LdpProvider } from './api';
import initStore from './config/initStore';
import { APP_NAME } from './constants';

import ListScreen from './screens/ListScreen';
import DetailsScreen from './screens/DetailsScreen';
import { customFetch, getWebId, getJsonContext } from './functions';
import ontologies from './ontologies.json';

moment.locale('fr');

const store = initStore();

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

    this.initSentry();

    const notificationSubscription = Notifications.addListener(this.onReceiveNotification);
  }

  initSentry = () => {
    Sentry.init({
      dsn: 'https://4664b87408184ea980b8d10d13b86b50@sentry.io/1826149',
      enableInExpoDevelopment: true,
      debug: true
    });

    Sentry.setRelease(Constants.manifest.revisionId);

    Sentry.configureScope(function(scope) {
      scope.setTag('appName', APP_NAME);
    });
  };

  onReceiveNotification = notification => {
    let route = {};
    console.log('Notification received', notification);

    // Don't do anything if origin is 'received', because it makes iOS crash
    // https://stackoverflow.com/questions/52014006/expo-push-notifications-when-app-is-in-foreground-it-crashes-ios
    // https://github.com/expo/expo/pull/4802
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
      <ReduxProvider store={store}>
        <LdpProvider customFetch={customFetch} getWebId={getWebId} jsonContext={getJsonContext(ontologies, 'as')}>
          <AppContainer ref={nav => (this.navigator = nav)} />
        </LdpProvider>
      </ReduxProvider>
    );
  }
}

export default App;
