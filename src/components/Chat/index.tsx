import {useEffect, useState} from "react";
import styled from "styled-components";
import {useAuth} from "../../context/Auth";
import {User} from "../../types";

const Container = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChatWrapper = styled.div`
  width: 500px;
  height: 500px;
  padding: 20px;
  border-radius: ${({theme}) => theme.borderRadius};
  background-color: ${({theme}) => theme.colors.white};
  color: ${({theme}) => theme.colors.main};
`;

const Chat: React.FC = () => {
  const {socket} = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    let isMounted = true;
    socket?.on("userOnline", (newUsers: User[]) => {
      if (isMounted) setUsers(newUsers);
    });

    return () => {
      isMounted = false;
    };
  }, [socket, users]);

  return (
    <Container>
      <ChatWrapper>
        {users.map((user) => (
          <p key={user.id as string}>{user.name}</p>
        ))}
      </ChatWrapper>
    </Container>
  );
};

export default Chat;
