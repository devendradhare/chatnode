import { createContext, useContext, useState, useEffect } from "react";

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
  useEffect(() => {
    console.log("selectedContact", selectedContact);
  }, [selectedContact]);
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
