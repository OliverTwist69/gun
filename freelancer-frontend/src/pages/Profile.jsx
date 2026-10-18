import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        skills: user.skills?.join(', ') || ''
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      uploadAvatar(file);
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('avatar', file);

      const response = await axios.post(`${API_URL}/auth/upload-avatar`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessage('Avatar uploaded successfully');
      setError('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload avatar');
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const profileData = {
        fullName: formData.fullName,
        bio: formData.bio,
        skills: skillsArray
      };

      const result = await updateProfile(profileData);

      if (result.success) {
        setMessage('Profile updated successfully');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="profile-container"><p>Please log in to view your profile</p></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-section">
            <img
              src={avatarPreview || 'https://via.placeholder.com/120'}
              alt={user.fullName}
              className="profile-avatar"
            />
            {isEditing && (
              <label htmlFor="avatar-input" className="avatar-upload-label">
                📷 Change Photo
              </label>
            )}
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
              disabled={!isEditing}
            />
          </div>

          <div className="profile-info">
            <h1>{user.fullName}</h1>
            <p className="username">@{user.username}</p>
            <p className="email">{user.email}</p>
            <p className="role">
              <span className={`role-badge role-${user.role}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </p>
          </div>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {!isEditing ? (
          <div className="profile-details">
            <div className="detail-item">
              <h3>Bio</h3>
              <p>{user.bio || 'No bio provided'}</p>
            </div>

            {user.role === 'freelancer' && (
              <>
                <div className="detail-item">
                  <h3>Skills</h3>
                  <div className="skills-list">
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))
                    ) : (
                      <p>No skills added yet</p>
                    )}
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-item">
                    <h4>Rating</h4>
                    <p className="stat-value">
                      {user.rating ? `${user.rating.toFixed(1)}⭐` : 'No rating yet'}
                    </p>
                  </div>
                  <div className="stat-item">
                    <h4>Completed Projects</h4>
                    <p className="stat-value">{user.completedProjects || 0}</p>
                  </div>
                  <div className="stat-item">
                    <h4>Balance</h4>
                    <p className="stat-value">${user.balance || 0}</p>
                  </div>
                </div>
              </>
            )}

            <div className="member-since">
              <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                maxLength={500}
                rows={4}
              />
              <small>{formData.bio.length}/500</small>
            </div>

            {user.role === 'freelancer' && (
              <div className="form-group">
                <label htmlFor="skills">Skills (comma separated)</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g. JavaScript, React, Node.js"
                />
                <small>Separate skills with commas</small>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    fullName: user.fullName || '',
                    bio: user.bio || '',
                    skills: user.skills?.join(', ') || ''
                  });
                  setAvatarPreview(user.avatar || '');
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
