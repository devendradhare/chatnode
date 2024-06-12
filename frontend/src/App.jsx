import "./App.css";
import Home from "./pages/home.jsx";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/authContext.jsx";

function App() {
  const { authUser } = useAuthContext();
  return (
    <>
      {/* <Home />; */}
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
      </Routes>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            backgroundColor: "rgba(255,255,255, .9)",
            // color: "#713200",
            zIndex: "99",
          },
        }}
      />
    </>
  );
}

export default App;
