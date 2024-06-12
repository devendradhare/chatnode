import { createContext, useContext, useState, useEffect } from "react";
import { useSocketContext } from "./socketContext.jsx";
import newMessageSound2 from "../assets/sounds/newMessageSound2.mp3";

export const ContactContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useContactContext = () => {
  return useContext(ContactContext);
};

// eslint-disable-next-line react/prop-types
export const ContactContextProvider = ({ children }) => {
  const [contacts, setContacts] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const { socket } = useSocketContext();
  useEffect(() => {
    socket?.on("newMessage", (message) => {
      message.shouldShake = true;
      const sound = new Audio(newMessageSound2);
      sound.play();
      const updatedContact = contacts?.map((c) => {
        if (c._id === message.senderId) {
          const addedNewMsg = {
            ...c,
            messages: [...c.messages, message],
          };
          if (message.senderId === selectedContact._id)
            setSelectedContact(addedNewMsg);
          return addedNewMsg;
        }
        return c;
      });
      setContacts(updatedContact);
    });
    return () => socket?.off("newMessage");
  }, [socket, contacts, selectedContact]);
  return (
    <ContactContext.Provider
      value={{
        contacts,
        setContacts,
        selectedContact,
        setSelectedContact,
        messages,
        setMessages,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};
