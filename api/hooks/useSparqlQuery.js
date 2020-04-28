import { useEffect, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sparqlQueryTrigger, sparqlQuerySuccess, sparqlQueryFailure } from '../redux/actions';
import { selectSparqlQuery } from '../redux/selectors';
import LdpContext from '../context/LdpContext';
import jsonld from "jsonld";

const initialValues = { data: null, loading: true, error: null };

const useSparqlQuery = query => {
  const dispatch = useDispatch();
  const { customFetch, sparqlEndpoint, jsonContext } = useContext(LdpContext);
  const cachedQuery = useSelector(selectSparqlQuery(query.key));

  const callQuery = useCallback(async () => {
    dispatch(sparqlQueryTrigger(query.key));

    const response = await customFetch(sparqlEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/ld+json'
      },
      body: query.query
    });

    if( response.ok ) {
      let json = await response.json();
      if( jsonContext ) json = await jsonld.compact(json, jsonContext);
      dispatch(sparqlQuerySuccess(query.key, json));
      return json;
    } else {
      dispatch(sparqlQueryFailure(query.key, response.statusText));
    }
  }, [query, sparqlEndpoint, jsonContext]);

  useEffect(() => {
    if( !cachedQuery ) callQuery();
  }, [cachedQuery]);

  return { ...initialValues, ...cachedQuery, retry: callQuery };
};

export default useSparqlQuery;
