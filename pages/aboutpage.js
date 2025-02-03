import React, { useState, useEffect, useRef } from "react";
import RootLayout from "@/app/mainlayout";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Chatbot from "@/pages/chatbot";

const AboutUs = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const whyChooseUsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.body.style.backgroundColor = "#000000";
        document.body.style.color = "#ffffff";
      } else {
        setIsDarkMode(false);
        document.body.style.backgroundColor = "#ffffff";
        document.body.style.color = "#000000";
      }
    }
  }, []);

  const handleScrollToWhyChooseUs = () => {
    if (whyChooseUsRef.current) {
      whyChooseUsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <RootLayout>
      <section
        className={`flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-16 py-16 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Left Content Section */}
        <div className="flex flex-col items-start justify-center space-y-6 w-full md:w-1/2">
          {/* Heading with Animation */}
          <motion.h1
            className={`text-3xl md:text-5xl font-bold text-center md:text-left leading-tight ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              A team dedicated to
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              making your immigration
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              journey smooth and stress-free.
            </motion.span>
          </motion.h1>

          {/* Typing Animation */}
          <motion.p
            className={`text-sm md:text-base text-center md:text-left leading-relaxed max-w-[350px] ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            At 5 Oceans Immigration, we guide you through every step of your
            immigration journey. Your dream of settling in Canada starts here.
          </motion.p>

          {/* Button with Hover and Scale Effect */}
          <motion.button
            className={`text-sm md:text-md px-4 py-2 md:px-5 md:py-3 rounded-full border-2 transition-transform duration-300 shadow-md ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600 border-gray-500"
                : "bg-gray-500 text-white hover:bg-gray-600 border-gray-300"
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleScrollToWhyChooseUs} // Scroll to "Why Choose Us" section
          >
            Get Started
          </motion.button>
        </div>

        {/* Right Image Section */}
        <div className="w-full md:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          >
            <Image
              src="/consultants.webp"
              alt="Immigration Consultants"
              className="rounded-lg shadow-lg object-cover"
              width={700}
              height={400}
              layout="responsive"
            />
          </motion.div>
        </div>
      </section>

      <Chatbot />
      <section
        ref={whyChooseUsRef} // Attach the ref to this section
        className={`relative py-10 md:py-16 overflow-hidden ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <motion.h2
            className={`text-4xl font-bold text-center mb-12 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Why Choose 5 Oceans Immigration?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                gifSrc: "/guide.mp4",
                title: "Personalized Guidance",
                description:
                  "We provide one-on-one consultations tailored to your unique needs, ensuring every step of the immigration process is clear and straightforward. Our advisors work closely with you to create customized solutions that address your specific goals and circumstances.",
              },
              {
                gifSrc: "/save-money.mp4",
                title: "Affordable Solutions",
                description:
                  "Our services are competitively priced to suit a variety of client needs, from individuals to families and businesses. We deliver exceptional value without compromising the quality of our service or your chances of success.",
              },
              {
                gifSrc: "/collaboration.mp4",
                title: "Expert Team",
                description:
                  "Our team comprises certified consultants and immigration experts with years of experience. We stay updated on the latest immigration laws and policies to ensure your application is handled professionally and accurately.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`p-6 md:p-8 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="group">
                  <video
                    src={item.gifSrc}
                    className="w-20 h-20 mx-auto mb-6 transition-transform duration-300 group-hover:scale-110"
                    autoPlay
                    loop
                    muted
                  />
                  <h3
                    className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                      isDarkMode
                        ? "text-white group-hover:text-teal-400"
                        : "text-gray-900 group-hover:text-teal-500"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } group-hover:text-gray-500`}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="container mx-auto px-6 lg:px-16">
          <motion.h2
            className={`text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span> About 5 Oceans Immigration</span>
            <img
              src="/5Oceanlogowave.png"
              alt="5 Oceans Logo"
              className="h-16 md:h-15 w-auto inline-block"
            />
          </motion.h2>
          <motion.div
            className={`text-center space-y-6 leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p>
              5 Oceans Immigration was founded with a vision to simplify the
              complex immigration process and help individuals achieve their
              dreams of starting a new life in Canada. Our name reflects the
              global reach of our services, symbolizing the connection between
              people from all corners of the world.
            </p>
            <p>
              Over the years, we have successfully guided thousands of clients
              through their immigration journeys, offering personalized
              solutions tailored to their unique needs. With a strong commitment
              to integrity and excellence, we aim to make immigration seamless
              and stress-free.
            </p>
            <p>
              At 5 Oceans Immigration, we don’t just provide services; we build
              relationships and empower dreams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section
        className={`py-10 md:py-20 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-0">
          <motion.h2
            className={`text-4xl font-bold text-center mb-12 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Meet Our Team!
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                name: "Angad Suri",
                title: "Regulated Immigration Consultant",
                image: "/Ang.png",
                description:
                  "Angad Suri is a licensed Regulated Immigration Consultant with years of experience assisting clients worldwide.",
                linkedin: "#",
                email: "angad.suri@example.com",
              },
              {
                name: "Luqman Musse",
                title: "Regulated Immigration Consultant",
                image: "/luq.png",
                description:
                  "Luqman Musse specializes in tailoring immigration solutions for families and businesses.",
                linkedin: "#",
                email: "luqman.musse@example.com",
              },
              {
                name: "Sophia Carter",
                title: "Senior Immigration Advisor",
                image: "/Sop.png",
                description:
                  "Sophia Carter has over 10 years of experience in immigration consulting, helping clients achieve their dreams.",
                linkedin: "#",
                email: "sophia.carter@example.com",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className={`relative p-6 md:p-8 rounded-xl shadow-md max-w-xs lg:max-w-sm m-4 transition-transform transform hover:scale-105 hover:shadow-lg ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="group">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover transition-transform group-hover:scale-110"
                  />
                  <h3 className="text-xl font-bold text-center">
                    {member.name}
                  </h3>
                  <p className="text-center mb-4">{member.title}</p>
                  <p
                    className={`text-center mb-6 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {member.description}
                  </p>
                  <div className="flex justify-center space-x-4">
                    {/* LinkedIn */}
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xl ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      } hover:text-blue-500 transition-colors`}
                    >
                      <i className="fab fa-linkedin"></i>
                    </a>
                    {/* Email */}
                    <a
                      href={`mailto:${member.email}`}
                      className={`text-xl ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      } hover:text-gray-500 transition-colors`}
                    >
                      <i className="fas fa-envelope"></i>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section
        className={`py-10 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/5oceanlogo.png" // Path to your logo file
              alt="5 Oceans Immigration Logo"
              width={500} // Adjust the width as needed
              height={550} // Adjust the height as needed
              className={`rounded-md ${isDarkMode ? "shadow-lg" : ""}`} // Optional: Add a shadow in dark mode
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
    </RootLayout>
  );
};

export default AboutUs;
