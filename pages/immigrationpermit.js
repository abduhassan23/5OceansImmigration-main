import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import RootLayout from "@/app/mainlayout";

const ImmigrationPermits = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark");
    }
  }, []);

  if (!isMounted) {
    return null; // Avoid rendering until theme is initialized
  }

  return (
    <RootLayout>
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* Hero Section */}
        <section className="relative w-full h-72 sm:h-96">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent z-10"></div>
          <Image
            src="/graduation.webp"
            alt="Immigration Permits"
            fill
            objectFit="cover"
            className="w-full h-full"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
              Immigration Permits
            </h1>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar Section */}
            <aside className="space-y-6 md:border-r pr-0 md:pr-8 border-gray-300">
              <div>
                <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Client</h2>
                <p className="text-xl font-medium">Immigration Permits</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Services</h2>
                <p className="text-xl font-medium">Work</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Year</h2>
                <p className="text-xl font-medium">2021</p>
              </div>
              <Link href="/contactpage" passHref>
                <button
                  className={`mt-4 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  Contact Us
                </button>
              </Link>
            </aside>

            {/* Main Text Section */}
            <div className="col-span-2 space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Study Permit</h2>
                <h3 className="text-xl font-semibold mt-4 text-gray-700 dark:text-gray-300">
                  Eligibility Requirements:
                </h3>
                <ul className="list-disc list-inside text-lg space-y-2">
                  <li>You must be enrolled at a DLI (designated learning institution).</li>
                  <li>
                    Prove you have enough money for tuition, living expenses, and return transportation.
                  </li>
                  <li>No criminal record and pass the medical exam.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  The Benefits of a Study Permit
                </h3>
                <p className="text-lg mt-4">
                  A study permit can make your life easier in Canada:
                </p>
                <ul className="list-disc list-inside text-lg space-y-2">
                  <li>You can continue to study even if your situation changes.</li>
                  <li>You can maintain your status while waiting for a new study permit.</li>
                  <li>You can work on or off campus under specific conditions.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Benefits Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              The Benefits of Immigration Permits
            </h2>
            <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
              Immigration permits provide you with a legal way to work, study, or join family members
              in Canada. Here are the top advantages:
            </p>
            <ul className="list-disc list-inside text-lg space-y-2 mt-4">
              <li>Access to world-class education and healthcare.</li>
              <li>Work while you study or after graduation.</li>
              <li>Pathways to permanent residency and citizenship.</li>
            </ul>
          </div>
        </section>
      </div>
    </RootLayout>
  );
};

export default ImmigrationPermits;
