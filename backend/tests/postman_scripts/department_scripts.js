/**
 * Pre-request script for Create Department
 * This script helps with preparing a valid department object for creation
 */
// Create randomized test data for department creation
const randomString = Math.random().toString(36).substring(2, 8);

const newDepartment = {
    name: `Test Department ${randomString}`,
    description: `Test department description ${randomString}`
};

// Set the JSON body for the Create Department request
pm.variables.set("departmentBody", JSON.stringify(newDepartment));

/**
 * Test script for Create Department
 * This script captures the department ID and stores it in environment variables
 */
pm.test("Department created successfully", function() {
    const jsonResponse = pm.response.json();
    pm.expect(jsonResponse.id).to.exist;
    
    // Save department ID to environment variable
    pm.environment.set("departmentId", jsonResponse.id);
    console.log("Saved departmentId: " + jsonResponse.id);
});
