import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/router";
import axios from "axios";
import UserIcon from "./UserIcon";


const Header = () => {
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);
  const [newNotification, setNewNotification] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const router = useRouter();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  

  // Inject Font Awesome stylesheet dynamically
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
    link.rel = "stylesheet";
    link.type = "text/css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    // Set up the auth state listener to get Firebase user info
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User");
        setUserId(user.uid); // Set userId for notifications
      } else {
        setUserName(null);
        setUserId(null);
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const fetchNotifications = async () => {
    if (!userId || notificationsLoaded) return;
    setLoadingNotifications(true);
    setNotificationError(null);

    try {
      const response = await axios.get(`/api/notifications?userId=${userId}`);
      const data = response.data.notifications || [];
      setNotifications(data);
      setNotificationsLoaded(true);

      // Set indicator if there are unread notifications
      setNewNotification(data.some((notification) => !notification.isRead));
    } catch (error) {
      setNotificationError("Failed to load notifications. Please try again.");
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markNotificationsAsRead = async () => {
    if (!userId) return;

    try {
      await axios.patch(`/api/notifications/markAsRead?userId=${userId}`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
      setNewNotification(false);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleNotificationClick = () => {
    if (!isNotificationDropdownOpen && !notificationsLoaded) {
      fetchNotifications();
    }
    markNotificationsAsRead();
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUserName(null);
    setUserId(null);
    router.push("/sign-in");
  };




  useEffect(() => {
    // Set up the auth state listener to get Firebase user info
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User");
        setUserId(user.uid); // Set userId for notifications
      } else {
        setUserName(null);
        setUserId(null);
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  useEffect(() => {
    console.log("Updated notifications state:", notifications);
  }, [notifications]);

  // Detect clicks outside the dropdown to close menus
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsServicesDropdownOpen(false);
    }
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setIsNotificationDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userId) {
      setNotificationsLoaded(false); 
    }
  }, [userId]);

  // Polling for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Adjust the interval as needed

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [userId]);


  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 left-0 w-full z-50 shadow-md h-20">
      <div className="h-20 flex items-center justify-between px-6 md:px-12 lg:px-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/homepage">
            <Image
              src="/logo.svg"
              alt="5 Oceans Immigration Logo"
              width={150}
              height={150}
              className="object-contain"
            />
          </Link>
        </div>
  
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/homepage">
            <span className="relative text-gray-800 hover:text-blue-600 text-base font-medium transition-colors group">
              Home
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full blur-sm"></span>
            </span>
          </Link>
  
         {/* Services Dropdown */}
         <div
  className="relative group"
  onMouseEnter={() => setTimeout(() => setIsServicesDropdownOpen(true), 300)}
  onMouseLeave={() => setTimeout(() => setIsServicesDropdownOpen(false), 300)}
>
  <Link href="/servicespage">
    <button
      className="relative text-gray-800 hover:text-blue-600 text-base font-medium transition-colors group flex items-center"
      onClick={(e) => {
        setIsServicesDropdownOpen(!isServicesDropdownOpen);
      }}
    >
      Services
      <i
        className={`ml-2 text-sm fas ${
          isServicesDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"
        } transition-transform duration-300`}
      ></i>
      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full blur-sm"></span>
    </button>
  </Link>
  {isServicesDropdownOpen && (
    <div className="absolute left-0 top-full mt-2 w-40 bg-white shadow-lg rounded-lg transition-opacity duration-300 opacity-100">
      <Link href="/expressentry">
        <span className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          Express Entry
        </span>
      </Link>
      <Link href="/immigrationpermit">
        <span className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          Immigration Permits
        </span>
      </Link>
      <Link href="/sponsorapplication">
        <span className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-b-lg">
          Sponsor Applications
        </span>
      </Link>
    </div>
  )}
</div>


  
          <Link href="/communitypage">
            <span className="relative text-gray-800 hover:text-blue-600 text-base font-medium transition-colors group">
              Community
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full blur-sm"></span>
            </span>
          </Link>
          <Link href="/aboutpage">
            <span className="relative text-gray-800 hover:text-blue-600 text-base font-medium transition-colors group">
              About Us
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full blur-sm"></span>
            </span>
          </Link>
          <Link href="/uploadpage">
            <span className="relative text-gray-800 hover:text-blue-600 text-base font-medium transition-colors group">
              Upload Files
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full blur-sm"></span>
            </span>
          </Link>
          <Link href="/contactpage">
            <span className="relative text-gray-800 hover:text-blue-600 text-base font-medium transition-colors group">
              Contact
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full blur-sm"></span>
            </span>
          </Link>
        </nav>
  
        {/* Icons Section */}
        <div className="flex items-center space-x-4">
          {/* Notification Dropdown */}
          <div className="relative flex-shrink-0" ref={notificationRef}>
            <button
              onClick={handleNotificationClick}
              className="text-gray-600 hover:text-blue-600 relative"
            >
              <i className="fas fa-bell text-2xl"></i>
              {newNotification && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
            {isNotificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4">
                  <h2 className="font-bold text-lg mb-2">Notifications</h2>
                  {loadingNotifications ? (
                    <p className="text-gray-500">Loading...</p>
                  ) : notificationError ? (
                    <p className="text-red-500">{notificationError}</p>
                  ) : Array.isArray(notifications) && notifications.length > 0 ? (
                    <ul>
                      {notifications.map((notification, index) => (
                        <li
                          key={index}
                          className="p-2 border-b last:border-none"
                        >
                          {notification.content}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No notifications available.</p>
                  )}
                </div>
              </div>
            )}
          </div>
  
          {/* Profile Icon */}
          <UserIcon userName={userName} handleSignOut={handleSignOut} />
        </div>
  
        {/* Mobile Menu Icon */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-800 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <i className="fas fa-times text-2xl"></i>
          ) : (
            <i className="fas fa-bars text-2xl"></i>
          )}
        </button>
      </div>
  
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md p-4">
          <nav className="space-y-4">
            <Link href="/homepage">
              <span className="block text-gray-800 hover:text-blue-600 text-base font-medium">
                Home
              </span>
            </Link>
            <div className="relative">
              <button
                onClick={() =>
                  setIsServicesDropdownOpen(!isServicesDropdownOpen)
                }
                className="text-gray-800 hover:text-blue-600 text-base font-medium flex items-center"
              >
                Services
                <i className="fas fa-chevron-down ml-2 text-sm"></i>
              </button>
              {isServicesDropdownOpen && (
                <div className="mt-2 bg-white border rounded-lg shadow-md">
                  <Link href="/expressentry">
                    <span className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 text-sm">
                      Express Entry
                    </span>
                  </Link>
                  <Link href="/immigrationpermit">
                    <span className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 text-sm">
                      Immigration Permits
                    </span>
                  </Link>
                  <Link href="/sponsorapplication">
                    <span className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 text-sm">
                      Sponsor Applications
                    </span>
                  </Link>
                </div>
              )}
            </div>
            <Link href="/communitypage">
              <span className="block text-gray-800 hover:text-blue-600 text-base font-medium">
                Community
              </span>
            </Link>
            <Link href="/aboutpage">
              <span className="block text-gray-800 hover:text-blue-600 text-base font-medium">
                About Us
              </span>
            </Link>
            <Link href="/uploadpage">
              <span className="block text-gray-800 hover:text-blue-600 text-base font-medium">
                Upload Files
              </span>
            </Link>
            <Link href="/contactpage">
              <span className="block text-gray-800 hover:text-blue-600 text-base font-medium">
                Contact
              </span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
  
};

export default Header;