import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./authContext.jsx";
import io from "socket.io-client";

export const SocketContext = createContext(null);

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io("https://chatnode-3b0x.onrender.com/", {
        query: {
          userId: authUser._id,
        },
      });
      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        console.log("Online users", users);
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    return () => {};
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
