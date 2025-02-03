import React, { useState, useEffect } from "react";
import RootLayout from "@/app/mainlayout";
import Image from "next/image";

const ContactPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [faqOpen, setFaqOpen] = useState({
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    q5: false,
    q6: false,
  });
  const [isClient, setIsClient] = useState(false);

  // AI-assisted: Check for the theme in localStorage after the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
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

  const toggleFaq = (question) => {
    setFaqOpen((prev) => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  if (!isClient) {
    return null; // AI-assisted: Render only if the client-side is ready
  }

  return (
    <RootLayout>
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
        }`}
      >
        {/* Contact Form Section */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex justify-center">
                <Image
                  src="/Canadavisanow.webp"
                  alt="Canada VisaNow"
                  width={650}
                  height={100}
                  className="object-contain"
                  quality={100}
                />
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-gray-100">
                  Contact Us
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Name"
                    />
                    <input
                      type="text"
                      className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Mobile"
                    />
                    <input
                      type="email"
                      className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Email"
                    />
                  </div>
                  <select
                    className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Immigration Program
                    </option>
                    <option value="express-entry">Express Entry</option>
                    <option value="sponsorship">Sponsorship</option>
                    <option value="work-permit">Work Permit</option>
                  </select>
                  <textarea
                    className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="5"
                    placeholder="Your message..."
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition ease-in-out duration-300 w-full"
                  >
                    Message Us!
                  </button>
                </form>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Image
                src="/team-work-image.webp"
                alt="Team Working"
                width={600}
                height={400}
                className="rounded-lg shadow-lg object-cover"
                quality={100}
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-100 dark:bg-gray-800 py-16 px-4" id="faq-section">
          <div className="container mx-auto">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-gray-100 text-center">
              Frequently Asked Questions
            </h2>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Canada Immigration
              </h3>
              <div className="space-y-4">
                {[
                  { question: "What is private group sponsorship?", answer: "Private group sponsorship..." },
                  { question: "Who can sponsor refugees?", answer: "Typically, any group of five..." },
                  { question: "Who is eligible to be sponsored?", answer: "Refugees who are outside..." },
                  { question: "What if my application is denied?", answer: "If your application is denied..." },
                  { question: "Can you help with language exams?", answer: "Yes, we offer resources..." },
                  { question: "How to start the application process?", answer: "You can start by booking..." }
                ].map((item, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleFaq(`q${index + 1}`)}
                    >
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {item.question}
                      </h4>
                      <span>{faqOpen[`q${index + 1}`] ? "-" : "+"}</span>
                    </div>
                    {faqOpen[`q${index + 1}`] && (
                      <p className="text-gray-600 dark:text-gray-400 mt-2 transition-all duration-200 ease-in-out">
                        {item.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </RootLayout>
  );
};

export default ContactPage;
