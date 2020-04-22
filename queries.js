export const getActionsByGroup = ({ groupId }) => ({
  key: `getActionsByGroup/${groupId}`,
  query: `
    PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
    CONSTRUCT { 
      ?s1 ?p1 ?o1
    }
    WHERE {
      ?s1 ?p1 ?o1 .
      ?s1 a pair:Project .
      ?s1 pair:involves "http://localhost:3000/actors/${groupId}" .
    }
  `
});
