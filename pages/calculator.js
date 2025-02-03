import React, { useState } from "react";
import "../app/globals.css";

const Calculator = () => {
  const [inputValues, setInputValues] = useState({
    age: "",
    experience: "",
    serviceType: "",
    familySize: "",
    urgency: false,
  });

  const [processingTime, setProcessingTime] = useState(null);
  const [costEstimate, setCostEstimate] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputValues({
      ...inputValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const calculateEstimates = () => {
    let baseTime = 30;

    if (inputValues.serviceType === "express_entry") baseTime += 20;
    if (inputValues.serviceType === "immigration_permit") baseTime += 10;
    if (inputValues.serviceType === "sponsorship_application") baseTime += 40;
    if (inputValues.urgency) baseTime -= 10;

    setProcessingTime(baseTime);

    let baseCost = 1000;

    if (inputValues.serviceType === "express_entry") baseCost += 700;
    if (inputValues.serviceType === "immigration_permit") baseCost += 500;
    if (inputValues.serviceType === "sponsorship_application") baseCost += 800;
    baseCost += inputValues.familySize * 200;
    if (inputValues.urgency) baseCost += 300;

    setCostEstimate(baseCost);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center">
          Visa Processing Time & Cost Calculator
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={inputValues.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Experience (years)
            </label>
            <input
              type="number"
              name="experience"
              value={inputValues.experience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Service Type
            </label>
            <select
              name="serviceType"
              value={inputValues.serviceType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Service Type</option>
              <option value="express_entry">Express Entry</option>
              <option value="immigration_permit">Immigration Permit</option>
              <option value="sponsorship_application">
                Sponsorship Application
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Family Size
            </label>
            <input
              type="number"
              name="familySize"
              value={inputValues.familySize}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="urgency"
              checked={inputValues.urgency}
              onChange={handleChange}
              className="mr-2 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Urgent Processing
            </label>
          </div>

          <button
            type="button"
            onClick={calculateEstimates}
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Calculate
          </button>
        </form>

        {processingTime !== null && (
          <p className="mt-6 text-gray-800 dark:text-gray-300 font-medium">
            Estimated Processing Time:{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {processingTime} days
            </span>
          </p>
        )}

        {costEstimate !== null && (
          <p className="mt-2 text-gray-800 dark:text-gray-300 font-medium">
            Estimated Cost:{" "}
            <span className="text-blue-600 dark:text-blue-400">
              ${costEstimate}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Calculator;
