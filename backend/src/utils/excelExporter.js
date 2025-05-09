const ExcelJS = require('exceljs');
const logger = require('./logger');

/**
 * Excel Exporter Utility
 * Generate Excel reports for various data exports
 */
class ExcelExporter {
  /**
   * Generate attendance report Excel workbook
   * @param {Object} reportData - Attendance report data
   * @param {Object} options - Report options
   * @returns {Promise<Buffer>} Excel file buffer
   */
  async generateAttendanceReport(reportData, options = {}) {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Attendance System';
      workbook.lastModifiedBy = 'Attendance System';
      workbook.created = new Date();
      workbook.modified = new Date();
      
      // Create summary worksheet
      const summarySheet = workbook.addWorksheet('Summary');
      this._formatSummarySheet(summarySheet, reportData, options);
      
      // Create detailed worksheet if requested
      if (options.includeDetailedLogs) {
        const detailsSheet = workbook.addWorksheet('Details');
        this._formatDetailsSheet(detailsSheet, reportData, options);
      }
      
      // Create department summary if multiple departments
      if (this._hasDepartments(reportData)) {
        const deptSheet = workbook.addWorksheet('By Department');
        this._formatDepartmentSheet(deptSheet, reportData, options);
      }
      
      // Return as buffer
      return await workbook.xlsx.writeBuffer();
    } catch (error) {
      logger.error(`Excel attendance report generation error: ${error.message}`);
      throw new Error('Failed to generate attendance report');
    }
  }
  
  /**
   * Generate device logs report Excel workbook
   * @param {Array} logs - Device logs data
   * @returns {Promise<Buffer>} Excel file buffer
   */
  async generateDeviceLogsReport(logs) {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Attendance System';
      workbook.lastModifiedBy = 'Attendance System';
      workbook.created = new Date();
      workbook.modified = new Date();
      
      // Create main worksheet
      const sheet = workbook.addWorksheet('Device Logs');
      
      // Set columns
      sheet.columns = [
        { header: 'Date', key: 'date', width: 12 },
        { header: 'User', key: 'user', width: 20 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Device ID', key: 'deviceId', width: 20 },
        { header: 'Device Name', key: 'deviceName', width: 20 },
        { header: 'Device Model', key: 'deviceModel', width: 20 },
        { header: 'Login Time', key: 'loginTime', width: 12 },
        { header: 'Logout Time', key: 'logoutTime', width: 12 },
        { header: 'IP Address', key: 'ipAddress', width: 15 },
        { header: 'Location', key: 'location', width: 20 }
      ];
      
      // Style header row
      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' }
      };
      sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      
      // Add data rows
      logs.forEach(log => {
        // Safely handle location data
        const locationStr = log.location_lat && log.location_long ? 
          `${log.location_lat}, ${log.location_long}` : 'N/A';
          
        // Safely handle User association
        const userName = log.User ? log.User.name : 'Unknown';
        const userEmail = log.User ? log.User.email : 'Unknown';
        
        sheet.addRow({
          date: log.login_time ? new Date(log.login_time).toLocaleDateString() : 'N/A',
          user: userName,
          email: userEmail,
          deviceId: log.device_id || 'N/A',
          deviceName: log.device_name || 'N/A',
          deviceModel: log.device_model || 'N/A',
          loginTime: log.login_time ? new Date(log.login_time).toLocaleTimeString() : 'N/A',
          logoutTime: log.logout_time ? new Date(log.logout_time).toLocaleTimeString() : 'N/A',
          ipAddress: log.ip_address || 'N/A',
          location: locationStr
        });
      });
      
      // Return as buffer
      return await workbook.xlsx.writeBuffer();
    } catch (error) {
      logger.error(`Excel device logs report generation error: ${error.message}`);
      throw new Error('Failed to generate device logs report');
    }
  }
  
  /**
   * Generate employees report Excel workbook
   * @param {Array} employees - Employees data
   * @returns {Promise<Buffer>} Excel file buffer
   */
  async generateEmployeesReport(employees) {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Attendance System';
      workbook.lastModifiedBy = 'Attendance System';
      workbook.created = new Date();
      workbook.modified = new Date();
      
      // Create main worksheet
      const sheet = workbook.addWorksheet('Employees');
      
      // Set columns
      sheet.columns = [
        { header: 'ID', key: 'id', width: 36 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Role', key: 'role', width: 10 },
        { header: 'Department', key: 'department', width: 20 },
        { header: 'Position', key: 'position', width: 20 },
        { header: 'Created At', key: 'createdAt', width: 15 },
        { header: 'Updated At', key: 'updatedAt', width: 15 }
      ];
      
      // Style header row
      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' }
      };
      sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      
      // Add data rows
      employees.forEach(employee => {
        // Safely handle nested data from Sequelize associations
        const deptName = employee.Department ? employee.Department.name : 'Not assigned';
        const posName = employee.Position ? employee.Position.name : 'Not assigned';
        
        sheet.addRow({
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          department: deptName,
          position: posName,
          createdAt: employee.created_at || employee.createdAt ? 
                    new Date(employee.created_at || employee.createdAt).toLocaleString() : 'N/A',
          updatedAt: employee.updated_at || employee.updatedAt ? 
                    new Date(employee.updated_at || employee.updatedAt).toLocaleString() : 'N/A'
        });
      });
      
      // Return as buffer
      return await workbook.xlsx.writeBuffer();
    } catch (error) {
      logger.error(`Excel employees report generation error: ${error.message}`);
      throw new Error('Failed to generate employees report');
    }
  }
  
  /**
   * Format attendance summary sheet
   * @param {Object} sheet - Excel worksheet
   * @param {Object} reportData - Attendance report data
   * @param {Object} options - Report options
   * @private
   */
  _formatSummarySheet(sheet, reportData, options) {
    // Set columns
    sheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Present Days', key: 'present', width: 15 },
      { header: 'Late Days', key: 'late', width: 15 },
      { header: 'Absent Days', key: 'absent', width: 15 },
      { header: 'Total Work Hours', key: 'hours', width: 18 }
    ];
    
    // Style header row
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    
    // Add title and period
    sheet.addRow([`Attendance Report: ${reportData.period.start} to ${reportData.period.end}`]);
    sheet.mergeCells(`A${sheet.rowCount}:F${sheet.rowCount}`);
    sheet.getRow(sheet.rowCount).font = { bold: true, size: 14 };
    sheet.getRow(sheet.rowCount).alignment = { horizontal: 'center' };
    sheet.addRow([]);
    
    // Add overall statistics
    sheet.addRow(['Overall Statistics']);
    sheet.getRow(sheet.rowCount).font = { bold: true, size: 12 };
    sheet.addRow(['Total Users', reportData.statistics.totalUsers]);
    sheet.addRow(['Total Work Hours', reportData.statistics.totalWorkHours]);
    sheet.addRow(['Average Hours Per User', reportData.statistics.averageWorkHoursPerUser]);
    sheet.addRow(['Present Count', reportData.statistics.presentCount]);
    sheet.addRow(['Late Count', reportData.statistics.lateCount]);
    sheet.addRow(['Absent Count', reportData.statistics.absentCount]);
    sheet.addRow([]);
    
    // Add data header
    sheet.addRow(['User Attendance Summary']);
    sheet.getRow(sheet.rowCount).font = { bold: true, size: 12 };
    sheet.addRow(['Name', 'Department', 'Present Days', 'Late Days', 'Absent Days', 'Total Work Hours']);
    
    // Style data header
    const headerRowIndex = sheet.rowCount;
    sheet.getRow(headerRowIndex).font = { bold: true };
    sheet.getRow(headerRowIndex).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC0C0C0' }
    };
    
    // Add data rows
    reportData.users.forEach(userData => {
      sheet.addRow([
        userData.user.name,
        userData.user.department || 'Not assigned',
        userData.summary.present,
        userData.summary.late,
        userData.summary.absent,
        userData.summary.totalWorkHours.toFixed(2)
      ]);
    });
    
    // Add conditional formatting - highlight cells based on thresholds
    const dataStartRow = headerRowIndex + 1;
    const dataEndRow = sheet.rowCount;
    
    // Present days (good = green)
    this._addConditionalFormatting(sheet, `C${dataStartRow}:C${dataEndRow}`, {
      type: 'iconSet',
      iconSet: {
        cfvo: [{ type: 'num', val: 0 }, { type: 'num', val: 5 }, { type: 'num', val: 10 }],
        cfIcon: ['redIcon', 'yellowIcon', 'greenIcon'],
        showValue: true,
        iconOnly: false
      }
    });
    
    // Late days (more = redder)
    this._addConditionalFormatting(sheet, `D${dataStartRow}:D${dataEndRow}`, {
      type: 'colorScale',
      colorScale: {
        cfvo: [
          { type: 'num', val: 0 },
          { type: 'num', val: 5 }
        ],
        color: [
          { argb: 'FFFFFF' },
          { argb: 'FFFF0000' }
        ]
      }
    });
  }
  
  /**
   * Format attendance details sheet
   * @param {Object} sheet - Excel worksheet
   * @param {Object} reportData - Attendance report data
   * @param {Object} options - Report options
   * @private
   */
  _formatDetailsSheet(sheet, reportData, options) {
    // Set columns
    sheet.columns = [
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Clock In', key: 'clockIn', width: 12 },
      { header: 'Clock Out', key: 'clockOut', width: 12 },
      { header: 'Work Hours', key: 'workHours', width: 12 },
      { header: 'Status', key: 'status', width: 10 }
    ];
    
    // Style header row
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    
    // Add all attendance records
    reportData.users.forEach(userData => {
      userData.attendance.forEach(record => {
        const clockIn = record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : 'N/A';
        const clockOut = record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : 'N/A';
        
        sheet.addRow({
          date: new Date(record.date).toLocaleDateString(),
          name: userData.user.name,
          department: userData.user.department || 'Not assigned',
          clockIn: clockIn,
          clockOut: clockOut,
          workHours: record.workHours ? record.workHours.toFixed(2) : 'N/A',
          status: record.status
        });
        
        // Style status cell
        const statusCell = sheet.getCell(`G${sheet.rowCount}`);
        switch(record.status) {
          case 'present':
            statusCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF92D050' } // Green
            };
            break;
          case 'late':
            statusCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFCC00' } // Yellow
            };
            break;
          case 'absent':
            statusCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF0000' } // Red
            };
            break;
        }
      });
    });
  }
  
  /**
   * Format department summary sheet
   * @param {Object} sheet - Excel worksheet
   * @param {Object} reportData - Attendance report data
   * @param {Object} options - Report options
   * @private
   */
  _formatDepartmentSheet(sheet, reportData, options) {
    // Set columns
    sheet.columns = [
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Employee Count', key: 'count', width: 15 },
      { header: 'Present Days', key: 'present', width: 15 },
      { header: 'Late Days', key: 'late', width: 15 },
      { header: 'Absent Days', key: 'absent', width: 15 },
      { header: 'Total Work Hours', key: 'hours', width: 18 },
      { header: 'Avg Hours/Employee', key: 'avgHours', width: 20 }
    ];
    
    // Style header row
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    
    // Group users by department
    const departmentData = {};
    
    reportData.users.forEach(userData => {
      const deptName = userData.user.department || 'Not assigned';
      
      if (!departmentData[deptName]) {
        departmentData[deptName] = {
          count: 0,
          present: 0,
          late: 0,
          absent: 0,
          hours: 0
        };
      }
      
      departmentData[deptName].count++;
      departmentData[deptName].present += userData.summary.present;
      departmentData[deptName].late += userData.summary.late;
      departmentData[deptName].absent += userData.summary.absent;
      departmentData[deptName].hours += userData.summary.totalWorkHours;
    });
    
    // Add department rows
    Object.entries(departmentData).forEach(([department, data]) => {
      sheet.addRow({
        department,
        count: data.count,
        present: data.present,
        late: data.late,
        absent: data.absent,
        hours: data.hours.toFixed(2),
        avgHours: (data.hours / data.count).toFixed(2)
      });
    });
    
    // Add chart
    const chart = sheet.workbook.addChart('column', {
      title: { name: 'Department Attendance Comparison' },
      legend: { position: 'right' },
      plotArea: {
        dataTable: {
          showHorizontalBorder: true,
          showVerticalBorder: true,
          showOutline: true
        }
      }
    });
    
    // Add data series for present days
    chart.addSeries({
      name: 'Present Days',
      categories: [`'By Department'!$A$2:$A$${1 + Object.keys(departmentData).length}`],
      values: [`'By Department'!$C$2:$C$${1 + Object.keys(departmentData).length}`]
    });
    
    // Add data series for late days
    chart.addSeries({
      name: 'Late Days',
      categories: [`'By Department'!$A$2:$A$${1 + Object.keys(departmentData).length}`],
      values: [`'By Department'!$D$2:$D$${1 + Object.keys(departmentData).length}`]
    });
    
    // Add data series for absent days
    chart.addSeries({
      name: 'Absent Days',
      categories: [`'By Department'!$A$2:$A$${1 + Object.keys(departmentData).length}`],
      values: [`'By Department'!$E$2:$E$${1 + Object.keys(departmentData).length}`]
    });
    
    // Add to sheet
    sheet.addRow([]);
    sheet.addRow(['Department Attendance Chart']);
    chart.addDataPointValue(sheet.rowCount);
    sheet.addImage(chart, {
      tl: { col: 1, row: sheet.rowCount },
      br: { col: 8, row: sheet.rowCount + 20 }
    });
  }
  
  /**
   * Check if report has multiple departments
   * @param {Object} reportData - Attendance report data
   * @returns {boolean} - True if multiple departments
   * @private
   */
  _hasDepartments(reportData) {
    const departments = new Set();
    
    reportData.users.forEach(userData => {
      departments.add(userData.user.department || 'Not assigned');
    });
    
    return departments.size > 1;
  }
  
  /**
   * Add conditional formatting to cells
   * @param {Object} sheet - Excel worksheet
   * @param {string} range - Cell range
   * @param {Object} options - Conditional formatting options
   * @private
   */
  _addConditionalFormatting(sheet, range, options) {
    sheet.addConditionalFormatting({
      ref: range,
      ...options
    });
  }
}

module.exports = new ExcelExporter();