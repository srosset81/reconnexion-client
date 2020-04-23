const reducer = (state = { queries: {}, sparqlQueries: {} }, action) => {
  switch (action.type) {
    case 'QUERY_TRIGGER': {
      return {
        ...state,
        queries: {
          ...state.queries,
          [action.endpoint]: {
            data: null,
            loading: true,
            error: null
          }
        }
      };
    }

    case 'SPARQL_QUERY_TRIGGER': {
      return {
        ...state,
        sparqlQueries: {
          ...state.sparqlQueries,
          [action.key]: {
            data: null,
            loading: true,
            error: null
          }
        }
      };
    }

    case 'QUERY_SUCCESS': {
      if (action.data.type === 'OrderedCollection' || action.data.type === 'Collection') {
        let entities = {}, itemsIds = null;

        if( action.data.orderedItems ) {
          itemsIds = action.data.orderedItems.map(item => {
            entities = { ...entities, [item.id]: { data: item, loading: false, error: null } };
            return item.id;
          });
        } else if( action.data.items ) {
          itemsIds = action.data.items.map(item => {
            if( typeof item === 'object' ) {
              entities = { ...entities, [item.id]: { data: item, loading: false, error: null } };
              return item.id;
            } else {
              return item;
            }
          });
        }

        return {
          ...state,
          queries: {
            ...state.queries,
            ...entities,
            [action.endpoint]: {
              data: itemsIds,
              loading: false,
              error: null
            }
          }
        };
      } else {
        return {
          ...state,
          queries: {
            ...state.queries,
            [action.endpoint]: {
              data: action.data,
              loading: false,
              error: null
            }
          }
        };
      }
    }

    case 'SPARQL_QUERY_SUCCESS': {
      let entities;
      const itemsIds = action.data.map(item => {
        entities = { ...entities, [item.id]: { data: item, loading: false, error: null } };
        return item.id;
      });
      return {
        ...state,
        queries: {
          ...state.queries,
          ...entities,
        },
        sparqlQueries: {
          [action.key]: {
            data: itemsIds,
            loading: false,
            error: null
          }
        }
      };
    }

    case 'QUERY_FAILURE': {
      return {
        ...state,
        queries: {
          ...state.queries,
          [action.endpoint]: {
            data: null,
            loading: false,
            error: action.error
          }
        }
      };
    }

    case 'SPARQL_QUERY_FAILURE': {
      return {
        ...state,
        sparqlQueries: {
          ...state.sparqlQueries,
          [action.key]: {
            data: null,
            loading: false,
            error: action.error
          }
        }
      };
    }

    case 'ADD_TO_DATA_LIST': {
      let query = state.queries[action.endpoint];
      if (query && query.data) query.data.push(action.value);

      return {
        ...state,
        queries: {
          ...state.queries,
          [action.endpoint]: query
        }
      };
    }

    case 'REMOVE_FROM_DATA_LIST': {
      let query = state.queries[action.endpoint];
      if (query && query.data) query.data = query.data.filter(value => value !== action.value);

      return {
        ...state,
        queries: {
          ...state.queries,
          [action.endpoint]: query
        }
      };
    }

    default:
      return state;
  }
};

export default reducer;
