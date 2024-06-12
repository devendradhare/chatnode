// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/authContext.jsx";

const useSignup = () => {
  const { setAuthUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const signup = async ({
    fullname,
    username,
    password,
    confirmPassword,
    gender,
  }) => {
    const succes = handleInputErrors({
      fullname,
      username,
      password,
      confirmPassword,
      gender,
    });
    if (!succes) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname,
          username,
          password,
          confirmPassword,
          gender,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      localStorage.setItem("chatnodeUser", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

function handleInputErrors({
  fullname,
  username,
  password,
  confirmPassword,
  gender,
}) {
  if (!fullname || !username || !password || !confirmPassword || !gender) {
    toast.error("Please fill all the fields");
    return false;
  }
  if (password !== confirmPassword) {
    toast.error("Password do not match");
    return false;
  }
  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }
  return true;
}

export default useSignup;
