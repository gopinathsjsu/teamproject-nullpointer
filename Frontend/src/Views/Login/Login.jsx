import "./Login.scss";
import React, {useState} from "react";

const Login = () => {
  //username storage
  const [username, setUsername]=useState(null);
  //password storage
  const [password, setPassword]=useState(null);

  //on button press, call getLogin
  const getLogin = () => {
    //return login info
    // implement backend to login (verify if account exists && if not, give error)
    console.log("username: " + username + " password: " + password);
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
            <p style={{ marginBottom: "30px" }}>Sign In</p>

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
            <button onClick={getLogin}>
              Sign In
            </button>
  
            <p style={{marginTop: "100px"}}>

              {/* link to access register page*/}
              <a href="/register" className="link">
                Don't have an account? Register
              </a>
            </p>
          </div>
        </h1>
      </div>
    </div>
  )
};

export default Login;