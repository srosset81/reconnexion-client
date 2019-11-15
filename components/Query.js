import React from 'react';
import useQuery from '../hooks/useQuery';

const Query = ({ endpoint, options, children }) => {
  const { loading, data, error } = useQuery(endpoint, options);

  return children({ loading, data, error });
};

export default Query;
