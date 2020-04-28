import React from 'react';
import useContainer from '../hooks/useContainer';

const Container = ({ uri, options, children }) => {
  const { loading, data, error } = useContainer(uri, options);
  return children({ loading, data, error });
};

export default Container;
