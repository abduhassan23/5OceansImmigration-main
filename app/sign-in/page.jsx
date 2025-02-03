'use client'; 
//Ai Assisted import
import { PhoneAuthProvider, multiFactor, signInWithEmailAndPassword, RecaptchaVerifier } from "firebase/auth";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSignInWithEmailAndPassword, useSendPasswordResetEmail } from 'react-firebase-hooks/auth'; 
import { auth } from '@/app/firebase/config';
import dynamic from 'next/dynamic';
import '../styles/signup.css';

const SignIn = () => {
  const router = useRouter();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [signInWithEmailAndPassword, userCredential, loading, error] = useSignInWithEmailAndPassword(auth);
  const [sendPasswordResetEmail, sending, resetError] = useSendPasswordResetEmail(auth); 
  const [errorMessage, setErrorMessage] = useState('');
  const [isClient, setIsClient] = useState(false);

  //AI assisted: State for user authentication info
  const [authState, setAuthState] = useState({
    access: null,
    refresh: null,
    isAuthenticated: null,
    user: null
  });

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setAuthState({
        access: localStorage.getItem('access'),
        refresh: localStorage.getItem('refresh'),
        isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
        user: JSON.parse(localStorage.getItem('user')),
      });

      const storedTheme = localStorage.getItem('theme') || 'light';
      document.body.classList.toggle('dark-theme', storedTheme === 'dark');
      document.body.classList.toggle('light-theme', storedTheme === 'light');
    }
  }, []);

  useEffect(() => {
    const checkUserDetails = async (email) => {
      try {
        const response = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (data.isAdmin) {
          router.push('/adminpage');
        } else {
          router.push('/homepage');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        router.push('/homepage');
      }
    };

    if (userCredential) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', 'true');
      }
      checkUserDetails(userCredential.user.email);
    }

    //AI assisted: Error handling for firebase auth
    if (error) {
      const getErrorMessage = (errorCode) => {
        switch (errorCode) {
          case 'auth/invalid-email':
            return 'Invalid email address.';
          case 'auth/user-not-found':
            return 'No user found with this email.';
          case 'auth/wrong-password':
            return 'Incorrect Password.';
          case 'auth/invalid-credential':
            return 'Incorrect Email or Password.';
          case 'auth/user-disabled':
            return 'User account is disabled.';
          case 'auth/operation-not-allowed':
            return 'Operation not allowed.';
          case 'auth/too-many-requests': 
            return 'Too many failed login attempts. Your account is temporarily locked. Please try again later.';
          case 'auth/multi-factor-auth-required':
            return 'Multi-factor authentication required. Please check your phone for a verification code.';

          default:
            return 'Sign-in failed. Please try again.';
        }
      };

      const message = getErrorMessage(error.code);
      setErrorMessage(message);
    }
  }, [userCredential, error, router]);

  const handleSignIn = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
  
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(email.toLowerCase(), password);
  
      const user = userCredential.user;
  
      //AI assisted: Check if MFA is enabled for the user
      if (multiFactor(user).enrolledFactors.length > 0) {
    
        handleMultiFactorAuthentication(user);
      } else {
       //Proceed to homepage if MFA is not required
        router.push('/homepage');
      }
    } catch (error) {
      setErrorMessage(setErrorMessage(error.code));
    }
  };

  const handleMultiFactorAuthentication = async (user) => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, proceed with MFA
          onSolvedRecaptcha();
        },
      }, auth);


      recaptchaVerifier.render();
  
      // Get the phone factor
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const session = await multiFactor(user).getSession();
      const phoneInfoOptions = {
        phoneNumber: user.phoneNumber, 
        session,
      };
  
      //AI assisted 
      //Sends the verification code
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
      const verificationCode = prompt('Enter the verification code you received via SMS:');
  
      // Complete the sign-in with the verification code
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      await multiFactor(user).enroll(cred);
  
      router.push('/homepage');
    } catch (error) {
      setErrorMessage('Failed to complete multi-factor authentication.');
    }
  };
  


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSignIn();
    }
  };

  const handleAnonymousAccess = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user', 'true');
    }
    router.push('/homepage');
  };

  const handlePasswordReset = async () => {
    const email = emailRef.current.value;

    if (!email) {
      setErrorMessage('Please enter your email to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(email.toLowerCase());
      setErrorMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      setErrorMessage('Failed to send password reset email.');
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`theme-container min-h-screen`}>
      <div className="bg-white h-20 flex p-4 mb-2">
        <div className='mr-5'>
          <Image src="/logo.svg" alt="Logo" width={250} height={100} />
        </div>
        <div className="text-black flex text-center text-4xl mt-1 ml-2"></div>
      </div>

      <div className="bg-black h-2 flex justify-center items-center mb-10"></div>

      <div className="flex items-center justify-center h-5/6">
        <div className="signin-div p-10 rounded-lg shadow-xl border-2 border-gray-800 border-opacity-10 w-96">
          <h1 className="text-3xl mb-5">Sign In</h1>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            onKeyDown={handleKeyDown}
            className="w-full p-3 mb-4 rounded outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            ref={passwordRef}
            onKeyDown={handleKeyDown}
            className="w-full p-3 mb-4 rounded outline-none"
          />
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            {/* Recaptcha container */}
          <div id="recaptcha-container"></div> 


          <button
            onClick={handleSignIn}
            className="w-full p-3 rounded"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <button
            onClick={() => router.push('/sign-up')}
            className="w-full p-3 mt-2 rounded"
          >
            Don&apos;t have an account? Sign Up
          </button>
          <button
            onClick={handleAnonymousAccess}
            className="w-full p-3 mt-2 rounded"
          >
            Continue as a Guest
          </button>
          <button
            onClick={handlePasswordReset}
            className="w-full p-3 mt-4 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
