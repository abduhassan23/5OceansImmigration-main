import React, { useState, useEffect, useRef} from 'react';
import MainLayout from '../app/mainlayout';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '@/app/firebase/config'; 
import { signOut } from 'firebase/auth';
import Image from 'next/image';
import editIconSrc from '@/public/edit.svg';
import { verifyBeforeUpdateEmail, reauthenticateWithCredential, EmailAuthProvider, updatePassword} from "firebase/auth";
import axios from 'axios';

const UserProfile = () => {
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [emailEditMode, setEmailEditMode] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordEditMode, setPasswordEditMode] = useState(false);

  // use ref so passwords are properly hidden in the input fields
   const currentPasswordRef = useRef(null);
   const newPasswordRef = useRef(null);
   const confirmNewPasswordRef = useRef(null);

  // Set up theme persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#ffffff';
      } else {
        setIsDarkMode(false);
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';
      }
    }
  }, []);

  // Fetch username on user state change
  useEffect(() => {
    if (user) {
      setOldEmail(user.email);
      axios
        .get(`/api/Username/${user.email}`)
        .then((response) => {
          setUsername(response.data.username);
        })
        .catch((error) => {
          console.error("Error fetching the username:", error);
        });
    }
  }, [user]);

  // Handler to initiate password edit mode
const handlePasswordEdit = () => {
  setPasswordEditMode(true);
};

