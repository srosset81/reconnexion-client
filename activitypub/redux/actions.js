import ACTION_TYPES from './actionTypes';

export const collectionFetchTrigger = uri => ({
  type: ACTION_TYPES.COLLECTION_FETCH_TRIGGER,
  uri
});

export const collectionFetchSuccess = (uri, data) => ({
  type: ACTION_TYPES.COLLECTION_FETCH_SUCCESS,
  uri,
  data
});

export const collectionFetchFailure = (uri, error) => ({
  type: ACTION_TYPES.COLLECTION_FETCH_FAILURE,
  uri,
  error
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
