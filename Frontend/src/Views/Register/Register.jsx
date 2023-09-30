import "../Login/Login.scss"; //reuse Login.scss formatting (similar elements within pages)
import React, {useState} from "react";

const Register = () => {

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
                          null
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
                          null
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
                          null
                        }
                    />
                </div>

                <p style={{ marginBottom: "20px"}}></p>
                <button onClick={null}>
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