import ACTION_TYPES from './actionTypes';

export const resourceFetchTrigger = uri => ({
  type: ACTION_TYPES.RESOURCE_FETCH_TRIGGER,
  uri
});

export const resourceFetchSuccess = (uri, data) => ({
  type: ACTION_TYPES.RESOURCE_FETCH_SUCCESS,
  uri,
  data
});

export const resourceFetchFailure = (uri, error) => ({
  type: ACTION_TYPES.RESOURCE_FETCH_FAILURE,
  uri,
  error
});

export const sparqlQueryTrigger = queryKey => ({
  type: ACTION_TYPES.SPARQL_QUERY_TRIGGER,
  queryKey
});

export const sparqlQuerySuccess = (queryKey, data) => ({
  type: ACTION_TYPES.SPARQL_QUERY_SUCCESS,
  queryKey,
  data
});

export const sparqlQueryFailure = (queryKey, error) => ({
  type: ACTION_TYPES.SPARQL_QUERY_FAILURE,
  queryKey,
  error
});

export const addResource = (uri, data) => ({
  type: ACTION_TYPES.ADD_RESOURCE,
  uri,
  data
});

export const editResource = (uri, data) => ({
  type: ACTION_TYPES.EDIT_RESOURCE,
  uri,
  data
});

export const deleteResource = uri => ({
  type: ACTION_TYPES.DELETE_RESOURCE,
  uri
});

export const addToContainer = (containerUri, resourceUri) => ({
  type: ACTION_TYPES.ADD_TO_CONTAINER,
  containerUri,
  resourceUri
});

export const removeFromContainer = (containerUri, resourceUri) => ({
  type: ACTION_TYPES.REMOVE_FROM_CONTAINER,
  containerUri,
  resourceUri
});

export const addToCollection = (collectionUri, resourceUri) => ({
  type: ACTION_TYPES.ADD_TO_COLLECTION,
  collectionUri,
  resourceUri
});

export const removeFromCollection = (collectionUri, resourceUri) => ({
  type: ACTION_TYPES.REMOVE_FROM_COLLECTION,
  collectionUri,
  resourceUri
});
