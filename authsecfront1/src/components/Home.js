// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1217/api/v1/profiles';
const DEFAULT_PROFILE_PICTURE = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(DEFAULT_PROFILE_PICTURE);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const profileResponse = await axios.get(`${API_BASE_URL}/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userProfile = profileResponse.data;
        setProfile(userProfile);

        // récupérer la photo de profil en utilisant l'ID de l'utilisateur
        if (userProfile && userProfile.id) {
          try {
            const pictureResponse = await axios.get(`${API_BASE_URL}/profile-picture`, {  // <<< sans ID ici !
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob',
            });
            const imageUrl = URL.createObjectURL(pictureResponse.data);
            setProfilePictureUrl(imageUrl);
          } catch (error) {
            console.warn("Aucune photo trouvée, utilisation image par défaut.");
            setProfilePictureUrl(DEFAULT_PROFILE_PICTURE);
          }
          
        }
      } catch (error) {
        console.error("Erreur de chargement du profil:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  const handleImageClick = () => {
    if (profile) {
      navigate("/profile/view");
    } else {
      navigate("/profile/create");
    }
  };

  return (
    <div className="home-page" style={{ textAlign: 'center', marginTop: '50px' }}>
      <div onClick={handleImageClick} style={{ cursor: "pointer" }}>
        <img
          src={profilePictureUrl}
          alt="Avatar utilisateur"
          style={{
            borderRadius: "50%",
            width: "150px",
            height: "150px",
            objectFit: "cover",
            border: "2px solid #ccc"
          }}
        />
      </div>

      {profile ? (
        <h2>Bienvenue, voici votre profil !</h2>
      ) : (
        <div>
          <h2>Vous n'avez pas encore de profil</h2>
          <button onClick={() => navigate("/profile/create")} style={{ marginTop: "20px" }}>
            Créer mon profil
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
