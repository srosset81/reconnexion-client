import { useEffect, useState } from 'react';
import jsonld from 'jsonld';
import ontologies from '../ontologies.json';

const getJsonContext = (ontologies, mainOntology) => {
  let pattern = {};
  ontologies.forEach(ontology => (pattern[ontology.prefix] = ontology.url));
  if (mainOntology) {
    delete pattern[mainOntology];
    return [ontologies.find(ontology => ontology.prefix === mainOntology).context, pattern];
  } else {
    return pattern;
  }
};

const useSparqlQuery = (query) => {
  const [ result, setResult ] = useState(null);

  useEffect(() => {
    fetch('http://192.168.42.187:3000/sparql', {
      method: 'POST',
      headers: {
        accept: 'application/ld+json'
      },
      body: query.query
    })
      .then(result => result.json())
      .then(json => jsonld.compact(json, getJsonContext(ontologies, 'as')))
      .then(compactJson => {
        if (Object.keys(compactJson).length === 1) {
          // If we have only the context, it means there is no match
          setResult([]);
        } else if (!compactJson['@graph']) {
          // If we have several fields but no @graph, there is a single match
          setResult([compactJson]);
        } else {
          setResult(compactJson['@graph']);
        }
      });
  }, [query.key]);

  return result;
};

export default useSparqlQuery;
