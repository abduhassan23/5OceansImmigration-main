import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RootLayout from "@/app/mainlayout";

const ExpressEntry = () => {
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
    return null; // Prevent rendering until theme is set
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
            src="/Pentopaper.webp"
            alt="Express Entry Hero Image"
            fill
            objectFit="cover"
            className="w-full h-full"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
              Express Entry Program
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar Section */}
            <aside className="space-y-6 md:border-r pr-0 md:pr-8 border-gray-300">
              <div>
                <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Client</h2>
                <p className="text-xl font-medium">Express Entry</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Services</h2>
                <p className="text-xl font-medium">Work</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Year</h2>
                <p className="text-xl font-medium">2022</p>
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

            {/* Main Content Section */}
            <div className="col-span-2 space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  The Process
                </h2>
                <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
                  The government of Canada is seeking skilled workers that will
                  contribute to Canada&apos;s economy. Express Entry has three
                  immigration programs:
                </p>
                <ul className="list-disc list-inside text-lg space-y-2 mt-4">
                  <li>Federal Skilled Worker Program</li>
                  <li>Federal Skilled Trades Program</li>
                  <li>Canadian Experience Class</li>
                </ul>
              </div>

              {/* Table Section */}
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse shadow-lg">
                  <thead
                    className={`text-white ${
                      isDarkMode ? "bg-gray-800" : "bg-blue-600"
                    }`}
                  >
                    <tr>
                      <th className="px-6 py-3 border text-left">
                        Immigration Programs
                      </th>
                      <th className="px-6 py-3 border text-center">Job Offer</th>
                      <th className="px-6 py-3 border text-center">Education</th>
                      <th className="px-6 py-3 border text-center">Language</th>
                      <th className="px-6 py-3 border text-center">
                        Work Outside Canada
                      </th>
                      <th className="px-6 py-3 border text-center">
                        Work Experience in Canada
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className={`${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-3 border">Federal Skilled Worker Program</td>
                      <td className="px-6 py-3 border text-center">✖</td>
                      <td className="px-6 py-3 border text-center">✔</td>
                      <td className="px-6 py-3 border text-center">✔</td>
                      <td className="px-6 py-3 border text-center">✔</td>
                      <td className="px-6 py-3 border text-center">✖</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 border">Federal Skilled Trades Program</td>
                      <td className="px-6 py-3 border text-center">✔</td>
                      <td className="px-6 py-3 border text-center">✔</td>
                      <td className="px-6 py-3 border text-center">✔</td>
                      <td className="px-6 py-3 border text-center">✖</td>
                      <td className="px-6 py-3 border text-center">✔</td>
                    </tr>
                    <tr
                      className={`${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-3 border">Canadian Experience Class</td>
                      <td className="px-6 py-3 border text-center">✖</td>
                      <td className="px-6 py-3 border text-center">✔</td>
                      <td className="px-6 py-3 border text-center">✔</td>
                      <td className="px-6 py-3 border text-center">✔</td>
                      <td className="px-6 py-3 border text-center">✔</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Federal Skilled Worker Program (FSWP)
                </h2>
                <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
                  The FSWP immigration program is available for foreign
                  nationals without a job offer to obtain PR status in Canada.
                </p>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full table-auto border-collapse shadow-lg">
                    <thead
                      className={`text-white ${
                        isDarkMode ? "bg-gray-800" : "bg-blue-600"
                      }`}
                    >
                      <tr>
                        <th className="px-6 py-3 border text-left">Factors</th>
                        <th className="px-6 py-3 border text-left">Details</th>
                        <th className="px-6 py-3 border text-left">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        className={`${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-3 border">Language</td>
                        <td className="px-6 py-3 border">
                          High proficiency in English/French
                        </td>
                        <td className="px-6 py-3 border">28 Points</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3 border">Education</td>
                        <td className="px-6 py-3 border">
                          Post-secondary education
                        </td>
                        <td className="px-6 py-3 border">25 Points</td>
                      </tr>
                      <tr
                        className={`${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-3 border">Work Experience</td>
                        <td className="px-6 py-3 border">
                          Relevant work experience
                        </td>
                        <td className="px-6 py-3 border">15 Points</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </RootLayout>
  );
};

export default ExpressEntry;
