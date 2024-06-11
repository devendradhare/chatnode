// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useContactContext } from "../context/contactContext.jsx";
import { toast } from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { selectedContact, messages, setMessages  } = useContactContext();

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/send/${selectedContact._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      console.log("sendMessage hook function ", data);
      setMessages([...messages, data])
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, sendMessage };
};

export default useSendMessage;
