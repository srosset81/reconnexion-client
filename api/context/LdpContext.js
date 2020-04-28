import React from 'react';

const LdpContext = React.createContext({
  sparqlEndpoint: null,
  jsonContext: null,
  customFetch: fetch,
  getWebId: () => null
});

export default LdpContext;
