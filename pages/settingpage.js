import React, { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '@/app/firebase/config';
import { getAuth } from 'firebase/auth'; 
import { signOut, deleteUser } from 'firebase/auth';
import Image from 'next/image';
import { FaUser, FaLock, FaBell, FaCog, FaPalette } from 'react-icons/fa';
import editIconSrc from '@/public/edit.svg';
import { verifyBeforeUpdateEmail, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import axios from 'axios';
import RootLayout from '@/app/mainlayout';
import {useRouter} from 'next/router';

const SettingsPage = () => {
  const [currentSection, setCurrentSection] = useState('profile');
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [emailEditMode, setEmailEditMode] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Add error state
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const router = useRouter();

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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
      const response = await axios.patch(`/api/Username/${user.email}`, { newUsername });
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

  const handleEmailSave = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user || !emailRegex.test(newEmail) || newEmail === oldEmail) {
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
      await axios.patch(`/api/Updateemail/${oldEmail}`, { newEmail });
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error("Error updating email or sending verification email:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handlePasswordSave = async () => {
    if (newPassword !== confirmNewPassword || currentPassword.trim() === "") {
      alert("Passwords do not match or invalid current password.");
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

  const handleDeleteAccount = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return; // Return early to show confirmation
    }
  
    try {
      const user = auth.currentUser;
  
      if (user) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
  
        // Delete the Firebase user
        await user.delete();
        console.log("User deleted successfully from Firebase Authentication");
  
        // After deleting the Firebase user, proceed to delete from MongoDB
        const response = await fetch(`/api/Users/${user.uid}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        // Check if MongoDB deletion was successful
        if (response.ok) {
          console.log("User deleted successfully from MongoDB");
          
          // Now push to homepage only after everything is done
          router.push('/homepage');
        } else {
          console.error("Error deleting user from MongoDB:", await response.json());
        }
      } else {
        console.log("No user is currently signed in.");
      }
    } catch (error) {
      console.error("Error deleting user from Firebase:", error);
    }
  };
  
  
  
  const renderProfileSection = () => (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
      <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
      <div className="flex items-center mb-4">
        <strong className="w-28 text-gray-700 dark:text-gray-300">Email:</strong>
        <span className="flex-grow">{user?.email}</span>
        <button onClick={() => setEmailEditMode(true)} className="ml-2">
          <Image 
          src={editIconSrc} 
          alt="Edit" 
          width={20} 
          height={20} 
          style={{
            filter: isDarkMode ? 'invert(1)' : 'invert(0)',
          }}
          />
        </button>
      </div>

      {emailEditMode && (
        <div className="flex flex-col mb-4">
          <input
            type="email"
            className="border rounded-md p-2 mb-2 dark:bg-gray-900 dark:text-white"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New Email"
          />
          <input
            type="password"
            className="border rounded-md p-2 mb-2 dark:bg-gray-900 dark:text-white"
            placeholder="Current Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleEmailSave} className="bg-black dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 w-full">Save Email</button>
        </div>
      )}

      <div className="flex items-center mb-4">
        <strong className="w-28 text-gray-700 dark:text-gray-300">Username:</strong>
        <span className="flex-grow">{username}</span>
        <button onClick={() => setEditMode(true)} className="ml-2">
          <Image 
          src={editIconSrc} 
          alt="Edit" width={20} 
          height={20} 
          style={{
            filter: isDarkMode ? 'invert(1)' : 'invert(0)',
          }}
          />
        </button>
      </div>

      {editMode && (
        <div className="flex flex-col mb-4">
          <input
            type="text"
            className="border rounded-md p-2 mb-2 dark:bg-gray-900 dark:text-white"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="New Username"
          />
          <button onClick={handleSave} className="bg-black dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 w-full">Save Username</button>
        </div>
      )}

      <div className="flex items-center mb-4">
        <strong className="w-28 text-gray-700 dark:text-gray-300">Password:</strong>
        <button onClick={() => setPasswordEditMode(true)} className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Change Password</button>
      </div>

      {passwordEditMode && (
        <div className="flex flex-col mb-4">
          <input
            type="password"
            className="border rounded-md p-2 mb-2 dark:bg-gray-900 dark:text-white"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            className="border rounded-md p-2 mb-2 dark:bg-gray-900 dark:text-white"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="border rounded-md p-2 mb-2 dark:bg-gray-900 dark:text-white"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button onClick={handlePasswordSave} className="bg-black dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 w-full">Save Password</button>
        </div>
      )}

      <div className="text-center mt-6">
        <button onClick={() => signOut(auth)} className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Sign Out</button>
      </div>
    </div>
  );

  const renderAccountDetailsSection = () => (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-all duration-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">Account Details</h1>
      
      {/* Personal Information Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Personal Information</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Update your personal details such as first name, last name, phone number, and date of birth.
        </p>
        <div className="flex items-center mb-4">
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded-md p-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="First Name"
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded-md p-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Last Name"
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded-md p-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Phone Number"
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="date"
            className="border border-gray-300 dark:border-gray-600 rounded-md p-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Date of Birth"
          />
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-500 transition-all duration-300">
          Save Changes
        </button>
      </div>
  
      {/* Security Settings Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Security Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Enhance your account security by enabling two-factor authentication.
        </p>
        <div className="flex items-center mb-4">
          <input type="checkbox" className="mr-2" id="enable2FA" />
          <label htmlFor="enable2FA" className="text-gray-800 dark:text-gray-200">Enable Two-Factor Authentication</label>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          <button className="underline text-blue-600 dark:text-blue-400">View active sessions</button>
        </p>
      </div>
  
      {/* Account Status Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Account Status</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Account created on: <span className="font-medium">{user?.metadata.creationTime}</span>
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Account status: <span className="font-medium">Active</span>
        </p>
      </div>
  
    {/* Warning and Account Deletion Section */}
    <div className="bg-red-100 dark:bg-red-800 p-5 rounded-lg shadow-md mb-8 border-l-4 border-red-500 dark:border-red-600">
      <h2 className="text-xl font-bold text-red-700 dark:text-red-300">Warning</h2>
      <p className="text-red-600 dark:text-red-400">
        Deleting your account will remove all of your personal information and submitted applications. This action cannot be undone (Please enter your password to confirm account deletion).
      </p>
    </div>
    {isConfirmingDelete ? (
      <>
        <input
          type="password"
          className="border border-gray-300 dark:border-gray-600 rounded-md p-3 mb-4 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          placeholder="Current Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update the password state
        />
        <div className="flex justify-between">
          <button
            onClick={() => setIsConfirmingDelete(false)} // Cancel confirmation
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 w-full"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 w-full"
          >
            Confirm Delete
          </button>
        </div>
      </>
    ) : (
      <button
        onClick={() => setIsConfirmingDelete(true)} // Initiate confirmation
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 w-full"
      >
        Delete Account
      </button>
    )}
  </div>
);
  
  

  const renderPrivacySection = () => (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-all duration-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">Privacy Settings</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Manage your privacy settings and data sharing preferences.
      </p>
      <label className="flex items-center mb-4">
        <input type="checkbox" className="mr-2" />
        <span>Enable data sharing with trusted partners.</span>
      </label>
      <label className="flex items-center mb-4">
        <input type="checkbox" className="mr-2" />
        <span>Allow email-based account recovery.</span>
      </label>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-all duration-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">Notification Settings</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Choose which types of notifications you&apos;d like to receive.
      </p>
      <label className="flex items-center mb-4">
        <input type="checkbox" className="mr-2" />
        <span>Receive email notifications.</span>
      </label>
      <label className="flex items-center mb-4">
        <input type="checkbox" className="mr-2" />
        <span>Get SMS alerts for important updates.</span>
      </label>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-all duration-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">Preferences</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Adjust your user preferences.
      </p>
      <div className="mt-4 text-center">
        <button
          onClick={toggleTheme}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition-all duration-300"
        >
          Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>
    </div>
  );

  return (
    <RootLayout>
      <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        <aside className={`w-1/4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} p-6`}>
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setCurrentSection('profile')}
                className={`flex items-center py-2 px-4 rounded transition duration-300 w-full text-left ${
                  currentSection === 'profile' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-400') : 'hover:bg-gray-300'
                }`}
              >
                <FaUser className="mr-2" /> Profile Information
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentSection('accountDetails')}
                className={`flex items-center py-2 px-4 rounded transition duration-300 w-full text-left ${
                  currentSection === 'accountDetails' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-400') : 'hover:bg-gray-300'
                }`}
              >
                <FaLock className="mr-2" /> Account
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentSection('privacy')}
                className={`flex items-center py-2 px-4 rounded transition duration-300 w-full text-left ${
                  currentSection === 'privacy' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-400') : 'hover:bg-gray-300'
                }`}
              >
                <FaCog className="mr-2" /> Privacy Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentSection('notifications')}
                className={`flex items-center py-2 px-4 rounded transition duration-300 w-full text-left ${
                  currentSection === 'notifications' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-400') : 'hover:bg-gray-300'
                }`}
              >
                <FaBell className="mr-2" /> Notification Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentSection('preferences')}
                className={`flex items-center py-2 px-4 rounded transition duration-300 w-full text-left ${
                  currentSection === 'preferences' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-400') : 'hover:bg-gray-300'
                }`}
              >
                <FaPalette className="mr-2" /> User Preferences
              </button>
            </li>
          </ul>
        </aside>
        <main className="flex-1 p-8">
          {currentSection === 'profile' && renderProfileSection()}
          {currentSection === 'accountDetails' && renderAccountDetailsSection()}
          {currentSection === 'privacy' && renderPrivacySection()}
          {currentSection === 'notifications' && renderNotificationsSection()}
          {currentSection === 'preferences' && renderPreferencesSection()}
        </main>
      </div>
    </RootLayout>
  );
};

export default SettingsPage;
