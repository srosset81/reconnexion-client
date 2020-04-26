import { getResourceId } from './functions';

export const getActionsByGroup = ({ groupUri }) => ({
  key: `getActionsByGroup/${getResourceId(groupUri)}`,
  query: `
    PREFIX as: <https://www.w3.org/ns/activitystreams#>
    PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
    CONSTRUCT {
      ?s1 ?p1 ?o1 .
    }
    WHERE {
      ?s1 ?p1 ?o1 .
      ?s1 a pair:Project .
      ?s1 pair:involves "${groupUri}" .
      MINUS { ?s1 as:tag <http://localhost:3000/status/abandonnee> } .
    }
  `
});

export const getNewsByAction = ({ actionUri }) => ({
  key: `getNewsByAction/${getResourceId(actionUri)}`,
  query: `
    PREFIX as: <https://www.w3.org/ns/activitystreams#>
    CONSTRUCT
    WHERE {
      ?s1 ?p1 ?o1 .
      ?s1 a as:Note .
      ?s1 as:attributedTo <${actionUri}> .
      # We don't want blank nodes
      FILTER ( isURI(?s1) )
    }
  `
});
