// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link } from "react-router-dom";
import style from "./Signup.module.css";
import Button from "@mui/material/Button";
import useSignup from "./../hooks/useSignup";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { loading, signup } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(input);
  };

  function handleInputChange(e) {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  return (
    <div className={style.SignInPage}>
      <form className={style.SignInBox} onSubmit={(e) => handleSubmit(e)}>
        <h1>SIGN UP CHATNODE</h1>
        <input
          type="text"
          className={(style.email, style.input)}
          placeholder="FULL NAME"
          name="fullname"
          onChange={(e) => handleInputChange(e)}
          required
        />
        <input
          type="text"
          className={(style.name, style.input)}
          placeholder="USERNAME"
          name="username"
          onChange={(e) => handleInputChange(e)}
          required
        />
        <input
          type="password"
          className={(style.password, style.input)}
          placeholder="PASSWORD"
          name="password"
          onChange={(e) => handleInputChange(e)}
        />
        <input
          type="password"
          className={(style.confirmPassword, style.input)}
          placeholder="CONFIRM PASSWORD"
          name="confirmPassword"
          onChange={(e) => handleInputChange(e)}
        />

        <div className="flex  w-[90%] items-center justify-between">
          <span>GENDER</span>
          <label className="label cursor-pointer gap-4">
            <span className="label-text">Male</span>
            <input
              name="gender"
              value="male"
              onChange={(e) => handleInputChange(e)}
              type="checkbox"
              className="checkbox"
              checked={input.gender === "male"}
            />
          </label>
          <label className="label cursor-pointer gap-4">
            <span className="label-text">Female</span>
            <input
              name="gender"
              value="female"
              onChange={(e) => handleInputChange(e)}
              type="checkbox"
              className="checkbox"
              checked={input.gender === "female"}
            />
          </label>
        </div>

        <Button
          type="submit"
          id={style.SignInBtn}
          variant="outlined"
          color="inherit"
        >
          {loading ? (
            <span className="loading loading-dots loading-md"></span>
          ) : (
            "SIGN UP"
          )}
        </Button>
        <p>
          {"don't have an account ?"}
          <Link to="/login">
            <Button variant="text" color="primary">
              Login
            </Button>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
