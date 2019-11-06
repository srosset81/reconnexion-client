import React from 'react';
import useQuery from '../hooks/useQuery';

const UserDataLoader = ({ user }) => {
  useQuery(user.url + '/following');
  return null;
};

export default UserDataLoader;
