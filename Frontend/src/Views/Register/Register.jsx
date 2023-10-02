import "../Login/Login.scss"; //reuse Login.scss formatting (similar elements within pages)
import React, {useState} from "react";

const Register = () => {
  const [username, setUsername]=useState(null);
  const [password, setPassword]=useState(null);
  const [confirmPassword, setConfirm]=useState(null);

  function updateUsername(e) {
    setUsername(e.target.value);
    //console.log("username: " + username);
  }
  
  function updatePassword(e) {
    setPassword(e.target.value);
    //console.log("password: " + password);
  }

  function updateConfirm(e) {
    setConfirm(e.target.value);
  }

  function register() {
    if(password == confirmPassword) {
        // implement backend to register 
        console.log("username: " + username + " password: " + password);
    }
  }

    return (
        <div className="login-container">
          <div className="header-container">
            <h1 className="background-container">
              <div className="loginPanel-container">
                <p style={{ marginBottom: "30px" }}>Register</p>
    
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
                
                {/* confirm password login field */}
                <div className="input-container">
                    <input 
                        type="text"
                        className="pw"
                        required placeholder=" Confirm Password"
                        onChange= {
                          updateConfirm
                        }
                    />
                </div>

                <p style={{ marginBottom: "20px"}}></p>
                <button onClick={register}>
                  Register
                </button>
      
                <p style={{marginTop: "27px"}}>
    
                  {/* link to access register page*/}
                  <a href="/login" className="link">
                    Have an account? Sign In
                  </a>
                </p>
              </div>
            </h1>
          </div>
        </div>
      )
}
export default Register;