import { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { User } from '../types';

interface UserAuth {
  name: string;
}

interface Auth {
  user: User | null;
  isLoading: boolean;
  error: any;
  isAuthenticated: boolean;
  login: (user: UserAuth) => void;
}

const AuthContext = createContext<Auth>({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  login: () => {},
});

export const AuthProvider: React.FunctionComponent = ({ children }) => {
  const router = useHistory();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loggedUser = window.sessionStorage.getItem('chat-user');

    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (router && router.push && !isLoading) {
      if (user?.name && router.location.pathname.includes('/login')) {
        router.push('/app');
      }

      if (!user?.name && !router.location.pathname.includes('/login')) {
        router.push('/login');
      }
    }
  });

  const login = (userLogin: UserAuth): void => {
    setIsLoading(true);

    if (userLogin.name.length > 4) {
      window.sessionStorage.setItem('chat-user', JSON.stringify(userLogin));
      setIsLoading(false);
      router.push('/chat');
      setUser(userLogin);
      setError('');
    } else {
      setIsLoading(false);
      setUser(null);
      setError('Name must be longer than 4 characters');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, isLoading, error }}>
      <>{children}</>
    </AuthContext.Provider>
  );
};

export const useAuth = (): Auth => useContext(AuthContext);
