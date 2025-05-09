/**
 * Pre-request script for Login
 * This script helps with preparing credentials for the login request
 */
// Set login credentials
const testCredentials = {
    email: "admin@example.com",
    password: "admin123"
};

// Set the JSON body for the Login request
pm.variables.set("loginBody", JSON.stringify(testCredentials));

/**
 * Test script for Login
 * This script captures the auth token and stores it in environment variables
 */
pm.test("Response has token", function() {
    const jsonResponse = pm.response.json();
    pm.expect(jsonResponse.token).to.exist;
    
    // Save token to environment variable
    pm.environment.set("authToken", jsonResponse.token);
    console.log("Saved authToken successfully");
});
