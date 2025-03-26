import React, { useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1217/api/v1/auth/authenticate', {
        email: email,
        password: password
      });

      if (response && response.data) {
        console.log("Réponse du backend :", response);
        const token = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        setToken(token);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);

        axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        setMessage('Login successful!');
      } else {
        setMessage('Login failed!');
      }
    } catch (error) {
      console.error("Erreur Axios :", error.response ? error.response.data : error.message);
      setMessage('Login failed!');
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      console.log("Google Response:", response);
      const backendResponse = await axios.post("http://localhost:1217/api/v1/auth/google", {
        token: response.credential
      });

      if (backendResponse && backendResponse.data) {
        setUser(backendResponse.data);
        localStorage.setItem("accessToken", backendResponse.data.access_token);
        localStorage.setItem("refreshToken", backendResponse.data.refresh_token);

        axios.defaults.headers['Authorization'] = `Bearer ${backendResponse.data.access_token}`;
        setMessage(`Bienvenue, ${backendResponse.data.name}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'authentification Google :", error);
      setMessage("Échec de l'authentification Google");
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Erreur Google Login :", error);
    setMessage("Connexion avec Google échouée");
  };

  return (
    <GoogleOAuthProvider clientId="86090769905-dqdmq8kn19frc6a3ad8rhi2aqmkakopj.apps.googleusercontent.com">
      <div>
        <h2>Login</h2>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>

        <h3>Ou connectez-vous avec Google</h3>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />

        <p>{message}</p>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
