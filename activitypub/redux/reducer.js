import produce from 'immer';
import ACTION_TYPES from './actionTypes';

const hasType = (data, type) => {
  return (
    data['@type'] === type ||
    data['type'] === type ||
    (Array.isArray(data['@type']) && data['@type'].includes(type)) ||
    (Array.isArray(data['type']) && data['type'].includes(type))
  );
};

const extractResources = data => {
  let resources = {},
    ids = [];
  if (data) {
    data.forEach(resource => {
      if (typeof resource === 'object') {
        resources[resource['@id'] || resource.id] = { data: resource, loading: false, error: null };
        ids.push(resource['@id'] || resource.id);
      } else if (typeof resource === 'string' && resource.startsWith('http')) {
        ids.push(resource);
      } else {
        throw new Error('Resources must be URIs or objects');
      }
    });
  }
  return [ids, resources];
};

const activitypubReducer = ldpReducer => (state = { resources: {}, sparqlQueries: {} }, action) =>
  produce(state, newState => {
    switch (action.type) {
      case ACTION_TYPES.COLLECTION_FETCH_TRIGGER:
        newState.resources[action.uri] = {
          data: null,
          loading: true,
          error: null
        };
        break;

      case ACTION_TYPES.COLLECTION_FETCH_SUCCESS: {
        const [ids, resources] = hasType(action.data, 'OrderedCollection')
          ? extractResources(action.data.orderedItems)
          : extractResources(action.data.items);
        newState.resources = {
          ...newState.resources,
          ...resources,
          [action.uri]: {
            data: ids,
            loading: false,
            error: null
          }
        };
        break;
      }

      case ACTION_TYPES.COLLECTION_FETCH_FAILURE:
        newState.resources[action.uri] = {
          data: null,
          loading: false,
          error: action.error
        };
        break;

      case ACTION_TYPES.ADD_TO_COLLECTION:
        // If container hasn't been cached yet, ignore
        if (newState.resources[action.collectionUri]) {
          newState.resources[action.collectionUri].data.push(action.resourceUri);
        }
        break;

      case ACTION_TYPES.REMOVE_FROM_COLLECTION:
        // If container hasn't been cached yet, ignore
        if (newState.resources[action.collectionUri]) {
          newState.resources[action.collectionUri].data = newState.resources[action.collectionUri].data.filter(
            uri => uri !== action.resourceUri
          );
        }
        break;

      default:
        // All other actions are handled by the LDP reducer
        return ldpReducer(state, action);
    }
  });

export default activitypubReducer;
