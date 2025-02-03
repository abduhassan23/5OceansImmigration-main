
"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import MainLayout from "../app/mainlayout";

const backendURL =
  process.env.NODE_ENV === "production"
    ? "https://5soundwaves.tech"
    : "http://127.0.0.1:8000";

const FormPage = () => {
  const [formData, setFormData] = useState({
    "2": "",
    "3": "",
    "4": "123456790",
    "5": "",
    "6": "",
    "7": "",
    "8": "",
    "9": "",
    "10": "",
    "11": "",
    "12": "",
    "13": "123456790",
    "14": true,
    "15": "Food",
    "16": true,
    "17": "2024",
    "18": false,
    "19": "2024",
    "20": true,
    "21": "2024",
    "22": "",
    "23": "signature",
    "24": true,
    "25": "", // Email field
  });

  const [firebaseUID, setFirebaseUID] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState("");

  // Monitor Firebase authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUID(user.uid);
        console.log("Authenticated user UID:", user.uid);
      } else {
        console.error("User not authenticated");
      }
    });
    return () => unsubscribe();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!/^\d{8}$/.test(formData["9"])) {
      newErrors["9"] = "Date of Birth must be in YYYYMMDD format.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData["25"])) {
      newErrors["25"] = "Invalid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    if (name === "9") {
      formattedValue = value.replace(/\D/g, "").slice(0, 8); 
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    if (!firebaseUID) {
      alert("User ID not found. Please log in.");
      return;
    }

    setIsLoading(true);
    setSubmissionStatus("");

    try {
      console.log("Backend URL:", backendURL);
      console.log("Sending form data to /api/inject:", formData);

      // Submit form data
      const injectResponse = await axios.post(`/api/inject`, {
        ...formData,
        firebaseUID,
      });
      console.log("Form data injected successfully:", injectResponse.data);

      console.log("Requesting PDF generation with firebaseUID:", firebaseUID);

      // Request PDF generation
      const pdfResponse = await axios.post(`/api/generate-pdf`, {
        firebaseUID,
        document_id: injectResponse.data.createdEntry.id, // Use ID from injection response
      });

      if (pdfResponse.status === 200 && pdfResponse.data.success) {
        setDownloadUrl(pdfResponse.data.downloadUrl);
        setSubmissionStatus("PDF generated successfully!");
      } else {
        throw new Error(pdfResponse.data.error || "PDF generation failed");
      }
    } catch (error) {
      console.error("Error in PDF generation:", error.message);
      if (error.response) {
        console.error("Error Response:", error.response.data);
        setSubmissionStatus(
          `Submission failed: ${error.response.data.error || "Unknown error"}`
        );
      } else if (error.request) {
        console.error("No Response:", error.request);
        setSubmissionStatus(
          "Submission failed: No response from the server. Please check your network or backend."
        );
      } else {
        console.error("Error Message:", error.message);
        setSubmissionStatus(
          "Submission failed: An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-xl font-semibold mb-4 text-center">
          User Information Form
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {Object.entries(formData).map(([key, value], index) => {
              const fieldLabels = [
                "Field 2 (First Name)",
                "Field 3 (Last Name)",
                "Field 4 (SIN)",
                "Field 5 (Address)",
                "Field 6 (City)",
                "Field 7 (Province)",
                "Field 8 (Postal Code)",
                "Field 9 (Date of Birth)",
                "Field 10 (Spouse First Name)",
                "Field 11 (Spouse Last Name)",
                "Field 12 (Spouse Relation)",
                "Field 13 (Spouse SIN)",
                "Field 14 (Checkbox)",
                "Field 15 (Other)",
                "Field 16 (Checkbox)",
                "Field 17 (Year)",
                "Field 18 (Checkbox)",
                "Field 19 (Year)",
                "Field 20 (Checkbox)",
                "Field 21 (Year)",
                "Field 22 (Support Description)",
                "Field 23 (Signature)",
                "Field 24 (Checkbox)",
                "Field 25 (Email)",
              ];

              const isCheckbox = ["14", "16", "18", "20", "24"].includes(key);

              if (key === "22" && !formData["20"]) return null;

              return (
                <div key={index}>
                  <label className="block text-gray-700">{fieldLabels[index]}</label>
                  {isCheckbox ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name={key}
                        checked={value}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <input
                      name={key}
                      value={value}
                      onChange={handleChange}
                      required={key === "25"}
                      className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                      type={key === "9" ? "text" : key === "25" ? "email" : "text"}
                      placeholder={
                        key === "9" ? "YYYYMMDD" : key === "25" ? "Enter your email" : ""
                      }
                    />
                  )}
                  {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
                </div>
              );
            })}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-6 w-full py-2 px-4 ${
              isLoading ? "bg-gray-400" : "bg-blue-600"
            } text-white rounded-md hover:bg-blue-700 transition duration-200`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
        {submissionStatus && (
          <p
            className={`mt-4 ${
              submissionStatus.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {submissionStatus}
          </p>
        )}
        {downloadUrl && (
          <div className="mt-4 text-center">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Download your PDF
            </a>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FormPage;
