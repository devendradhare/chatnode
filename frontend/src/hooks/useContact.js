// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useContactContext } from "../context/contactContext.jsx";

export const useContacts = () => {
  const { setContacts } = useContactContext();
  const [loading, setLoading] = useState(false);

  const getContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contacts/");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setContacts(data);
      console.log("fetched contacts: ", data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, getContacts };
};
