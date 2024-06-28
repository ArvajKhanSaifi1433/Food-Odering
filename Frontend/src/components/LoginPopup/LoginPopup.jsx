import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import "./LoginPopup.css";
import { StoreContext } from "../../Context/StoreContextProvider";
import axios from "axios";
import { toast } from "react-toastify";

function LoginPopup({ setShowLogin }) {
  const [currentState, setCurrentState] = useState("Sign Up");

  const { url, setToken } = useContext(StoreContext);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    let newURL = url;

    if (currentState === "Sign Up") {
      newURL += "/api/v1/users/register";
    } else {
      newURL += "/api/v1/users/login";
    }

    try {
      const response = await axios.post(newURL, data);
      if (response.data.success) {
        toast.success(response.data.message);
        setToken(response.data.data.token);
        localStorage.setItem("token", response.data.data.token);
        setShowLogin(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="login-popup">
        <form
          className="login-popup-container"
          autoComplete="off"
          onSubmit={onSubmitHandler}
        >
          <div className="login-popup-title">
            <h2>{currentState}</h2>
            <img
              onClick={() => setShowLogin(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <div className="login-popup-inputs">
            {currentState === "Login" ? (
              <></>
            ) : (
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={data.name}
                onChange={onChangeHandler}
                required
              />
            )}
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={onChangeHandler}
              placeholder="Your Email"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              value={data.password}
              onChange={onChangeHandler}
              required
              minLength={8}
              maxLength={15}
            />
          </div>
          <button type="submit">
            {currentState === "Sign Up" ? "Create Account" : "Login"}
          </button>
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, i agree to the terms of use & privacy policy.</p>
          </div>
          {currentState === "Login" ? (
            <p>
              Create a new account?{" "}
              <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrentState("Login")}>Login here</span>
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export default LoginPopup;
