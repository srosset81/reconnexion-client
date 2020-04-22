import { useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchSparqlEndpoint} from "../functions";

const initialValues = { data: null, loading: true, error: null };
const defaultOptions = { cacheOnly: false };

const useSparqlQuery = (query, { cacheOnly } = defaultOptions) => {
  const dispatch = useDispatch();
  const cachedQuery = useSelector(state => state.sparqlQueries[query.key]);

  const callFetch = () => {
    if (!cachedQuery) {
      dispatch({ type: 'SPARQL_QUERY_TRIGGER', key: query.key });
      fetchSparqlEndpoint(query.query)
        .then(data => {
          dispatch({ type: 'SPARQL_QUERY_SUCCESS', key: query.key, data });
        })
        .catch(error => {
          dispatch({ type: 'SPARQL_QUERY_FAILURE', key: query.key, error: error.message });
        });
    }
  };

  useEffect(() => {
    if (!cacheOnly) callFetch();
  }, [query.key]);

  return { ...initialValues, ...cachedQuery, retry: callFetch };
};

export default useSparqlQuery;
