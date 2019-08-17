import { useEffect, useState } from 'react';
import { getLoggedUser, connectUser, disconnectUser } from '../functions';

const useLoggedUser = () => {
  const [user, setUser] = useState(false);

  const load = async () => {
    const userData = await getLoggedUser();
    setUser(userData);
  };

  const connect = async () => {
    const userData = await connectUser();
    setUser(userData);
  };

  const disconnect = async () => {
    await disconnectUser();
    setUser(false);
  };

  useEffect(() => {
    load();
  });

  return { user, connect, disconnect };
};

export default useLoggedUser;