// Handler to save the new password
const handlePasswordSave = async () => {
  if (newPassword !== confirmNewPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (newPassword.trim() === "") {
    alert("New password cannot be empty.");
    return;
  }

  if (currentPassword.trim() === "") {
    alert("Please enter your current password.");
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    alert("Password updated successfully.");
    setPasswordEditMode(false);
  } catch (error) {
    console.error("Error updating password:", error);
    alert(`Error: ${error.message}`);
  }
};


// Handler to cancel password edit mode
const handlePasswordCancel = () => {
  setPasswordEditMode(false);
  setNewPassword("");
  setConfirmNewPassword("");
};

  const handleEdit = () => {
    setEditMode(true);
    setNewUsername(username);
  };

  const handleCancel = () => {
    setEditMode(false);
    setNewUsername("");
  };

  // Function to save the new username to MongoDB API endpoint
  const handleSave = async () => {
    if (newUsername.trim() === "") {
      alert("Username cannot be empty.");
      return;
    }

    if (newUsername.length < 3 || newUsername.length > 20) {
      alert("Username must be between 3 and 20 characters.");
      return;
    }

    try {
      const response = await axios.patch(`/api/Username/${user.email}`, {
        newUsername: newUsername,
      });
      if (response.status === 200) {
        setUsername(newUsername);
        setEditMode(false);
      } else {
        alert(`Failed to update username: ${response.data.message}`);
      }
    } catch (error) {
      alert(`Error updating username: ${error.message}`);
    }
  };

  // Function to authenticate and save the new email to Firebase and MongoDB API endpoint
  const handleEmailSave = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user) {
      alert("No user is currently logged in.");
      return;
    }

    if (!emailRegex.test(newEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (newEmail === oldEmail) {
      alert("New email cannot be the same as the current email.");
      return;
    }

    if (password.trim() === "") {
      alert("Please enter your password.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await verifyBeforeUpdateEmail(user, newEmail);
      setVerificationSent(true);
      alert('Verification email sent to the new email address. Please verify your new email before we proceed.');

      await axios.patch(`/api/Updateemail/${oldEmail}`, {
        newEmail: newEmail,
      });

      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error("Error updating email or sending verification email:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === 'Enter') {
    handleEmailSave();
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter') {
    handlePasswordSave();
    }
  };

  const handleUserNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleEmailEdit = () => {
    setEmailEditMode(true);
    setNewEmail(user.email);
  };

  const handleEmailCancel = () => {
    setEmailEditMode(false);
    setNewEmail("");
    setPassword("");
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error.message}</p>;

  return (
    <MainLayout>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
          color: isDarkMode ? '#ffffff' : '#000000',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            width: '100%',
            padding: '2rem',
            borderRadius: '8px',
            backgroundColor: isDarkMode ? '#333333' : '#ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>User Profile</h1>
          {user ? (
            <div>
              {/* Email Section */}
              <div className="mb-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <strong style={{ width: '100px' }}>Email:</strong>
                  {emailEditMode ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        onKeyDown={handleEmailKeyDown}
                        style={{ border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`, padding: '0.5rem', borderRadius: '4px', width: '100%' }}
                      />
                      <input
                        type="password"
                        ref={currentPasswordRef}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleEmailKeyDown}
                        placeholder="Current password"
                        style={{ border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`, padding: '0.5rem', borderRadius: '4px', width: '100%' }}
                      />
                      <button
                        onClick={handleEmailCancel}
                        style={{
                          width: '100%',
                          backgroundColor: isDarkMode ? '#444444' : '#f5f5f5',
                          color: isDarkMode ? '#ffffff' : '#000000',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`,
                          marginTop: '0.5rem'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexGrow: 1 }}>
                      <span>{user.email}</span>
                      <button onClick={emailEditMode ? (verificationSent ? handleEmailSave : handleEmailSave) : handleEmailEdit} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Image
                          src={editIconSrc}
                          alt="Edit"
                          width={24}
                          height={24}
                          style={{
                            filter: isDarkMode ? 'invert(1)' : 'invert(0)',
                          }}
                        />
                      </button>
                    </div>
                  )}
                </div>
                {verificationSent && !user.emailVerified && (
                  <p className="text-center text-gray-600">Verification email sent. Please check your inbox to verify your new email.</p>
                )}
              </div>
  
              {/* Username Section */}
              <div className="mb-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <strong style={{ width: '100px' }}>Username:</strong>
                  {editMode ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        onKeyDown={handleUserNameKeyDown}
                        style={{ border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`, padding: '0.5rem', borderRadius: '4px', width: '100%' }}
                      />
                      <button
                        onClick={handleCancel}
                        style={{
                          width: '100%',
                          backgroundColor: isDarkMode ? '#444444' : '#f5f5f5',
                          color: isDarkMode ? '#ffffff' : '#000000',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`,
                          marginTop: '0.5rem'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexGrow: 1 }}>
                      <span>{username}</span>
                      <button onClick={handleEdit} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Image
                          src={editIconSrc}
                          alt="Edit"
                          width={24}
                          height={24}
                          style={{
                            filter: isDarkMode ? 'invert(1)' : 'invert(0)',
                          }}
                        />
                      </button>
                    </div>
                  )}
                </div>
                {username === "" && !verificationSent && (
                  <p
                    className="text-center"
                    style={{
                      color: isDarkMode ? '#FFFFFF' : '#666666', 
                      fontSize: '0.875rem', 
                      marginTop: '1rem', 
                    }}
                  >
                    Verification email sent. Please verify your new email to complete the profile change from <strong>{oldEmail}</strong> to your new email address.

                  </p>
                )}
              </div>

              {/* Password Section */}
              <div className="mb-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <strong style={{ width: '100px' }}>Password:</strong>
                {passwordEditMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                      <input
                      type="password"
                      ref={currentPasswordRef}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      style={{ border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`, padding: '0.5rem', borderRadius: '4px', width: '100%' }}
                    />
                    <input
                      type="password"
                      ref ={newPasswordRef}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      style={{ border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`, padding: '0.5rem', borderRadius: '4px', width: '100%' }}
                    />
                    <input
                      type="password"
                      ref ={confirmNewPasswordRef}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      style={{ border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`, padding: '0.5rem', borderRadius: '4px', width: '100%' }}
                      onKeyDown={handlePasswordKeyDown}
                    />
                    <button
                      onClick={handlePasswordSave}
                      style={{
                        width: '100%',
                        backgroundColor: isDarkMode ? '#444444' : '#f5f5f5',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`,
                        marginTop: '0.5rem'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handlePasswordCancel}
                      style={{
                        width: '100%',
                        backgroundColor: isDarkMode ? '#444444' : '#f5f5f5',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`,
                        marginTop: '0.5rem'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handlePasswordEdit}
                    style={{
                      backgroundColor: isDarkMode ? '#444444' : '#f5f5f5',
                      color: isDarkMode ? '#ffffff' : '#000000',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`,
                      width: '300px',
                    }}
                  >
                    Change Password
                  </button>
                )}
              </div>
            </div>

              {/* Sign out Button */}
              <div className="text-center mt-4">
                <button
                  onClick={() => signOut(auth)}
                  style={{
                    backgroundColor: isDarkMode ? '#444444' : '#f5f5f5',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: `1px solid ${isDarkMode ? '#666' : '#ccc'}`,
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No user is logged in.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
  
};

export default UserProfile;