import produce from 'immer';
import ACTION_TYPES from './actionTypes';

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

const ldpReducer = (state = { resources: {}, sparqlQueries: {} }, action) =>
  produce(state, newState => {
    switch (action.type) {
      case ACTION_TYPES.RESOURCE_FETCH_TRIGGER:
      case ACTION_TYPES.CONTAINER_FETCH_TRIGGER:
        newState.resources[action.uri] = {
          data: null,
          loading: true,
          error: null
        };
        break;

      case ACTION_TYPES.RESOURCE_FETCH_SUCCESS:
        newState.resources[action.uri] = {
          data: action.data,
          loading: false,
          error: null
        };
        break;

      case ACTION_TYPES.CONTAINER_FETCH_SUCCESS: {
        const [ids, resources] = extractResources(action.data['ldp:contains']);
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

      case ACTION_TYPES.RESOURCE_FETCH_FAILURE:
      case ACTION_TYPES.CONTAINER_FETCH_FAILURE:
        newState.resources[action.uri] = {
          data: null,
          loading: false,
          error: action.error
        };
        break;

      case ACTION_TYPES.SPARQL_QUERY_TRIGGER:
        newState.sparqlQueries[action.queryKey] = {
          data: null,
          loading: true,
          error: null
        };
        break;

      case ACTION_TYPES.SPARQL_QUERY_SUCCESS: {
        let results = [];
        if (Object.keys(action.data).length === 1) {
          // If we have only the context, it means there is no match
          results = [];
        } else if (!action.data['@graph']) {
          // If we have several fields but no @graph, there is a single match
          results = [action.data];
        } else {
          results = action.data['@graph'];
        }
        const [ids, resources] = extractResources(results);
        newState.resources = {
          ...newState.resources,
          ...resources
        };
        newState.sparqlQueries[action.queryKey] = {
          data: ids,
          loading: false,
          error: null
        };
        break;
      }

      case ACTION_TYPES.SPARQL_QUERY_FAILURE:
        newState.sparqlQueries[action.queryKey] = {
          data: null,
          loading: false,
          error: action.error
        };
        break;

      case ACTION_TYPES.ADD_RESOURCE:
        newState.resources[action.uri] = {
          loading: false,
          error: null,
          data: action.data
        };
        break;

      case ACTION_TYPES.EDIT_RESOURCE:
        newState.resources[action.uri] = {
          data: action.data
        };
        break;

      case ACTION_TYPES.DELETE_RESOURCE:
        delete newState.resources[action.uri];
        break;

      case ACTION_TYPES.ADD_TO_CONTAINER:
        // If container hasn't been cached yet, ignore
        if (newState.resources[action.containerUri]) {
          newState.resources[action.containerUri].data.push(action.resourceUri);
        }
        break;

      case ACTION_TYPES.REMOVE_FROM_CONTAINER:
        // If container hasn't been cached yet, ignore
        if (newState.resources[action.containerUri]) {
          newState.resources[action.containerUri].data = newState.resources[action.containerUri].data.filter(
            uri => uri !== action.resourceUri
          );
        }
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
        break;
    }
  });

export default ldpReducer;
