import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import RootLayout from "@/app/mainlayout";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import RSSFeeds from "@/app/components/RssFeeds";
import Chatbot from "@/pages/chatbot";
import { Chat } from "openai";
import Image from "next/image";

const HomePage = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPauseButton, setShowPauseButton] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false); // Add this line
  const [showVideoModal, setShowVideoModal] = useState(false); // Set to true initially
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");

  const videoRef = useRef(null);
  const router = useRouter();
  const auth = getAuth();

  // State for the scrolling effect of different sections on the page
  const [refServices, inViewServices] = useInView({ triggerOnce: true });
  const [refFeedback, inViewFeedback] = useInView({ triggerOnce: true });

  // Adjust the range [0.2, 0.4] for earlier animation
  const { scrollYProgress } = useScroll();
  const scale = useSpring(useTransform(scrollYProgress, [0.1, 0.3], [0, 1])); // Adjusted range
  const opacity = useSpring(useTransform(scrollYProgress, [0.1, 0.3], [0, 1])); // Adjusted range

  // Check and set theme from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.body.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.body.classList.remove("dark");
      }
    }
  }, []);

  const toggleVideoPlay = () => {
    setIsVideoVisible(!isVideoVisible);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Check admin status based on authentication
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            setEmail(user.email);
            const res = await fetch(`/api/Users?email=${user.email}`);
            const data = await res.json();

            if (data.isAdmin) {
              setIsAdmin(true);
            }
          }
        });
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();
  }, [auth, router]);

  const handleAdminButtonClick = () => {
    router.push("/admindashboardpage");
  };
  // Add the widget script in useEffect
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Widget Integration from https://app.openwidget.com/
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.openwidget.com/openwidget.js";
    script.async = true;
    document.head.appendChild(script);

    window.__ow = window.__ow || {};
    window.__ow.organizationId = "78e6f4ed-3448-4e55-ab0d-36d5fe4529b0";

    // Ensure OpenWidget is initialized on page load
    script.onload = () => {
      if (window.OpenWidget) {
        window.OpenWidget.on("ready", () => {
          window.OpenWidget.call("open");
        });
      }
    };
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const toggleModal = () => {
    console.log("Play button clicked"); // Add this to check in console
    setShowVideoModal((prevState) => !prevState);
  };
  const natureImages = [
    "/nature1.jpg",
    "/nature2.jpg",
    "/nature3.webp",
    "/nature4.jpg",
    "/nature5.webp",
  ];

  // Function to cycle images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % natureImages.length
      );
    }, 10000); // Match the total animation duration (10 seconds)

    return () => clearInterval(interval);
  }, [natureImages.length]);

  return (
    <RootLayout>
      <section className="relative min-h-screen flex flex-col justify-center text-white overflow-hidden">
        {/* Background Image and Tint */}
        <motion.div
          key={currentImageIndex}
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${natureImages[currentImageIndex]}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          {/* Purple Tint Overlay */}
          <div className="absolute inset-0 bg-gray-800 bg-opacity-60 z-0"></div>
        </motion.div>

        {/* Content (Heading, Paragraph, etc.) */}
        <div className="relative z-10 px-6 md:px-12 text-left">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Main Heading */}
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 text-white"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}
            >
              Embrace Exploration
            </h1>

            {/* Paragraph */}
            <p
              className="text-2xl md:text-4xl font-semibold text-white mb-6"
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                maxWidth: "60%",
                lineHeight: "1.5",
                wordWrap: "break-word",
              }}
            >
              At 5 Oceans Immigration, we help you navigate the complex world of
              immigration and global relocation. Let us assist you in achieving
              your goals!
            </p>
            <p className="text-lg md:text-xl mb-6"></p>
              <Link href="https://appt.link/immigration-consultation/meeting-immigration">
                <button className="bg-blue-500 text-white px-6 py-3 text-lg font-semibold rounded-lg hover:bg-blue-400 transition-colors">
                  Book a Consultation
                </button>
              </Link>
          </motion.div>
        </div>

        {/* Play Video Button */}
        <div
          className="absolute bottom-[50%] right-[20%] w-20 h-20 border-4 border-white rounded-full flex items-center justify-center text-white cursor-pointer hover:shadow-2xl hover:scale-125 transition-transform z-20"
          onClick={toggleModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 3l14 9-14 9V3z"
            />
          </svg>
        </div>

        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
            <div className="relative w-full max-w-3xl h-auto bg-black rounded-lg overflow-hidden">
              <iframe
                className="w-full h-[500px]"
                src="https://www.youtube.com/embed/ntDdyQ51T1c?autoplay=1"
                title="YouTube video"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
              <button
                className="absolute top-4 right-4 text-white text-xl bg-gray-800 rounded-full p-2 hover:bg-gray-600"
                onClick={toggleModal}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Services Section */}

      {/* Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
            What to Expect from Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Fast and Incredible Support",
                description:
                  "Our team is dedicated to achieving your goals quickly and efficiently. Experience seamless support throughout the process.",
                icon: (
                  <svg
                    className="w-8 h-8 text-purple-600 dark:text-purple-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                ),
              },
              {
                title: "Lifetime Support",
                description:
                  "We assist you even after your immigration process is complete. Expect continued assistance when you need it the most.",
                icon: (
                  <svg
                    className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M9 21h6m-6-3h6M5 6h14l1-3H4l1 3z"
                    />
                  </svg>
                ),
              },
              {
                title: "Secure and Confidential",
                description:
                  "We prioritize your security and confidentiality in all interactions. Your personal information is in safe hands.",
                icon: (
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v13a2 2 0 002 2h14a2 2 0 002-2V7m-2 0a5 5 0 00-10 0H5a2 2 0 00-2 2v2h18V9a2 2 0 00-2-2h-2a5 5 0 00-10 0H5"
                    />
                  </svg>
                ),
              },
              {
                title: "Transparent Guidance",
                description:
                  "Receive step-by-step instructions and detailed information to make the immigration process simple and stress-free.",
                icon: (
                  <svg
                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6-6h6m-6 12h6m-9-3v6h6m-9 0h6m-3-6v6m-6 0H3a2 2 0 01-2-2V6a2 2 0 012-2h18a2 2 0 012 2v10a2 2 0 01-2 2h-6"
                    />
                  </svg>
                ),
              },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.15)",
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-4">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* Features Section */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 lg:ml-16">
            {/* Image Container */}
            <img src="/waving.gif" alt="Team" className="" />
          </div>
          <div className="w-full lg:w-1/2 lg:pl-16">
            {/* Section Title */}
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              We Unlock Potential
            </h2>
            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We provide expert guidance to help you achieve your goals and
              navigate every step with confidence.
            </p>
            {/* List of Features */}
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Express Entry</li>
              <li>Immigration Permits</li>
              <li>Sponsor Applications</li>
            </ul>
            {/* Call-to-Action Button */}
            <Link href="/servicespage" passHref legacyBehavior>
              <a className="mt-6 inline-block bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition">
                What We Do →
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={ref} className="py-12 relative bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex justify-around items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg py-8 px-6">
            {[
              { value: 1749, label: "Happy Clients" },
              { value: 796, label: "Successful Applications" },
              { value: 573, label: "Families Reunited" },
              { value: 2739, label: "Visas Secured" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center transition-transform duration-500 hover:scale-105"
              >
                <h3 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                  {inView ? (
                    <CountUp
                      end={stat.value}
                      duration={7} // Smooth animation duration (in seconds)
                      delay={0} // Delay before the animation starts
                      separator=","
                    />
                  ) : (
                    0
                  )}
                </h3>
                <p className="text-gray-500 dark:text-gray-300 mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <RSSFeeds />

      {/* Map Section */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/5oceanlogo.png" // Path to your logo file
              alt="5 Oceans Immigration Logo"
              width={500} // Adjust the width as needed
              height={550} // Adjust the height as needed
              className="rounded-md" // Optional: Add rounded corners
            />
          </div>

          {/* Map */}
          <div
            className={`rounded-lg shadow-lg overflow-hidden ${
              isDarkMode ? "bg-gray-800" : "bg-gray-200"
            }`}
          >
            <iframe
              width="100%"
              height="500"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://maps.google.com/maps?width=100%25&amp;height=500&amp;hl=en&amp;q=3770%20Westwinds%20Dr%20NE%20134+(5%20Oceans%20Immigration)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              style={{
                border: "none",
                borderRadius: "8px",
                filter: isDarkMode ? "invert(90%) hue-rotate(180deg)" : "none",
              }}
              title="5 Oceans Immigration Location"
            ></iframe>
          </div>
        </div>
      </section>

      {isAdmin && (
        <section className="admin-section py-20 bg-gray-100 dark:bg-gray-900 text-center transition-colors duration-500">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Admin Tools
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Manage and oversee all administrative functionalities seamlessly.
          </p>
          <button
            onClick={handleAdminButtonClick}
            className="bg-blue-600 dark:bg-blue-500 text-white font-medium px-8 py-4 rounded-lg shadow-lg hover:bg-blue-500 dark:hover:bg-blue-400 transition-all"
          >
            Admin Dashboard
          </button>
        </section>
      )}
    </RootLayout>
  );
};

export default HomePage;
