import "../Login/Login.scss"; //reuse Login.scss formatting (similar elements within pages)
import React, {useState} from "react";
// import { dispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername]=useState('');
  const [password, setPassword]=useState('');
  const [confirmPassword, setConfirmPassword]=useState('');
  const [isPending, setIsPending]=useState(false);
  const [error, setError] = useState('');
  // const dispatch = dispatch();
  const navigate = useNavigate();


  //Store username and password combination in database
  const createAccount = (e) => {
    e.preventDefault();
    const user = {username, password};
    setIsPending(true);
    setError();

    //check if passwords match
    if(username === '' || password === '') {
      setError("Error: Empty username or password");
      return;
    }
    else if(password !== confirmPassword) {
      // console.log(password + " " + confirmPassword);
      setError("Error: passwords do not match");
      return;
    }

    fetch("http://localhost:8005/api/create_account", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(user)
    })
    .then((resp) => {
      if(resp.ok) {
        //note: upon registration, can redirect user to home page && automatically logged in
        console.log('new account added');
        setIsPending(false);
        navigate("/Login");
      }
      else {
        console.log(resp)
        setError("Error: Username already exists");
      }
    })
  }

  function updateUsername(e) {
    setUsername(e.target.value);
    //console.log("username: " + username);
  }
  
  function updatePassword(e) {
    setPassword(e.target.value);
    //console.log("password: " + password);
  }

  function updateConfirm(e) {
    setConfirmPassword(e.target.value);
  }

    return (
        <div className="login-container">
          <div className="header-container">
            <h1 className="background-container">
              <div className="loginPanel-container">

                <p className="title-margin">Register</p>
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
                {<button onClick={createAccount}> Register </button>}
                <p className="error-message">{error}</p>
                
                <p style={{marginTop: "7%"}}>
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