import React from 'react';
import LdpContext from './LdpContext';

const LdpProvider = ({ sparqlEndpoint = '/sparql', jsonContext, reformatUri, getHeaders, children }) => (
  <LdpContext.Provider
    value={{
      sparqlEndpoint,
      jsonContext,
      reformatUri,
      getHeaders
    }}
  >
    {children}
  </LdpContext.Provider>
);

export default LdpProvider;
