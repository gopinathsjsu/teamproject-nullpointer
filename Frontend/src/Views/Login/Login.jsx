import "./Login.scss";
import Button from '../../Components/Button/Button';
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  //username storage
  const [username, setUsername]=useState(null);
  //password storage
  const [password, setPassword]=useState(null);

  //on button press, call getLogin
  const getLogin = () => {
    setError();

    fetch("http://localhost:8005/api/login", {
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
          const userObject = data.user_data;
          //console.log(userObject); 

          localStorage.setItem("user", JSON.stringify(userObject));
          if(userObject.isAdmin) {
            console.log('admin logged in successfully');
            navigate("/admin");
          }
          else {
            console.log("normal user logged in successfully");
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