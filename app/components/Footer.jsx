import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { getAuth, signOut } from 'firebase/auth';

const Footer = () => {
  const auth = getAuth(); 
  const [user, loading] = useAuthState(auth); 
  const router = useRouter(); 

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      router.push('/sign-in'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) return <p>Loading...</p>; 

  return (
    <footer className="bg-primary-blue text-white py-10 mt-auto">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="flex items-center mb-6 lg:mb-0">
            <Image src="/logo2.svg" alt="Logo" width={150} height={150} />
            <h1 className="ml-4 text-lg font-semibold">5 Oceans Immigration</h1>
          </div>
          <nav className="flex flex-wrap space-x-4 text-sm items-center">
            <Link href="/" className="hover:text-gold">Home</Link>
            <Link href="/servicespage" className="hover:text-gold">Services</Link>
            <Link href="/communitypage" className="hover:text-gold">Community</Link>
            <Link href="/aboutpage" className="hover:text-gold">About Us</Link>
            <Link href="/uploadpage" className="hover:text-gold">Upload Files</Link>
            <Link href="/contactpage" className="hover:text-gold">Contact</Link>
            <button 
              onClick={user ? handleLogout : () => router.push('/sign-in')} 
              className="text-white px-4 py-2 rounded bg-opacity-70"
              style={{ marginLeft: 'auto' }}
            >
              {user ? 'Logout' : 'Login'}
            </button>
          </nav>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h2 className="text-md font-semibold mb-4">Sign up for updates</h2>
            <form className="flex">
              <input
                type="email"
                placeholder="Your Email"
                className="p-1 rounded-l-md text-black text-sm"
              />
              <button type="submit" className="p-1 bg-gold text-black rounded-r-md text-sm">
                Send Now
              </button>
            </form>
          </div>
          <div className="md:pl-6">
            <h2 className="text-md font-semibold mb-4">Our Location</h2>
            <p>Calgary, Alberta</p>
            <p>Canada</p>
            <p>+1 403-618-6518</p>
          </div>
          <div>
            <h2 className="text-md font-semibold mb-4 text-center">Follow Us</h2>
            <div className="flex justify-center space-x-4 items-center">
              <Link href="https://m.facebook.com/100083107693321/">
                <Image src="/facebook.webp" alt="Facebook" width={31} height={35} />
              </Link>
              <Link href="https://www.twitter.com">
                <Image src="/twitter.webp" alt="Twitter" width={39} height={40} />
              </Link>
              <Link href="https://www.instagram.com/5oceans.i/">
                <Image src="/instagram.webp" alt="Instagram" width={30} height={25} />
              </Link>
            </div>
          </div>
          <div>
            <h2 className="text-md font-semibold mb-4">Quick Links</h2>
            <nav className="flex flex-col space-y-1 text-sm">
              <Link href="/homepage" className="hover:text-gold">Home</Link>
              <Link href="/servicespage" className="hover:text-gold">Services</Link>
              <Link href="/community" className="hover:text-gold">Community</Link>
              <Link href="/aboutpage" className="hover:text-gold">About Us</Link>
              <Link href="/uploadpage" className="hover:text-gold">Upload Files</Link>
              <Link href="/contactpage" className="hover:text-gold">Contact</Link>
              <Link href="/contactpage#faq-section" className="hover:text-gold">Frequently Asked Questions (FAQ)</Link>
            </nav>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {new Date().getFullYear()} 5 Oceans Immigration. All rights reserved.</p>
            <p></p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .bg-primary-blue {
          background-color: #1a1a1a;
        }
        .hover:text-gold {
          color: #ffcc00;
        }
        .hover:text-gold:hover {
          color: #ffc700;
        }
        .bg-gold {
          background-color: #ffcc00;
        }
        form input {
          flex-grow: 1;
          border: none;
        }
        form button {
          flex-shrink: 0;
        }
        .container nav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
      `}</style>
    </footer>
  );
};

export default Footer;