# Step-by-Step Instructions to Fix Postman Tests

Follow these instructions to update your Postman collection and make all tests pass. You can apply these changes directly in the Postman application.

## 1. Update Authentication Flow

### Login Request:
1. Open the "Login" request in your collection
2. Set the request method to `POST`
3. Set the URL to `{{baseUrl}}/api/auth/login`
4. Set the body type to `raw` and format to `JSON`
5. Add this request body:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```
6. In the "Tests" tab, add this script to save the token:
```javascript
pm.test("Response has token", function() {
    const jsonResponse = pm.response.json();
    pm.expect(jsonResponse.token).to.exist;
    
    // Save token to environment variable
    pm.environment.set("authToken", jsonResponse.token);
});
```

### For all other authenticated requests:
1. In the "Authorization" tab:
   - Type: `Bearer Token`
   - Token: `{{authToken}}`

## 2. Fix Employee Endpoints

### Create Employee:
1. Open the "Create Employee" request
2. Ensure the URL is `{{baseUrl}}/api/employees`
3. Set the body type to `raw` and format to `JSON`
4. Add this request body:
```json
{
  "name": "John Doe",
  "email": "john.doe{{$timestamp}}@example.com",
  "password": "password123",
  "role": "employee"
}
```
5. In the "Tests" tab, add this script to save the new employee ID:
```javascript
pm.test("Save employee ID", function() {
    const jsonResponse = pm.response.json();
    pm.expect(jsonResponse.id).to.exist;
    pm.environment.set("employeeId", jsonResponse.id);
});
```

### Update Employee:
1. Open the "Update Employee" request
2. Change the URL from `{{baseUrl}}/api/employees/:id` to `{{baseUrl}}/api/employees/{{employeeId}}`
3. Set the body:
```json
{
  "name": "Updated Name"
}
```

### Delete Employee:
1. Open the "Delete Employee" request
2. Change the URL from `{{baseUrl}}/api/employees/:id` to `{{baseUrl}}/api/employees/{{employeeId}}`

### Import Employees:
1. Open the "Import Employees" request
2. Set the request body type to `form-data`
3. Add a key named `file` with type `File`
4. Create a sample Excel file with these columns: Name, Email, Password, Role
5. Select your Excel file for the `file` field

## 3. Fix Department & Position Endpoints

### Create Department:
1. Add a "Tests" script to save the created department ID:
```javascript
pm.test("Save department ID", function() {
    const jsonResponse = pm.response.json();
    pm.expect(jsonResponse.id).to.exist;
    pm.environment.set("departmentId", jsonResponse.id);
});
```

### Get/Update/Delete Department:
1. Change all URLs from using specific UUIDs to using the environment variable:
   - `{{baseUrl}}/api/departments/{{departmentId}}`

### Create Position:
1. Add a "Tests" script to save the created position ID:
```javascript
pm.test("Save position ID", function() {
    const jsonResponse = pm.response.json();
    pm.expect(jsonResponse.id).to.exist;
    pm.environment.set("positionId", jsonResponse.id);
});
```

### Get/Update/Delete Position:
1. Change all URLs from using specific UUIDs to using the environment variable:
   - `{{baseUrl}}/api/positions/{{positionId}}`

## 4. Fix Attendance Endpoints

### Clock In:
1. Open the "Clock In" request
2. Ensure the URL is `{{baseUrl}}/api/attendance/clock-in`
3. Set the body:
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "device_id": "test-device-123",
  "device_name": "Test Device",
  "device_model": "Test Model"
}
```
4. Add a "Tests" script to save the attendance ID:
```javascript
pm.test("Save attendance ID", function() {
    const jsonResponse = pm.response.json();
    pm.expect(jsonResponse.data.id).to.exist;
    pm.environment.set("attendanceId", jsonResponse.data.id);
});
```

### Clock Out:
1. Open the "Clock Out" request
2. Ensure the URL is `{{baseUrl}}/api/attendance/clock-out`
3. Use the same body as Clock In

### Get Attendance by ID:
1. Change the URL from `{{baseUrl}}/api/attendance/:id` to `{{baseUrl}}/api/attendance/{{attendanceId}}`

## 5. Running Tests in Proper Sequence

When running the collection:

1. Use Postman's Collection Runner
2. Ensure the following order of requests:
   - Login
   - Create Department
   - Create Position
   - Create Employee
   - Other employee operations
   - Clock In
   - Clock Out
   - Other attendance operations

By following these steps, the interdependencies between requests will be respected and IDs will be properly captured and reused.
