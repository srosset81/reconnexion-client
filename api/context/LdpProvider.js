import React from 'react';
import LdpContext from './LdpContext';

const LdpProvider = ({ sparqlEndpoint = '/sparql', customFetch = fetch, jsonContext, getWebId, children }) => (
  <LdpContext.Provider
    value={{
      sparqlEndpoint,
      customFetch,
      jsonContext,
      getWebId
    }}
  >
    {children}
  </LdpContext.Provider>
);

export default LdpProvider;
