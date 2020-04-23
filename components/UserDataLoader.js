import React, { useEffect } from 'react';
import * as Sentry from 'sentry-expo';
import { useResource } from '../api';

const UserDataLoader = ({ user }) => {
  useResource(user.url);
  useResource(user.url + '/following');
  useEffect(() => {
    Sentry.configureScope(scope => {
      scope.setUser({ username: user.userName });
    });
  }, [user.userName]);
  return null;
};

export default UserDataLoader;
