import React from 'react';
import useSparqlQuery from './useSparqlQuery';

const SparqlQuery = ({ query, children }) => {
  const { loading, data, error } = useSparqlQuery(query);
  return children({ loading, data, error });
};

export default SparqlQuery;
