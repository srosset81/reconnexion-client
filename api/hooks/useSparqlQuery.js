import { useEffect, useContext } from 'react';
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

  const callQuery = () => {
    if (!cachedQuery) {
      dispatch(sparqlQueryTrigger(query.key, query.query));
      customFetch(sparqlEndpoint, {
        method: 'POST',
        headers: {
          accept: 'application/ld+json'
        },
        body: query.query
      })
        .then(response => response.json())
        .then(json => jsonContext ? jsonld.compact(json, jsonContext) : json)
        .then(data => dispatch(sparqlQuerySuccess(query.key, data)))
        .catch(error => {
          console.error(error);
          dispatch(sparqlQueryFailure(query.key, error.message));
        });
    }
  };

  useEffect(() => {
    callQuery();
  }, [query.key]);

  return { ...initialValues, ...cachedQuery, retry: callQuery };
};

export default useSparqlQuery;
