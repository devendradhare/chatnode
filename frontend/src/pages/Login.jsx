// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import style from "./Signup.module.css";
import Button from "@mui/material/Button";
import useLogin from "../hooks/useLogin.js";

const Login = () => {
  const { loading, login } = useLogin();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(input);
    login(input);
  };

  function handleInputChange(e) {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  return (
    <div className={style.SignInPage}>
      <form className={style.SignInBox} onSubmit={(e) => handleSubmit(e)}>
        <h1>LOGIN CAHTNODE</h1>
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

        <Button
          type="submit"
          id={style.SignInBtn}
          variant="outlined"
          color="inherit"
        >
          LOGIN
        </Button>
        <p>
          alredy have an account ?
          <Link to="/signup">
            <Button variant="text" color="primary">
              signup
            </Button>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
