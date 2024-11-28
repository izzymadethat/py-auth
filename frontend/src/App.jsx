import { useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitted(false);
    try {
      const newUser = {
        email: signupEmail,
        password: signupPassword
      };
      const response = await axios.post("/register", newUser);

      if (response.status >= 400) {
        setMessage(response.data.error);
        return;
      }

      setIsSubmitted(true);
      setMessage("Successfully registered! You can now login.");
      setSignupEmail("");
      setSignupPassword("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const existingUser = {
      email: loginEmail,
      password: loginPassword
    };

    try {
      const response = await axios.post("/login", existingUser);
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main>
      <h1>Authentication App</h1>

      <br />

      <div>
        <h2>Login to see your info</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email" style={{ display: "flex", gap: "10px" }}>
            Email
            <input type="email" id="email" name="email" placeholder="Enter your email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
          </label>
          <label htmlFor="email" style={{ display: "flex", gap: "10px" }}>
            Password
            <input type="password" id="password" name="password" placeholder="Enter your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
          </label>
          <button>Login</button>
        </form>
      </div>

      <hr />
      <br />

      <div>
        <h2>Signup so you can see your info</h2>
        <form onSubmit={handleSignup}>
          <label htmlFor="email" style={{ display: "flex", gap: "10px" }}>
            Email
            <input type="email" id="email" name="email" placeholder="Enter your email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
          </label>
          <label htmlFor="passwordSignup" style={{ display: "flex", gap: "10px" }}>
            Password
            <input type="password" id="passwordSignup" name="passwordSignup" placeholder="Enter your password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
          </label>
          <button>Signup</button>

          {isSubmitted && <p>{message}</p>}
        </form>
      </div>


      <br />
      {user && (
        <div>
          <hr />
          <h2>Hi {user.email}!</h2>
          <p>Your ID is: {user.id}</p>
          <hr />
        </div>
      )}

    </main>
  );
}

export default App;
