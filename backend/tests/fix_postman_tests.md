# Postman Test Fixes for Attendance System API

## 1. Create Employee Fix
The "Create Employee" request is returning a 400 Bad Request error because it's missing required fields or has invalid data.

### Fix:
Update the request body to include all required fields:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "employee"
}
```

## 2. Update/Delete Employee Fix
The "Update Employee" and "Delete Employee" requests fail with 404 Not Found because they're using a placeholder `:id` instead of an actual employee ID.

### Fix:
1. Add a Pre-request Script to "Get All Employees" to capture an ID:

```javascript
pm.test("Save employee ID from response", function() {
    const jsonResponse = pm.response.json();
    if (jsonResponse && jsonResponse.length > 0) {
        pm.environment.set("employeeId", jsonResponse[0].id);
        console.log("Saved employeeId: " + jsonResponse[0].id);
    }
});
```

2. Update the request URL from:
```
{{baseUrl}}/api/employees/:id
```
to:
```
{{baseUrl}}/api/employees/{{employeeId}}
```

## 3. Import Employees Fix
The "Import Employees" endpoint needs a proper file upload.

### Fix:
1. Set the request body to form-data
2. Add a field named "file" with type "file"
3. Select an Excel file with proper format for employees
4. Make sure the headers include "Content-Type: multipart/form-data"

## 4. Clock In/Clock Out Fix
Both "Clock In" and "Clock Out" requests are failing with 400 Bad Request because of missing required data.

### Fix for Clock In:
Update request body to:

```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "device_id": "test-device-123",
  "device_name": "Test Device",
  "device_model": "Test Model"
}
```

### Fix for Clock Out:
1. First make sure you've successfully clocked in
2. Use the same request body as Clock In:

```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "device_id": "test-device-123",
  "device_name": "Test Device",
  "device_model": "Test Model"
}
```

## 5. Get Attendance by ID Fix
Similar to employee endpoints, update the URL from:
```
{{baseUrl}}/api/attendance/:id
```
to:
```
{{baseUrl}}/api/attendance/{{attendanceId}}
```

And add a Pre-request Script to "Get All Attendance Logs" to capture an attendance ID:

```javascript
pm.test("Save attendance ID from response", function() {
    const jsonResponse = pm.response.json();
    if (jsonResponse && jsonResponse.length > 0) {
        pm.environment.set("attendanceId", jsonResponse[0].id);
        console.log("Saved attendanceId: " + jsonResponse[0].id);
    }
});
```

## 6. API Authentication Fix
Make sure all requests that require authentication have the proper Authorization header:

```
Authorization: Bearer {{authToken}}
```

And update the "Login" test script to save the token:

```javascript
pm.test("Response has token", function() {
    const jsonResponse = pm.response.json();
    pm.expect(jsonResponse.token).to.exist;
    
    // Save token to environment variable
    pm.environment.set("authToken", jsonResponse.token);
});
```

## 7. Sequence Fix
Update the collection runner to execute requests in a logical sequence:
1. Login (to get token)
2. Create Department & Position (if needed)
3. Create Employee
4. Update/Delete operations
5. Clock In
6. Clock Out
7. Get reports/logs
