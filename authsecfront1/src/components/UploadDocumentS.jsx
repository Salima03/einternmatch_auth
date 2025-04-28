import React, { useState } from 'react';
import { uploadDocuments } from '../api/profileService';

function UploadDocuments({ profileId }) {
  const [files, setFiles] = useState({ cv: null, letter: null, profilePicture: null, coverPhoto: null });

  const handleChange = (e) => {
    setFiles({...files, [e.target.name]: e.target.files[0]});
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('cv', files.cv);
    formData.append('letter', files.letter);
    if (files.profilePicture) formData.append('profilePicture', files.profilePicture);
    if (files.coverPhoto) formData.append('coverPhoto', files.coverPhoto);

    await uploadDocuments(profileId, formData);
    window.location.reload();
  };

  return (
    <div className="upload-section">
      <input type="file" name="cv" onChange={handleChange} />
      <input type="file" name="letter" onChange={handleChange} />
      <input type="file" name="profilePicture" onChange={handleChange} />
      <input type="file" name="coverPhoto" onChange={handleChange} />
      <button className="btn" onClick={handleUpload}>Téléverser</button>
    </div>
  );
}

export default UploadDocuments;
