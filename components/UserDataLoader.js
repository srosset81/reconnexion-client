import React, { useEffect } from 'react';
import * as Sentry from 'sentry-expo';
import useQuery from '../hooks/useQuery';

const UserDataLoader = ({ user }) => {
  useQuery(user.url + '/following');
  useEffect(() => {
    Sentry.configureScope(scope => {
      scope.setUser({ username: user.userName });
    });
  }, [user.userName]);
  return null;
};

export default UserDataLoader;
