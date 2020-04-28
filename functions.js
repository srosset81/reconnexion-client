import { Notifications } from 'expo';
import * as WebBrowser from 'expo-web-browser';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import jwtDecode from 'jwt-decode';
import { AsyncStorage, Linking, Platform } from 'react-native';
import { SERVER_URL, LOCAL_IP } from './constants';

export const capitalizeFirstChar = str => str.charAt(0).toUpperCase() + str.substring(1);

export const getJsonContext = (ontologies, mainOntology) => {
  let pattern = {};
  ontologies.forEach(ontology => (pattern[ontology.prefix] = ontology.url));
  if (mainOntology) {
    delete pattern[mainOntology];
    return [ontologies.find(ontology => ontology.prefix === mainOntology).context, pattern];
  } else {
    return pattern;
  }
};

export const getQueryParam = (name, url) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const reformatUri = uri => {
  if (!uri.startsWith('http')) {
    uri = SERVER_URL + uri;
  }
  return uri.replace('localhost', LOCAL_IP);
};

export const wrapInArray = value => (Array.isArray(value) ? value : [value]);

export const getLoggedUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return user && JSON.parse(user);
};

export const getWebId = async () => {
  const user = await getLoggedUser();
  return user.url;
};

export const customFetch = async (uri, options = {}) => {
  const user = await getLoggedUser();
  return await fetch(reformatUri(uri), {
    ...options,
    headers: {
      ...options.headers,
      Authorization: user ? 'Bearer ' + user.token : undefined,
    }
  })
};

export const getResourceId = uri => {
  const matches = uri.match(new RegExp('.*/(.*)'));
  return matches && matches[1];
};

export const disconnectUser = async () => {
  return await AsyncStorage.removeItem('user');
};

export const connectCallback = () => {
  return new Promise(resolve => Linking.addEventListener('url', ({ url }) => resolve({ type: 'success', url })));
};

// Session opening is different on Android and iOS, so create a custom function
// See https://docs.expo.io/versions/latest/sdk/webbrowser/
export const openSession = async url => {
  let result;
  if (Platform.OS === 'ios') {
    result = await WebBrowser.openAuthSessionAsync(url, Constants.linkingUri);
    if (result.type === 'success') {
      return result.url;
    }
  } else {
    result = await WebBrowser.openBrowserAsync(url);

    if (result.type === 'opened') {
      result = await connectCallback();

      if (result.type === 'success') {
        return result.url;
      }
    }
  }

  return false;
};

export const connectUser = async () => {
  let user = await getLoggedUser();

  if (!user) {
    // TODO double-encode the redirectUrl otherwise it breaks the CAS authentication server ?
    const callbackUrl = await openSession(reformatUri('/auth?redirectUrl=' + encodeURIComponent(Constants.linkingUrl)));

    if (callbackUrl) {
      const token = getQueryParam('token', callbackUrl);
      const decodedToken = jwtDecode(token);

      await AsyncStorage.setItem(
        'user',
        JSON.stringify({
          token,
          userName: decodedToken.preferredUsername,
          url: decodedToken.webId
        })
      );
    }
  }

  return user;
};

// https://docs.expo.io/versions/latest/guides/push-notifications/
export const registerForPushNotifications = async () => {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Return the token that uniquely identifies this device
  return await Notifications.getExpoPushTokenAsync();
};

export const openBrowser = async link => {
  await WebBrowser.openBrowserAsync(link);
};
