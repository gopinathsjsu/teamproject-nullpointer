import "./Login.scss";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const [currentUser, setUser] = useState('');
  const [error, setError] = useState('');

  //username storage
  const [username, setUsername]=useState(null);
  //password storage
  const [password, setPassword]=useState(null);

  //on button press, call getLogin
  const getLogin = () => {
    const user = {username, password};
    setError();

    fetch("http://localhost:8005/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(user)
    })
    .then((resp) => {
      if(resp.ok) {
        setUser(user);
        console.log(currentUser);
        console.log('logged in successfully');
        navigate("/");
      }
      else {
        console.log(resp)
        setError("Error: Username or password is incorrect");
      }
    })
    //return login info
    // implement backend to login (verify if account exists && if not, give error)
    //console.log("username: " + username + " password: " + password);
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
            <button onClick={getLogin}> Sign In </button>
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