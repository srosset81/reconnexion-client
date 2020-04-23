import jsonld from 'jsonld';

const querySparqlEndpoint = async ({ endpoint, query, jsonContext, additionalHeaders }) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      accept: 'application/ld+json',
      ...additionalHeaders
    },
    body: query
  });

  if (response.ok) {
    let json = await response.json();

    if (jsonContext) {
      json = await jsonld.compact(json, jsonContext);
    }

    if (Object.keys(json).length === 1) {
      // If we have only the context, it means there is no match
      return [];
    } else if (!json['@graph']) {
      // If we have several fields but no @graph, there is a single match
      return [json];
    } else {
      return json['@graph'];
    }
  } else {
    return false;
  }
};

export default querySparqlEndpoint;
