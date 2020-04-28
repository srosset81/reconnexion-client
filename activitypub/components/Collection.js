import React from 'react';
import useCollection from '../hooks/useCollection';

const Collection = ({ uri, options, children }) => {
  const { loading, data, error } = useCollection(uri, options);
  return children({ loading, data, error });
};

export default Collection;
