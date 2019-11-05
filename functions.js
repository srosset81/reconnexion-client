import { Notifications } from 'expo';
import * as WebBrowser from 'expo-web-browser';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { AsyncStorage, Linking, Platform, Alert } from 'react-native';
import { SERVER_URL, LOCAL_IP } from './constants';

export const capitalizeFirstChar = str => str.charAt(0).toUpperCase() + str.substring(1);

export const getQueryParam = (name, url) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const formatUri = uri => {
  if (!uri.startsWith('http')) {
    uri = SERVER_URL + uri;
  }
  return uri.replace('localhost', LOCAL_IP);
};

export const getLoggedUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return user && JSON.parse(user);
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
    // We double-encode the redirectUrl otherwise it breaks the CAS authentication server
    const callbackUrl = await openSession(
      formatUri('/cas/login?redirectUrl=' + encodeURIComponent(encodeURIComponent(Constants.linkingUrl)))
    );

    if (callbackUrl) {
      // Extract the token and username from the callback url
      user = {
        token: getQueryParam('token', callbackUrl),
        userName: getQueryParam('username', callbackUrl)
      };

      user.url = SERVER_URL + '/actor/' + user.userName;

      await AsyncStorage.setItem('user', JSON.stringify(user));
    }
  }

  return user;
};

export const postApi = async (endpoint, data) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  const user = await getLoggedUser();
  if (user) headers['Authorization'] = 'Bearer ' + user.token;

  const result = await fetch(formatUri(endpoint), {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });

  if (result.status === 401) {
    await AsyncStorage.removeItem('user');

    // TODO handle token refresh
    console.log('Token has expired, cancelling...');
  }

  console.log('fetch result', result);
};

export const fetchApi = async endpoint => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  const user = await getLoggedUser();
  if (user) headers['Authorization'] = 'Bearer ' + user.token;

  let response = await fetch(formatUri(endpoint), {
    method: 'GET',
    headers
  });

  if (response.status === 401) {
    await disconnectUser();
    headers['Authorization'] = undefined;

    response = await fetch(formatUri(endpoint), {
      method: 'GET',
      headers
    });
  }

  return await response.json();
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

  // Get the token that uniquely identifies this device
  const deviceToken = await Notifications.getExpoPushTokenAsync();

  await postApi('/device', { deviceToken });
};

export const followActor = async actorUri => {
  const user = await connectUser();
  if (user) {
    await registerForPushNotifications();

    const json = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Follow',
      object: actorUri
    };

    await postApi(`/actor/${user.userName}/outbox`, json);

    Alert.alert('Message', 'Vous suivez maintenant cette action.');
  }
};

export const unfollowActor = async actorUri => {
  const user = await connectUser();

  if (user) {
    // Fetch all activities of logged user
    const outbox = await fetchApi(user.url + '/outbox');

    if (outbox.totalItems > 0) {
      // Try to find a Follow activity for this actor
      // If we don't, we will not send an Undo activity
      const followActivity = outbox.orderedItems.find(
        activity => activity.type === 'Follow' && activity.object && activity.object.id === actorUri
      );

      if (followActivity) {
        const json = {
          '@context': 'https://www.w3.org/ns/activitystreams',
          type: 'Undo',
          object: followActivity.id
        };

        await postApi(`/actor/${user.userName}/outbox`, json);

        Alert.alert('Message', 'Vous ne suivez plus cet acteur.');
      }
    }
  }
};

export const openBrowser = async link => {
  await WebBrowser.openBrowserAsync(link);
};
