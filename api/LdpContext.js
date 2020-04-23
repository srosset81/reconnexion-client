import React from 'react';

const LdpContext = React.createContext({
  sparqlEndpoint: null,
  jsonContext: null,
  reformatUri: uri => uri,
  getHeaders: () => {}
});

export default LdpContext;
