import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import Logout from './components/Logout';
import CompanyProfile from './components/CompanyProfile';
import StudentProfile from './components/StudentProfile';
import Home from './components/Home';
import StudentProfileCreate from "./pages/StudentProfileCreate";
import StudentProfileEdit from "./pages/StudentProfileEdit";
import StudentProfileView from "./pages/StudentProfileView";
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
          <Route path="/homecompany" element={<CompanyProfile />} />
          <Route path="/student" element={<Home token={token} />} />
          <Route path="/student/profile/:id" element={<StudentProfile />} />
          <Route path="/profile/create" element={<StudentProfileCreate />} />
        <Route path="/profile/edit/:id" element={<StudentProfileEdit />} />
        <Route path="/profile/view" element={<StudentProfileView />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
