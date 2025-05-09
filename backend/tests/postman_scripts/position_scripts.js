/**
 * Pre-request script for Create Position
 * This script helps with preparing a valid position object for creation
 */
// Create randomized test data for position creation
const randomString = Math.random().toString(36).substring(2, 8);

const newPosition = {
    name: `Test Position ${randomString}`,
    description: `Test position description ${randomString}`
};

// Set the JSON body for the Create Position request
pm.variables.set("positionBody", JSON.stringify(newPosition));

/**
 * Test script for Create Position
 * This script captures the position ID and stores it in environment variables
 */
pm.test("Position created successfully", function() {
    const jsonResponse = pm.response.json();
    pm.expect(jsonResponse.id).to.exist;
    
    // Save position ID to environment variable
    pm.environment.set("positionId", jsonResponse.id);
    console.log("Saved positionId: " + jsonResponse.id);
});
