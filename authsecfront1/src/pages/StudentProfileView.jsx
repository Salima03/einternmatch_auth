// src/pages/StudentProfileView.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1217/api/v1/profiles';
const DEFAULT_PROFILE_PICTURE = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const DEFAULT_COVER_PHOTO = "https://via.placeholder.com/1200x300.png?text=Cover+Photo";

const StudentProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(DEFAULT_PROFILE_PICTURE);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(DEFAULT_COVER_PHOTO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch profile data
        const profileResponse = await axios.get(`${API_BASE_URL}/my-profile`, { headers });
        const userProfile = profileResponse.data;
        setProfile(userProfile);

        // Fetch profile picture
        try {
          const pictureResponse = await axios.get(`${API_BASE_URL}/profile-picture`, {
            headers,
            responseType: 'blob',
          });
          const imageUrl = URL.createObjectURL(pictureResponse.data);
          setProfilePictureUrl(imageUrl);
        } catch {
          setProfilePictureUrl(DEFAULT_PROFILE_PICTURE);
        }

        // Fetch cover photo
        try {
          const coverResponse = await axios.get(`${API_BASE_URL}/cover-photo`, {
            headers,
            responseType: 'blob',
          });
          const coverUrl = URL.createObjectURL(coverResponse.data);
          setCoverPhotoUrl(coverUrl);
        } catch {
          setCoverPhotoUrl(DEFAULT_COVER_PHOTO);
        }

      } catch (profileError) {
        setError("Impossible de charger votre profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>Aucun profil trouvé.</p>;

  return (
    <div style={{ backgroundColor: "#eee", padding: "20px" }}>
      {/* Cover photo */}
      <div style={{
        backgroundColor: "#ccc",
        height: "200px",
        position: "relative",
        borderRadius: "10px",
        marginBottom: "80px",
        overflow: "hidden"
      }}>
        <img
          src={coverPhotoUrl}
          alt="Cover"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
        {/* Profile picture */}
        <img
          src={profilePictureUrl}
          alt="Profile"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "50%",
            border: "4px solid white",
            position: "absolute",
            top: "140px",
            left: "30px",
            backgroundColor: "#fff"
          }}
        />
      </div>

      {/* Name and Contacts */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ marginLeft: "30px" }}>
          <h2>{profile.firstName} {profile.lastName}</h2>
        </div>
        <div style={{ marginRight: "30px" }}>
          <button onClick={() => setShowContacts(!showContacts)} style={{
            padding: "8px 12px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            cursor: "pointer"
          }}>
            Contacts
          </button>
          {showContacts && (
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <p><strong>Téléphone:</strong> {profile.phone}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Localisation:</strong> {profile.location}</p>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      <div style={{ background: "white", padding: "20px", borderRadius: "10px", margin: "20px" }}>
        <h3>About</h3>
        <p>{profile.summary}</p>
      </div>

      {/* Experiences */}
      <div style={{ margin: "20px" }}>
        <h3>Experiences</h3>
        {profile.experiences?.map((exp, index) => (
          <div key={index} style={{
            background: "#fdfdfd",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "10px"
          }}>
            <p><strong>{exp.title}</strong> | {exp.startDate} - {exp.endDate}</p>
            <p>{exp.location}</p>
            <p>{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div style={{ margin: "20px" }}>
        <h3>Formations</h3>
        {profile.educations?.map((edu, index) => (
          <div key={index} style={{
            background: "#fdfdfd",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "10px"
          }}>
            <p><strong>{edu.degree}</strong> | {edu.startDate} - {edu.endDate}</p>
            <p>{edu.fieldOfStudy} - {edu.school}</p>
            <p>{edu.description}</p>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div style={{ background: "white", padding: "20px", borderRadius: "10px", margin: "20px" }}>
        <h3>Skills</h3>
        <ul>
          {profile.skills?.map((skill, index) => (
            <li key={index}>{skill.name}</li>
          ))}
        </ul>
      </div>

      {/* Certifications */}
      <div style={{ margin: "20px" }}>
        <h3>Certifications</h3>
        {profile.certifications?.map((cert, index) => (
          <div key={index} style={{
            background: "#fdfdfd",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "10px"
          }}>
            <p><strong>{cert.name}</strong> | {cert.issueDate}</p>
            <p>{cert.issuedBy}</p>
            {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer">Voir certification</a>}
          </div>
        ))}
      </div>

      {/* Modify Button */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={() => navigate(`/profile/edit/${profile.id}`)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#5c9ead",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Modify
        </button>
      </div>
    </div>
  );
};

export default StudentProfileView;
