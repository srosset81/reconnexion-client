import { useContext } from 'react';
import LdpContext from "../context/LdpContext";

const useFetch = () => {
  const { customFetch } = useContext(LdpContext);
  return customFetch;
};

export default useFetch;
