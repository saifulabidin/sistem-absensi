/**
 * Pre-request script for Create Employee
 * This script helps with preparing a valid employee object for creation
 */
// Create randomized test data for employee creation
const randomString = Math.random().toString(36).substring(2, 8);

const newEmployee = {
    name: `Test Employee ${randomString}`,
    email: `test.${randomString}@example.com`,
    password: "password123",
    role: "employee"
};

// If position and department IDs are available, add them
if (pm.environment.get("positionId")) {
    newEmployee.position_id = pm.environment.get("positionId");
}

if (pm.environment.get("departmentId")) {
    newEmployee.dept_id = pm.environment.get("departmentId");
}

// Set the JSON body for the Create Employee request
pm.variables.set("employeeBody", JSON.stringify(newEmployee));

/**
 * Test script for Create Employee
 * This script captures the employee ID and stores it in environment variables
 */
pm.test("Employee created successfully", function() {
    const jsonResponse = pm.response.json();
    pm.expect(jsonResponse.id).to.exist;
    
    // Save employee ID to environment variable
    pm.environment.set("employeeId", jsonResponse.id);
    console.log("Saved employeeId: " + jsonResponse.id);
});
