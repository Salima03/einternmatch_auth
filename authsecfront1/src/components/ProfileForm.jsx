import React, { useState } from 'react';
import { updateProfile } from '../api/profileService';

function ProfileForm({ profile, onFinish }) {
  const [formData, setFormData] = useState({
    headline: profile.headline,
    summary: profile.summary,
    location: profile.location,
    phone: profile.phone,
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(profile.id, {...profile, ...formData});
    onFinish();
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input type="text" name="headline" placeholder="Titre" value={formData.headline} onChange={handleChange} />
      <input type="text" name="summary" placeholder="Résumé" value={formData.summary} onChange={handleChange} />
      <input type="text" name="location" placeholder="Localisation" value={formData.location} onChange={handleChange} />
      <input type="text" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} />
      <button type="submit" className="btn">Enregistrer</button>
    </form>
  );
}

export default ProfileForm;
