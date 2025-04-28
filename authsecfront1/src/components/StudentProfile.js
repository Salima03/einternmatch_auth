// StudentProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1217/api/v1/profiles';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    id: null,
    headline: '',
    summary: '',
    location: '',
    phone: '',
    profilePictureUrl: '',
    coverPictureUrl: '',
    certifications: [],
    educations: [],
    experiences: [],
    skills: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileExists, setProfileExists] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Token manquant, utilisateur non authentifié");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = response.data;
      if (profileData) {
        setProfile(profileData);
        setProfileExists(true); // Profil existe
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('Aucun profil existant, prêt pour création');
        setProfileExists(false); // Profil n'existe pas
        setProfile({
          id: null,
          headline: '',
          summary: '',
          location: '',
          phone: '',
          profilePictureUrl: '',
          coverPictureUrl: '',
          certifications: [],
          educations: [],
          experiences: [],
          skills: [],
        });
      } else {
        setError('Erreur lors du chargement du profil.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChangeProfileField = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeSection = (e, section, id) => {
    const { name, value } = e.target;
    setProfile(prev => {
      const updatedSection = prev[section].map(item =>
        item.id === id ? { ...item, [name]: value } : item
      );
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleAddItem = (section) => {
    const newItem = {
      id: null,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      degree: '',
      school: '',
      fieldOfStudy: '',
      name: '',
      issuingOrganization: '',
      skillName: '',
    };
    setProfile(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const profileData = {
      headline: profile.headline,
      summary: profile.summary,
      location: profile.location,
      phone: profile.phone,
      certifications: profile.certifications,
      educations: profile.educations,
      experiences: profile.experiences,
      skills: profile.skills,
    };

    try {
      if (profileExists && profile.id) {
        await axios.put(`${API_BASE_URL}/${profile.id}`, profileData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Profil mis à jour avec succès !');
      } else {
        const response = await axios.post(`${API_BASE_URL}`, profileData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Profil créé avec succès !');
        setProfile(response.data);
        setProfileExists(true); // Maintenant le profil existe
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setError('Erreur lors de la création/mise à jour du profil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          {!profileExists ? (
            <div>
              <h1>Créer votre profil</h1>
              <p>Vous n'avez pas encore de profil. Remplissez le formulaire ci-dessous pour en créer un :</p>
            </div>
          ) : (
            <h1>Modifier votre profil</h1>
          )}

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Informations générales */}
            <input
              type="text"
              name="headline"
              value={profile.headline}
              onChange={handleChangeProfileField}
              placeholder="Titre"
              required
            />
            <textarea
              name="summary"
              value={profile.summary}
              onChange={handleChangeProfileField}
              placeholder="Résumé"
              required
            />
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChangeProfileField}
              placeholder="Localisation"
            />
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChangeProfileField}
              placeholder="Téléphone"
            />

            {/* Formations */}
            <div>
              <h3>Formations</h3>
              {profile.educations.map((edu, idx) => (
                <div key={idx}>
                  <input
                    type="text"
                    name="degree"
                    value={edu.degree}
                    onChange={(e) => handleChangeSection(e, 'educations', edu.id)}
                    placeholder="Diplôme"
                  />
                  <input
                    type="text"
                    name="school"
                    value={edu.school}
                    onChange={(e) => handleChangeSection(e, 'educations', edu.id)}
                    placeholder="École"
                  />
                </div>
              ))}
              <button type="button" onClick={() => handleAddItem('educations')}>
                Ajouter une formation
              </button>
            </div>

            {/* Certifications */}
            <div>
              <h3>Certifications</h3>
              {profile.certifications.map((cert, idx) => (
                <div key={idx}>
                  <input
                    type="text"
                    name="name"
                    value={cert.name}
                    onChange={(e) => handleChangeSection(e, 'certifications', cert.id)}
                    placeholder="Nom de certification"
                  />
                  <input
                    type="text"
                    name="issuingOrganization"
                    value={cert.issuingOrganization}
                    onChange={(e) => handleChangeSection(e, 'certifications', cert.id)}
                    placeholder="Organisme"
                  />
                </div>
              ))}
              <button type="button" onClick={() => handleAddItem('certifications')}>
                Ajouter une certification
              </button>
            </div>

            {/* Expériences */}
            <div>
              <h3>Expériences</h3>
              {profile.experiences.map((exp, idx) => (
                <div key={idx}>
                  <input
                    type="text"
                    name="title"
                    value={exp.title}
                    onChange={(e) => handleChangeSection(e, 'experiences', exp.id)}
                    placeholder="Poste"
                  />
                  <input
                    type="text"
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleChangeSection(e, 'experiences', exp.id)}
                    placeholder="Entreprise"
                  />
                </div>
              ))}
              <button type="button" onClick={() => handleAddItem('experiences')}>
                Ajouter une expérience
              </button>
            </div>

            {/* Compétences */}
            <div>
              <h3>Compétences</h3>
              {profile.skills.map((skill, idx) => (
                <div key={idx}>
                  <input
                    type="text"
                    name="name"
                    value={skill.name}
                    onChange={(e) => handleChangeSection(e, 'skills', skill.id)}
                    placeholder="Compétence"
                  />
                </div>
              ))}
              <button type="button" onClick={() => handleAddItem('skills')}>
                Ajouter une compétence
              </button>
            </div>

            {/* Submit */}
            <button type="submit">
              {profileExists ? "Mettre à jour" : "Créer"} le profil
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default StudentProfile;
