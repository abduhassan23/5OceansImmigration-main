'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import axios from 'axios';
import '../styles/signup.css';

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [username, setUsername] = useState(''); 
  const [createUserWithEmailAndPassword, userCredential, loading, errorFromFirebase] = useCreateUserWithEmailAndPassword(auth);
  const [errorMessage, setErrorMessage] = useState('');

  // Regular expression for validating email format
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|ca|gov|edu)$/;

  // State for theme management
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check theme on load
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(storedTheme === 'dark');
    document.body.classList.toggle('dark-theme', storedTheme === 'dark');
  }, []);

  useEffect(() => {
    if (userCredential) {
      axios.post('/api/Users', { 
        name: username, 
        email: email.toLowerCase(),
        firebaseUID: userCredential.user.uid,
       })
        .then(() => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('user', 'true');
          }
          setEmail('');
          setPassword('');
          setConfirmPassword(''); // Clear confirm password
          setUsername('');
          router.push('/homepage');
        })
        .catch(error => {
          console.error('Error saving user data:', error);
          setErrorMessage('Failed to save user data.');
        });
    }

    if (errorFromFirebase) {
      setErrorMessage(`Sign-up failed: ${errorFromFirebase.message}`);
    }
  }, [userCredential, errorFromFirebase, router, username, email]);

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword || !username) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (!emailPattern.test(email)) {
      setErrorMessage('Invalid email address.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    createUserWithEmailAndPassword(email.toLowerCase(), password);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSignUp();
    }
  };

  const handleAnonymousAccess = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user', 'true');
    }
    router.push('/homepage');
  };

  return (
    <div className={`theme-container min-h-screen relative`}>
      <div className="bg-white h-20 flex p-4 mb-2">
        <div className='mr-5'>
          <Image src="/logo.svg" alt="Logo" width={250} height={100} />
        </div>
      </div>
      <div className="bg-black h-2 flex justify-center items-center mb-10"></div>
      <div className="flex items-center justify-center h-5/6">
        <div className="signup-div p-10 rounded-lg shadow-xl w-96 border-2 border-gray-800 border-opacity-10">
          <h1 className="text-3xl mb-5">Sign Up</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 mb-4 rounded outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 mb-4 rounded outline-none"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 mb-4 rounded outline-none"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 mb-4 rounded outline-none"
          />
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <button
            onClick={handleSignUp}
            className="w-full p-3 rounded"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <button
            onClick={() => router.push('/sign-in')}
            className="w-full p-3 mt-2 rounded"
          >
            Already have an account? Sign In
          </button>
          <button
            onClick={handleAnonymousAccess}
            className="w-full p-3 mt-2 rounded"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;