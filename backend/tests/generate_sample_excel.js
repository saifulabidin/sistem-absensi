// Example Excel file format for importing employees
// Save this as a .js file that you can run in Node.js to generate a sample Excel file for testing

const ExcelJS = require('exceljs');
const path = require('path');

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Employees');

// Add header row
worksheet.addRow(['Name', 'Email', 'Password', 'Role', 'Position ID', 'Department ID']);

// Add sample data rows
worksheet.addRow(['John Smith', 'john.smith@example.com', 'password123', 'employee', '', '']);
worksheet.addRow(['Jane Doe', 'jane.doe@example.com', 'password123', 'employee', '', '']);
worksheet.addRow(['Mike Johnson', 'mike.johnson@example.com', 'password123', 'employee', '', '']);

// Format the header row
worksheet.getRow(1).font = { bold: true };

// Set column widths for better readability
worksheet.columns = [
  { header: 'Name', key: 'name', width: 20 },
  { header: 'Email', key: 'email', width: 30 },
  { header: 'Password', key: 'password', width: 15 },
  { header: 'Role', key: 'role', width: 15 },
  { header: 'Position ID', key: 'position_id', width: 40 },
  { header: 'Department ID', key: 'dept_id', width: 40 }
];

// Save the workbook
const filePath = path.join(__dirname, 'sample_employees.xlsx');
workbook.xlsx.writeFile(filePath)
  .then(() => {
    console.log(`Sample employees Excel file created at: ${filePath}`);
  })
  .catch(err => {
    console.error('Error creating Excel file:', err);
  });
