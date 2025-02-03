import React, { useState, useEffect } from "react";
import RootLayout from "@/app/mainlayout";
import Image from "next/image";
import Link from "next/link";

const SponsorApplication = () => {
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
    return null; // Avoid rendering before the theme is set
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
            src="/engagementRing.webp"
            alt="Sponsor Application Hero Image"
            fill
            objectFit="cover"
            className="w-full h-full"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
              Sponsor Application Program
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
                <p className="text-xl font-medium">Sponsorship Applications</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Services</h2>
                <p className="text-xl font-medium">Family</p>
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
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Application Requirements
                </h2>
                <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
                  To be eligible as a sponsor, you must meet the following criteria:
                </p>
                <ul className="list-disc list-inside text-lg space-y-2 mt-4">
                  <li>At least 18 years old.</li>
                  <li>A Canadian citizen or Permanent resident.</li>
                  <li>Currently residing in Canada.</li>
                  <li>
                    You must prove that you are not receiving social assistance and can
                    provide for your spouse/partner.
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-10">
                  Class of Application
                </h2>
                <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
                  If you&apos;re sponsoring your conjugal partner or dependent child, you
                  must submit an application under the Family Class.
                </p>
                <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
                  If you&apos;re sponsoring your spouse or common-law partner, you may
                  sponsor them under the Family Class or under the Spouse or Common-Law
                  Partner in Canada Class.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-10">
                  The Process
                </h2>
                <ul className="list-disc list-inside text-lg space-y-2 mt-4">
                  <li>Step 1: Get your application kit.</li>
                  <li>Step 2: Gather your documents.</li>
                  <li>Step 3: Fill out the forms.</li>
                  <li>Step 4: Pay the fees.</li>
                  <li>Step 5: Check your applications to avoid common mistakes.</li>
                  <li>Step 6: Submit the application.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </RootLayout>
  );
};

export default SponsorApplication;
