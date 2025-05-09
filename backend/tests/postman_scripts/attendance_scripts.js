/**
 * Pre-request script for Clock In
 * This script helps with preparing location and device data for clock in
 */
// Create test data for clock in
const clockInData = {
    latitude: 37.7749,
    longitude: -122.4194,
    device_id: "test-device-" + Date.now(),
    device_name: "Test Device",
    device_model: "Test Model",
    notes: "Test clock in from Postman"
};

// Set the JSON body for the Clock In request
pm.variables.set("clockInBody", JSON.stringify(clockInData));

/**
 * Test script for Clock In
 * This script captures the attendance ID and stores it in environment variables
 */
pm.test("Clock In successful", function() {
    const jsonResponse = pm.response.json();
    pm.expect(jsonResponse.data).to.exist;
    pm.expect(jsonResponse.data.id).to.exist;
    
    // Save attendance ID to environment variable
    pm.environment.set("attendanceId", jsonResponse.data.id);
    console.log("Saved attendanceId: " + jsonResponse.data.id);
});
