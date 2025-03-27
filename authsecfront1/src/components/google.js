import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginButton = ({ setUser }) => {
  const handleSuccess = async (response) => {
    try {
      console.log("Google response:", response);
      const backendResponse = await axios.get("http://localhost:1217/api/v1/auth/google", {
        headers: { Authorization: `Bearer ${response.credential}` },
      });
      setUser(backendResponse.data);
      localStorage.setItem("user", JSON.stringify(backendResponse.data));
    } catch (error) {
      console.error("Erreur de connexion avec Google:", error);
    }
  };

  const handleFailure = (error) => {
    console.error("Google Login Error:", error);
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleFailure}
    />
  );
};

export default GoogleLoginButton;
