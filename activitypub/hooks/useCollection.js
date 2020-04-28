import { useEffect } from "react";
import useLazyCollection from './useLazyCollection';

const useCollection = (uri, options = { cacheOnly: false }) => {
  const { fetch, data, loading, error, retry } = useLazyCollection(uri);

  useEffect(() => {
    if( !data && !options.cacheOnly ) {
      fetch()
    }
  }, [uri]);

  return { data, loading, error, retry };
};

export default useCollection;
