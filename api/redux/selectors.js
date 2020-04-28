export const selectResource = uri => state => state.ldp.resources[uri];

export const selectSparqlQuery = queryKey => state => state.ldp.sparqlQueries[queryKey];
