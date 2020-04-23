import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import querySparqlEndpoint from './querySparqlEndpoint';
import { sparqlQueryTrigger, sparqlQuerySuccess, sparqlQueryFailure } from './actions';
import LdpContext from './LdpContext';

const initialValues = { data: null, loading: true, error: null };

const useSparqlQuery = query => {
  const dispatch = useDispatch();
  const ldpContext = useContext(LdpContext);

  const cachedQuery = useSelector(state => state.ldp.sparqlQueries[query.key]);

  const callQuery = () => {
    if (!cachedQuery) {
      dispatch(sparqlQueryTrigger(query.key));
      ldpContext
        .getHeaders()
        .then(additionalHeaders =>
          querySparqlEndpoint({
            endpoint: ldpContext.reformatUri(ldpContext.sparqlEndpoint),
            query: query.query,
            jsonContext: ldpContext.jsonContext,
            additionalHeaders
          })
        )
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
