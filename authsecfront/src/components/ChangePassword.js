import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ token }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmationPassword) {
      setMessage("Passwords don't match!");
      return;
    }

    try {
      await axios.patch(
        'http://localhost:1217/api/v1/users',
        {
          currentPassword,
          newPassword,
          confirmationPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Password changed successfully!');
    } catch (error) {
      setMessage('Password change failed!');
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmationPassword}
          onChange={(e) => setConfirmationPassword(e.target.value)}
        />
        <button type="submit">Change Password</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ChangePassword;
