import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import Logout from './components/Logout';


function App() {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/change-password" element={<ChangePassword token={token} />} />
          <Route path="/logout" element={<Logout setToken={setToken} />} />
          
          {/* You might want to add a default route */}
         
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;