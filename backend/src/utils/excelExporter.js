// Excel export utility for attendance system
const Excel = require('exceljs');
const logger = require('./logger');

/**
 * Generate an Excel file for attendance report
 * @param {Object} reportData - The report data to export
 * @param {Object} options - Export options
 * @returns {Promise<Buffer>} Excel file as buffer
 */
const generateAttendanceReport = async (reportData, options = {}) => {
  try {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Report');
    
    // Set up report title and metadata
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Attendance Report';
    titleCell.font = {
      size: 16,
      bold: true
    };
    titleCell.alignment = { horizontal: 'center' };
    
    // Add date range
    worksheet.mergeCells('A2:H2');
    const dateRangeCell = worksheet.getCell('A2');
    dateRangeCell.value = `Period: ${reportData.period.start} to ${reportData.period.end}`;
    dateRangeCell.font = { italic: true };
    dateRangeCell.alignment = { horizontal: 'center' };
    
    // Add empty row
    worksheet.addRow([]);
    
    // Add statistics summary
    worksheet.addRow(['Statistics Summary']);
    worksheet.lastRow.font = { bold: true };
    
    worksheet.addRow([
      'Total Users', 
      'Total Work Hours', 
      'Average Hours/User',
      'Present Count',
      'Late Count',
      'Absent Count'
    ]);
    worksheet.lastRow.font = { bold: true };
    
    worksheet.addRow([
      reportData.statistics.totalUsers,
      reportData.statistics.totalWorkHours,
      reportData.statistics.averageWorkHoursPerUser,
      reportData.statistics.presentCount,
      reportData.statistics.lateCount,
      reportData.statistics.absentCount
    ]);
    
    // Add empty row
    worksheet.addRow([]);
    
    // Add detailed report header
    worksheet.addRow(['Detailed Attendance Report']);
    worksheet.lastRow.font = { bold: true };
    
    // Add headers row
    worksheet.addRow([
      'Employee', 
      'Department', 
      'Total Work Hours', 
      'Present Days', 
      'Late Days', 
      'Absent Days'
    ]);
    worksheet.lastRow.font = { bold: true };
    worksheet.lastRow.alignment = { horizontal: 'center' };
    
    // Format header row
    const headerRow = worksheet.lastRow;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' } // Light grey
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    
    // Add data rows for each user
    reportData.users.forEach(userData => {
      worksheet.addRow([
        userData.user.name,
        userData.user.department || 'N/A',
        userData.summary.totalWorkHours,
        userData.summary.present,
        userData.summary.late,
        userData.summary.absent
      ]);
      
      // Format data row
      const dataRow = worksheet.lastRow;
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    
    // Add detailed attendance for each user (optional based on options)
    if (options.includeDetailedLogs) {
      worksheet.addRow([]);
      worksheet.addRow(['Detailed Daily Logs']);
      worksheet.lastRow.font = { bold: true };
      
      const detailSheet = workbook.addWorksheet('Daily Details');
      
      // Set up headers for detail sheet
      detailSheet.addRow([
        'Date', 
        'Employee', 
        'Department', 
        'Clock In', 
        'Clock Out', 
        'Work Hours', 
        'Status'
      ]);
      detailSheet.lastRow.font = { bold: true };
      
      // Format header row
      const detailHeaderRow = detailSheet.lastRow;
      detailHeaderRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD3D3D3' } // Light grey
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      
      // Add all attendance records
      reportData.users.forEach(userData => {
        userData.attendance.forEach(record => {
          const clockIn = record.clockIn ? new Date(record.clockIn).toLocaleString() : 'N/A';
          const clockOut = record.clockOut ? new Date(record.clockOut).toLocaleString() : 'N/A';
          
          detailSheet.addRow([
            new Date(record.date).toLocaleDateString(),
            userData.user.name,
            userData.user.department || 'N/A',
            clockIn,
            clockOut,
            record.workHours || 0,
            record.status
          ]);
        });
      });
      
      // Auto-fit columns for detail sheet
      detailSheet.columns.forEach(column => {
        column.width = 20;
      });
    }
    
    // Auto-fit columns for main sheet
    worksheet.columns.forEach(column => {
      column.width = 20;
    });
    
    // Generate Excel buffer
    return await workbook.xlsx.writeBuffer();
    
  } catch (error) {
    logger.error(`Error generating Excel report: ${error.message}`);
    throw error;
  }
};

/**
 * Generate an Excel file for employee data
 * @param {Array} employeesData - The employee data to export
 * @returns {Promise<Buffer>} Excel file as buffer
 */
const generateEmployeesReport = async (employeesData) => {
  try {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Employees');
    
    // Set up report title
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Employees Report';
    titleCell.font = {
      size: 16,
      bold: true
    };
    titleCell.alignment = { horizontal: 'center' };
    
    // Add date generated
    worksheet.mergeCells('A2:G2');
    const dateCell = worksheet.getCell('A2');
    dateCell.value = `Generated on: ${new Date().toLocaleDateString()}`;
    dateCell.font = { italic: true };
    dateCell.alignment = { horizontal: 'center' };
    
    // Add empty row
    worksheet.addRow([]);
    
    // Add headers row
    worksheet.addRow([
      'Name',
      'Email',
      'Role',
      'Department',
      'Position',
      'Created At',
      'Updated At'
    ]);
    worksheet.lastRow.font = { bold: true };
    
    // Format header row
    const headerRow = worksheet.lastRow;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' } // Light grey
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    
    // Add data rows
    employeesData.forEach(employee => {
      worksheet.addRow([
        employee.name,
        employee.email,
        employee.role,
        employee.department ? employee.department.name : 'N/A',
        employee.position ? employee.position.name : 'N/A',
        new Date(employee.created_at).toLocaleDateString(),
        new Date(employee.updated_at).toLocaleDateString()
      ]);
      
      // Format data row
      const dataRow = worksheet.lastRow;
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    
    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 18;
    });
    
    // Generate Excel buffer
    return await workbook.xlsx.writeBuffer();
    
  } catch (error) {
    logger.error(`Error generating employee Excel report: ${error.message}`);
    throw error;
  }
};

/**
 * Generate an Excel file for device logs
 * @param {Array} deviceLogsData - The device logs to export
 * @returns {Promise<Buffer>} Excel file as buffer
 */
const generateDeviceLogsReport = async (deviceLogsData) => {
  try {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Device Logs');
    
    // Set up report title
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Device Logs Report';
    titleCell.font = {
      size: 16,
      bold: true
    };
    titleCell.alignment = { horizontal: 'center' };
    
    // Add date generated
    worksheet.mergeCells('A2:H2');
    const dateCell = worksheet.getCell('A2');
    dateCell.value = `Generated on: ${new Date().toLocaleDateString()}`;
    dateCell.font = { italic: true };
    dateCell.alignment = { horizontal: 'center' };
    
    // Add empty row
    worksheet.addRow([]);
    
    // Add headers row
    worksheet.addRow([
      'User',
      'Device ID',
      'Device Name',
      'Device Model',
      'Login Time',
      'Logout Time',
      'IP Address',
      'Location'
    ]);
    worksheet.lastRow.font = { bold: true };
    
    // Format header row
    const headerRow = worksheet.lastRow;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' } // Light grey
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    
    // Add data rows
    deviceLogsData.forEach(log => {
      const loginTime = log.login_time ? new Date(log.login_time).toLocaleString() : 'N/A';
      const logoutTime = log.logout_time ? new Date(log.logout_time).toLocaleString() : 'N/A';
      const location = (log.location_lat && log.location_long) 
        ? `${log.location_lat}, ${log.location_long}` 
        : 'N/A';
      
      worksheet.addRow([
        log.user ? log.user.name : 'Unknown',
        log.device_id,
        log.device_name,
        log.device_model,
        loginTime,
        logoutTime,
        log.ip_address,
        location
      ]);
      
      // Format data row
      const dataRow = worksheet.lastRow;
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    
    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 20;
    });
    
    // Generate Excel buffer
    return await workbook.xlsx.writeBuffer();
    
  } catch (error) {
    logger.error(`Error generating device logs Excel report: ${error.message}`);
    throw error;
  }
};

module.exports = {
  generateAttendanceReport,
  generateEmployeesReport,
  generateDeviceLogsReport
};