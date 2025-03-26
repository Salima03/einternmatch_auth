import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import Logout from './components/Logout';

function App() {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  return (
    <div className="App">
      <h1>Secure Application</h1>
      {!token ? (
        <div>
          <Register />
          <Login setToken={setToken} />
        </div>
      ) : (
        <div>
          <ChangePassword token={token} />
          <Logout setToken={setToken} />
        </div>
      )}
    </div>
  );
}

export default App;
