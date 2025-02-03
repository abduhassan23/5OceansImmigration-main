import React, { useEffect, useState } from "react";
import RootLayout from "@/app/mainlayout";
import { motion } from "framer-motion"; // AI-assisted: Added animation for page elements using Framer Motion
import Image from "next/image";
import Link from "next/link";

const ServicesPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check localStorage or system preference for theme
  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!isMounted) return null;

  return (
    <RootLayout>
<div
  className={`relative min-h-screen ${
    isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
  }`}
>
  {/* Hero Section */}
  <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-10">
    <div className="flex flex-col items-start justify-center space-y-4 md:space-y-6 w-full md:w-1/2">
      <div className="mb-4 flex items-center justify-start space-x-2">
        {/* Circle Icon with Animation */}
        <motion.div
          className="bg-teal-400 w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center"
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], rotate: [0, 360], opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.span
            className="bg-white w-2 h-2 md:w-3 md:h-3 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          ></motion.span>
        </motion.div>

        {/* Triangle Icon with Animation */}
        <motion.div
          className="bg-red-600 w-6 h-6 md:w-10 md:h-10"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], rotate: [0, -360], opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
        ></motion.div>
      </div>

      <motion.h1
        className="text-3xl md:text-5xl font-bold text-center md:text-left"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Helping you achieve <br />
        your Immigration dreams with <br />
        expert and personalized guidance!
      </motion.h1>
      <motion.p
        className={`text-sm md:text-base text-center md:text-left leading-relaxed max-w-[350px] ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        Whether you&apos;re planning to study, work, or settle abroad, our team is 
here to guide you every step of the way. Let&apos;s make your transition to
a new life as seamless as possible!
      </motion.p>

      <motion.button
        className="bg-gray-500 text-white text-sm md:text-md px-4 py-2 md:px-5 md:py-3 rounded-full border-2 hover:bg-gray-600 transition-colors duration-300 shadow-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        onClick={() => {
          document
            .getElementById("offered-services")
            .scrollIntoView({ behavior: "smooth" });
        }}
      >
        Get Started
      </motion.button>
    </div>

    <div className="w-full md:w-1/2 mt-6 md:mt-0">
      <Image
        src="/HoldingCanadaFlag.webp"
        alt="Rocky Mountains"
        className="rounded-lg shadow-lg object-cover"
        width={700}
        height={400}
        layout="responsive"
      />
    </div>
  </section>



{/* Offered Services Section */}
<section
  id="offered-services"
  className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"} py-16`}
>
  <div className="container mx-auto text-center">
    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
      Our Services
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-20">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-3">
        <div className="w-full h-48 overflow-hidden rounded-t-xl">
          <Image
            src="/ExpressEntry.webp"
            alt="Express Entry"
            layout="responsive"
            width={700}
            height={400}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-2xl font-bold mt-6 text-gray-800 dark:text-white">
          Express Entry
        </h3>
        <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
          Simplify your immigration process with our streamlined Express Entry services designed to meet your unique needs.
        </p>
        <Link href="/expressentry">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full mt-6 font-semibold hover:bg-blue-700 transition-colors">
            Learn More
          </button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-3">
        <div className="w-full h-48 overflow-hidden rounded-t-xl">
          <Image
            src="/graduation.webp"
            alt="Immigration Permits"
            layout="responsive"
            width={700}
            height={400}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-2xl font-bold mt-6 text-gray-800 dark:text-white">
          Immigration Permits
        </h3>
        <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
          Explore our services to secure Immigration Permits for working in your desired country with full legal compliance.
        </p>
        <Link href="/immigrationpermit">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full mt-6 font-semibold hover:bg-blue-700 transition-colors">
            Learn More
          </button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-3">
        <div className="w-full h-48 overflow-hidden rounded-t-xl">
          <Image
            src="/engagementRing.webp"
            alt="Sponsor Applications"
            layout="responsive"
            width={700}
            height={400}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-2xl font-bold mt-6 text-gray-800 dark:text-white">
          Sponsor Applications
        </h3>
        <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
          Assist your family members in joining you with our Family Sponsorship services for smooth reunification.
        </p>
        <Link href="/sponsorapplication">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full mt-6 font-semibold hover:bg-blue-700 transition-colors">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  </div>
</section>








{/* How We Work Section */}
<section id="how-we-work" className="py-16 bg-gray-50 dark:bg-gray-800">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
      How We Work
    </h2>
    <div className="relative flex flex-col items-center space-y-16">
      {[
        {
          title: "Step 1: Consultation 💬",
          description:
            "Book a free consultation to discuss your unique needs, eligibility, and the best path forward. Our expert team will guide you through the available options and create a tailored plan to achieve your goals.",
        },
        {
          title: "Step 2: Document Preparation 📝",
          description:
            "Our team works closely with you to gather and prepare all the necessary documents, ensuring accuracy and compliance with the latest legal requirements. We also provide templates and examples to simplify the process.",
        },
        {
          title: "Step 3: Application Submission 📤",
          description:
            "Once your documents are ready, we handle the submission process on your behalf, ensuring all forms are complete and error-free. We keep you updated at every stage and provide immediate feedback if additional information is required.",
        },
        {
          title: "Step 4: Approval 🎉",
          description:
            "Celebrate as your application is approved! We provide you with detailed instructions on what to do next, including guidance for moving forward and making the most of your new opportunities.",
        },
      ].map((step, index) => (
        <motion.div
          key={index}
          className={`flex flex-col md:flex-row items-center w-full max-w-5xl p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg relative ${
            index % 2 === 0 ? "self-start" : "self-end"
          } justify-center items-center`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: index * 0.3 }}
        >
          <div className="flex flex-col items-center md:w-1/2 text-center">
            <div
              className={`w-12 h-12 mb-4 flex items-center justify-center rounded-full text-white text-xl font-bold ${
                index % 2 === 0 ? "bg-blue-500" : "bg-blue-500"
              }`}
            >
              {index + 1}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {step.title}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {step.description}
            </p>
          </div>
          {index < 3 && (
            <motion.div
              className={`absolute top-full ${
                index % 2 === 0
                  ? "left-1/2 transform -translate-x-1/2"
                  : "right-1/2 transform translate-x-1/2"
              } w-1 h-24 bg-gray-300 dark:bg-gray-600`}
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{ transformOrigin: "top" }}
            ></motion.div>
          )}
        </motion.div>
      ))}
    </div>
  </div>
</section>


    
      </div>
    </RootLayout>
  );
};

export default ServicesPage;
