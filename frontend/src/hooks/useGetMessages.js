import { useState, useEffect } from "react";
import { useContactContext } from "../context/contactContext.jsx";
import { toast } from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { selectedContact, messages, setMessages } = useContactContext();
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedContact._id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        console.log("getMessages fetched: ", data);
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (selectedContact?._id) getMessages();
  }, [selectedContact?._id, setMessages]);

  return { loading, messages };
};

export default useGetMessages;
