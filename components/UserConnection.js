import React from 'react';
import { Link } from '../elements/text';
import useLoggedUser from '../hooks/useLoggedUser';

const UserConnection = () => {
  const { user, connect, disconnect } = useLoggedUser();
  if (user) {
    return (
      <>
        Connecté en tant que {user.userName}&nbsp;
        <Link onPress={disconnect}>Se déconnecter</Link>
      </>
    );
  } else {
    return (
      <>
        Vous n'êtes pas connecté&nbsp;
        <Link onPress={connect}>Se connecter</Link>
      </>
    );
  }
};

export default UserConnection;
