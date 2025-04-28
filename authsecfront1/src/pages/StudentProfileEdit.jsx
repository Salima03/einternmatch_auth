import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './StudentProfileForm.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1217/api/v1/profiles';
const DEFAULT_PROFILE_PICTURE = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const StudentProfileEdit = () => {
  const [profile, setProfile] = useState({
    id: null,
    headline: '',
    summary: '',
    location: '',
    phone: '',
    certifications: [{ name: '', issuedBy: '', issueDate: '', url: '' }],
    educations: [{ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' }],
    experiences: [{ title: '', company: '', location: '', startDate: '', endDate: '', description: '' }],
    skills: [{ name: '' }],
  });

  const [cvFile, setCvFile] = useState(null);
  const [letterFile, setLetterFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(DEFAULT_PROFILE_PICTURE);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);   // URL pour afficher
  const [coverFile, setCoverFile] = useState(null);      // Fichier pour upload
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileExists, setProfileExists] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setProfile(response.data);
        setProfileExists(true);

        // Gestion de la photo de profil
        try {
          const pictureResponse = await axios.get(`${API_BASE_URL}/profile-picture`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob',
          });
          const imageUrl = URL.createObjectURL(pictureResponse.data);
          setProfilePicture(imageUrl);
        } catch (pictureError) {
          if (pictureError.response && pictureError.response.status === 404) {
            console.warn("Photo de profil non trouvée, utilisation de l'image par défaut.");
            setProfilePicture(DEFAULT_PROFILE_PICTURE);
          } else {
            console.error("Erreur chargement photo:", pictureError);
          }
        }

        // Gestion de la cover
        if (response.data.coverPhotoUrl) {
          setCoverPhoto(response.data.coverPhotoUrl);
        }
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setProfileExists(false);
      } else {
        setError('Erreur lors du chargement du profil.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeProfileField = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (section, index, e) => {
    const { name, value } = e.target;
    setProfile(prev => {
      const updatedArray = [...prev[section]];
      updatedArray[index][name] = value;
      return { ...prev, [section]: updatedArray };
    });
  };

  const addArrayItem = (section, newItem) => {
    setProfile(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(URL.createObjectURL(file));
      setCoverFile(file);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
      setProfilePictureFile(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("accessToken");
  if (!token) {
    navigate("/login");
    return;
  }

  const formData = new FormData();
  formData.append('profile', JSON.stringify(profile));

  // Ajoute les fichiers uniquement si un nouveau fichier a été sélectionné
  if (cvFile) {
    formData.append('cv', cvFile);
  }
  if (letterFile) {
    formData.append('letter', letterFile);
  }
  
  // Gestion intelligente de la photo de profil
  if (profilePictureFile) {
    formData.append('profilePicture', profilePictureFile);
  } else {
    // si pas de nouveau fichier, RIEN n'est ajouté pour la photo (donc l'ancienne est conservée côté serveur)
  }

  // Gestion intelligente de la cover photo
  if (coverFile) {
    formData.append('coverPhoto', coverFile);
  } else {
    // pareil, ne rien toucher si pas de nouveau fichier
  }

  setLoading(true);

  try {
    if (profileExists && profile.id) {
      await axios.put(`${API_BASE_URL}/${profile.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert('Profil mis à jour avec succès !');
    } else {
      const response = await axios.post(`${API_BASE_URL}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile(response.data);
      setProfileExists(true);
      alert('Profil créé avec succès !');
    }
    navigate('/profile/view');
  } catch (err) {
    if (err.response?.status === 403) {
      setError("Accès refusé. Veuillez vérifier votre connexion.");
    } else if (err.response?.status === 500) {
      setError("Erreur serveur. Vérifiez les données saisies.");
    } else {
      setError("Erreur inconnue.");
    }
  } finally {
    setLoading(false);
  }
};

  

  const handleDeleteProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!profile.id) {
      setError("Impossible de supprimer : ID du profil introuvable.");
      return;
    }

    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer votre profil ?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/${profile.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profil supprimé avec succès.');
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Accès refusé. Vous n'avez pas les droits pour supprimer ce profil.");
      } else {
        setError("Erreur lors de la suppression du profil.");
      }
    }
  };
// (le haut reste exactement comme tu as déjà : imports, useState, useEffect, etc.)

return (
  <div className="form-wrapper">
    {loading ? <p>Chargement...</p> : (
      <form onSubmit={handleSubmit}>

        {/* Cover & Profile Pictures */}
        <div className="cover-photo-container">
          <div className="cover-photo-wrapper">
            {coverPhoto ? (
              <img src={coverPhoto} alt="Cover" className="cover-photo" />
            ) : (
              <div className="cover-photo-placeholder" />
            )}
            <label className="edit-cover-button">
              Modifier cover
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleCoverChange}
              />
            </label>
          </div>

          <div className="profile-picture-wrapper">
            <div className="profile-picture-container">
              <img src={profilePicture} alt="Profile" />
            </div>
            <label className="edit-profile-button">
              Modifier photo
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfilePictureChange}
              />
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Basic Infos */}
        <input type="text" name="headline" value={profile.headline} onChange={handleChangeProfileField} placeholder="Titre" required />
        <textarea name="summary" value={profile.summary} onChange={handleChangeProfileField} placeholder="Résumé" required />
        <input type="text" name="location" value={profile.location} onChange={handleChangeProfileField} placeholder="Localisation" />
        <input type="text" name="phone" value={profile.phone} onChange={handleChangeProfileField} placeholder="Téléphone" />

        {/* Certifications */}
        <h3>Certifications</h3>
        {profile.certifications.map((cert, idx) => (
          <div key={idx} className="array-item">
            <input type="text" name="name" value={cert.name} onChange={(e) => handleArrayChange('certifications', idx, e)} placeholder="Nom Certification" />
            <input type="text" name="issuedBy" value={cert.issuedBy} onChange={(e) => handleArrayChange('certifications', idx, e)} placeholder="Émis par" />
            <input type="date" name="issueDate" value={cert.issueDate} onChange={(e) => handleArrayChange('certifications', idx, e)} />
            <input type="text" name="url" value={cert.url} onChange={(e) => handleArrayChange('certifications', idx, e)} placeholder="Lien" />
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('certifications', { name: '', issuedBy: '', issueDate: '', url: '' })}>
          Ajouter Certification
        </button>

        {/* Educations */}
        <h3>Formations</h3>
        {profile.educations.map((edu, idx) => (
          <div key={idx} className="array-item">
            <input type="text" name="school" value={edu.school} onChange={(e) => handleArrayChange('educations', idx, e)} placeholder="École" />
            <input type="text" name="degree" value={edu.degree} onChange={(e) => handleArrayChange('educations', idx, e)} placeholder="Diplôme" />
            <input type="text" name="fieldOfStudy" value={edu.fieldOfStudy} onChange={(e) => handleArrayChange('educations', idx, e)} placeholder="Domaine" />
            <input type="date" name="startDate" value={edu.startDate} onChange={(e) => handleArrayChange('educations', idx, e)} />
            <input type="date" name="endDate" value={edu.endDate} onChange={(e) => handleArrayChange('educations', idx, e)} />
            <textarea name="description" value={edu.description} onChange={(e) => handleArrayChange('educations', idx, e)} placeholder="Description" />
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('educations', { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' })}>
          Ajouter Formation
        </button>

        {/* Experiences */}
        <h3>Expériences</h3>
        {profile.experiences.map((exp, idx) => (
          <div key={idx} className="array-item">
            <input type="text" name="title" value={exp.title} onChange={(e) => handleArrayChange('experiences', idx, e)} placeholder="Titre du poste" />
            <input type="text" name="company" value={exp.company} onChange={(e) => handleArrayChange('experiences', idx, e)} placeholder="Entreprise" />
            <input type="text" name="location" value={exp.location} onChange={(e) => handleArrayChange('experiences', idx, e)} placeholder="Localisation" />
            <input type="date" name="startDate" value={exp.startDate} onChange={(e) => handleArrayChange('experiences', idx, e)} />
            <input type="date" name="endDate" value={exp.endDate} onChange={(e) => handleArrayChange('experiences', idx, e)} />
            <textarea name="description" value={exp.description} onChange={(e) => handleArrayChange('experiences', idx, e)} placeholder="Description" />
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('experiences', { title: '', company: '', location: '', startDate: '', endDate: '', description: '' })}>
          Ajouter Expérience
        </button>

        {/* Skills */}
        <h3>Compétences</h3>
        {profile.skills.map((skill, idx) => (
          <div key={idx} className="array-item">
            <input
              type="text"
              name="name"
              value={skill.name}
              onChange={(e) => handleArrayChange('skills', idx, e)}
              placeholder="Nom de compétence"
            />
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('skills', { name: '' })}>
          Ajouter Compétence
        </button>

        {/* Upload CV et Lettre */}
        <h3>Documents</h3>
        <label>CV :</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setCvFile)} />

        <label>Lettre de motivation :</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setLetterFile)} />

        {/* Submit & Delete */}
        <div className="form-buttons">
          <button type="submit" className="save-button">Sauvegarder</button>
          {profileExists && (
            <button type="button" className="delete-button" onClick={handleDeleteProfile}>
              Supprimer Profil
            </button>
          )}
        </div>

      </form>
    )}
  </div>
);

};

export default StudentProfileEdit;
