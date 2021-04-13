import {createContext, useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import {KafkaAction, KafkaMessage, KafkaTopic} from "../KafkaHandler/types";
import {User} from "../types";
import {io, Socket} from "socket.io-client";

interface UserAuth {
  name: string;
}

interface Auth {
  user: User | null;
  isLoading: boolean;
  error: any;
  isAuthenticated: boolean;
  login: (user: UserAuth) => void;
  socket: Socket | null;
}

const AuthContext = createContext<Auth>({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  login: () => {},
  socket: null,
});

export const AuthProvider: React.FunctionComponent = ({children}) => {
  const router = useHistory();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const createSocket = (): Socket => {
    const socket = io("localhost:5000");

    socket.on("connect", () => {
      console.log(`Socket ${socket.id} connected`);
    });

    setSocket(socket);

    return socket;
  };

  useEffect(() => {
    const loggedUser = window.sessionStorage.getItem("chat-user");

    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (router && router.push && !isLoading) {
      if (user?.name && router.location.pathname.includes("/login")) {
        router.push("/app");
      }

      if (!user?.name && !router.location.pathname.includes("/login")) {
        router.push("/login");
      }
    }
  });

  const login = (userLogin: UserAuth): void => {
    setIsLoading(true);

    const nameMinLength = 4;
    if (userLogin.name.length >= nameMinLength) {
      const userData: User = {
        id: uuidv4(),
        name: userLogin.name,
      };
      window.sessionStorage.setItem("chat-user", JSON.stringify(userData));

      const message: KafkaMessage = {
        topic: KafkaTopic.USER_ACTIVITY,
        messages: [
          {
            key: userData.id,
            value: {
              user: userData,
              action: KafkaAction.USER_LOGIN,
              timestamp: Date.now(),
            },
          },
        ],
      };

      const wsocket = createSocket();
      wsocket?.emit("userLogin", JSON.stringify(message));

      setIsLoading(false);
      router.push("/chat");
      setUser(userData);
      setError("");
    } else {
      setIsLoading(false);
      setUser(null);
      setError(`Name must be longer than ${nameMinLength - 1} characters`);
    }
  };

  return (
    <AuthContext.Provider
      value={{isAuthenticated: !!user, user, login, isLoading, error, socket}}
    >
      <>{children}</>
    </AuthContext.Provider>
  );
};

export const useAuth = (): Auth => useContext(AuthContext);
