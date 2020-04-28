import React from 'react';
import useSparqlQuery from '../hooks/useSparqlQuery';

const SparqlQuery = ({ query, children }) => {
  const { loading, data, error } = useSparqlQuery(query);
  return children({ loading, data, error });
};

export default SparqlQuery;
