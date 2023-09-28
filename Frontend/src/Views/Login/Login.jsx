import "./Login.scss";

let username = "{username from input}";
// let password = "{password from input}";
const Login = () => {

  const getLogin = () =>{
    //return login info

  }

//   setUsername(e) {
//     this.setState({
//         username: e.target.value
//     });
//   }
  
  return (
    <div className="login-container">
      <div className="header-container">
        <h1 className="background">
          Sign In
            {/* username login field */}
            <div className="input-container">
                <label>Username </label>
                <input 
                    type="text" 
                    id = "username"
                    required placeholder="Username"
                    // TODO: create on change functionality, using setUsername function to update username variable
                    // onChange={ 
                    //     (e) => this.setUsername(e)
                    // }
                />
            </div>

            {/* password login field */}
            <div className="input-container">
                <label>Password </label>
                <input 
                    type="text" 
                    name="username" 
                    required placeholder="Password"
                />
            </div>

        </h1>
      </div>
    </div>
  )
};

export default Login;