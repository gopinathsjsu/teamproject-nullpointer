import "./Login.scss";
import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";

const Login = () => {
  let Navigate = useNavigate;
  //username storage
  const [username, setUsername]=useState(null);
  //password storage
  const [password, setPassword]=useState(null);

  //on button press, call getLogin
  const getLogin = () => {
    //return login info
    console.log("username: " + username + " password: " + password);
  }
  
  //To do: add a way to route to the register page
  // const goToRegisterPage = () => {
  //   let path = "/";
  //   Navigate(path);
  // }
  
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
          <h1 className="loginPanel-container">
            <p style={{ marginBottom: '30px' }}>Sign In</p>

            {/* username login field */}
            <div className="input-container">
                <input 
                    type="text"
                    required placeholder="Username"
                    onChange= { 
                      updateUsername
                    }
                />
            </div>

            <p style={{ marginBottom: '20px' }}></p>

            {/* password login field */}
            <div className="input-container">
                <input 
                    type="text"
                    required placeholder="Password"
                    onChange= {
                      updatePassword
                    }
                />
            </div>

            <button onClick={getLogin}>
              Sign In
            </button>
  
            <p style={{marginTop: "50px", fontSize: 15, color: "lightblue"}}>
                {/* <link to = {goToRegisterPage}>
                  Don't have an account? Register
                </link> */}
            </p>
          </h1>
        </h1>
      </div>
    </div>
  )
};

export default Login;