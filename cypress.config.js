const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // Use the base URL of your app
    setupNodeEvents(on, config) {
      // Implement node event listeners if needed
    },
    env: {
      // Custom environment variables can go here
      guestSignInUrl: '/sign-in',  // Example path for guest sign-in
    },
    defaultCommandTimeout: 8000, // Adjust as needed (default is 4000ms)
    pageLoadTimeout: 60000,       // Adjusts wait time for page load (default is 60000ms)
    retries: {
      runMode: 2, // Retry failed tests in headless mode
      openMode: 0 // No retries when running in interactive mode
    }
  },
});
