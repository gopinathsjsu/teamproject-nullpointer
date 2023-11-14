import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Button from '../../Components/Button/Button';
import { login } from "../../Redux/userReducer";
import "./Login.scss";
import { host } from "../../env";


const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  //username storage
  const [username, setUsername]=useState(null);
  //password storage
  const [password, setPassword]=useState(null);

  //on button press, call getLogin
  const getLogin = () => {
    setError();

    fetch(`${host}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: username,
        password: password
      })
    })
      .then((resp) => resp.json())
      .then((data) => {
        if(data.error) {
          setError(`Error: ${data.error}`);
        }
        else if (data.access_token) {
          const { access_token, user_data } = data;
          localStorage.setItem("x-access-token", access_token);
          dispatch(login(user_data));

          if(user_data.isAdmin) {
            navigate("/admin");
          }
          else {
            navigate("/");
          }
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setError("An unexpected error occurred");
      });
  }
  
  function updateUsername(e) {
    setUsername(e.target.value);
    //console.log("username: " + username);
  }
  
  function updatePassword(e) {
    setPassword(e.target.value);
    //console.log("password: " + password);
  }
  
  return (
    <div className="login-container">
      <div className="header-container">
        <h1 className="background-container">
          <div className="loginPanel-container">
            
            <p className="title-margin">Sign In</p>
            {/* username login field */}
            <div className="input-container">
                <input 
                    type="text"
                    required placeholder=" Username"
                    onChange= { 
                      updateUsername
                    }
                />
            </div>

            <p style={{ marginBottom: "20px"}}></p>
            {/* password login field */}
            <div className="input-container">
                <input 
                    type="text"
                    className="pw"
                    required placeholder=" Password"
                    onChange= {
                      updatePassword
                    }
                />
            </div>
            
            <p style={{ marginBottom: "20px"}}></p>
            <Button type="button-primary" onClick={getLogin}> Sign In </Button>
            <p className="error-message">{error}</p>

            <p style={{marginTop: "84px"}}></p>
              {/* link to access register page*/}
              <a href="/register" className="link">
                Don't have an account? Register
              </a>
            {/* </p> */}
          </div>
        </h1>
      </div>
    </div>
  )
};

export default Login;