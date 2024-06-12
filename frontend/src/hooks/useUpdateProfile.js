import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/authContext.jsx";

const useUpdateProfile = () => {
  const { setAuthUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const updateProfile = async (inputs) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      localStorage.setItem("chatnodeUser", JSON.stringify(data));
      setAuthUser(data);
      toast.success("profile updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, updateProfile };
};

export default useUpdateProfile;
