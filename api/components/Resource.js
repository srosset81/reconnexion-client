import React from 'react';
import useResource from '../hooks/useResource';

const Resource = ({ uri, options, children }) => {
  const { loading, data, error } = useResource(uri, options);
  return children({ loading, data, error });
};

export default Resource;
