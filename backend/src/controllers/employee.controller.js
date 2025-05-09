const { User, Position, Department, AttendanceLog } = require('../models');
const { Op } = require('sequelize');
const excelExporter = require('../utils/excelExporter');
const logger = require('../utils/logger');

// Get all employees
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        { model: Position },
        { model: Department }
      ],
      order: [['name', 'ASC']]
    });

    return res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

// Get employee by ID
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const employee = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Position },
        { model: Department }
      ]
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

// Create new employee
const createEmployee = async (req, res, next) => {
  try {
    const { name, email, password, role, position_id, dept_id } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if employee with that email already exists
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Validate position_id if provided
    if (position_id) {
      const position = await Position.findByPk(position_id);
      if (!position) {
        return res.status(400).json({ message: 'Invalid position ID' });
      }
    }

    // Validate dept_id if provided
    if (dept_id) {
      const department = await Department.findByPk(dept_id);
      if (!department) {
        return res.status(400).json({ message: 'Invalid department ID' });
      }
    }

    // Create new employee with validated data
    const newEmployee = await User.create({
      name,
      email,
      password,
      role: role || 'employee',
      position_id: position_id || null,
      dept_id: dept_id || null
    });

    // Return newly created employee (exclude password)
    const employeeData = await User.findByPk(newEmployee.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Position },
        { model: Department }
      ]
    });

    return res.status(201).json(employeeData);
  } catch (error) {
    logger.error('Create employee error:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(e => e.message)
      });
    }
    return res.status(500).json({ message: 'Failed to create employee', error: error.message });
  }
};

// Update employee
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, position_id, dept_id } = req.body;
    
    // Validate UUID format
    if (!id || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return res.status(400).json({ message: 'Invalid employee ID format' });
    }
    
    // Check if employee exists
    const employee = await User.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if new email is already in use by another employee
    if (email && email !== employee.email) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: id }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use by another employee' });
      }
    }
    
    // Validate position_id if provided
    if (position_id) {
      const position = await Position.findByPk(position_id);
      if (!position) {
        return res.status(400).json({ message: 'Invalid position ID' });
      }
    }

    // Validate dept_id if provided
    if (dept_id) {
      const department = await Department.findByPk(dept_id);
      if (!department) {
        return res.status(400).json({ message: 'Invalid department ID' });
      }
    }

    // Update employee
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(password && { password }),
      ...(role && { role }),
      ...(position_id !== undefined && { position_id }),
      ...(dept_id !== undefined && { dept_id })
    };

    await employee.update(updateData);

    // Return updated employee (exclude password)
    const updatedEmployee = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Position },
        { model: Department }
      ]
    });

    return res.status(200).json(updatedEmployee);
  } catch (error) {
    logger.error('Update employee error:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(e => e.message)
      });
    }
    return res.status(500).json({ message: 'Failed to update employee', error: error.message });
  }
};

// Delete employee
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!id || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return res.status(400).json({ message: 'Invalid employee ID format' });
    }
    
    // Check if employee exists
    const employee = await User.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if the employee has related records (such as attendance)
    const attendanceCount = await AttendanceLog.count({ where: { user_id: id } });
    
    if (attendanceCount > 0) {
      // Instead of preventing deletion, you can choose to handle this as needed
      // For now, we'll allow deletion but log a warning
      logger.warn(`Deleting employee ${id} with ${attendanceCount} attendance records`);
    }

    // Delete employee
    await employee.destroy();

    return res.status(200).json({ message: 'Employee successfully deleted' });
  } catch (error) {
    logger.error('Delete employee error:', error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Cannot delete employee. They have related records in the system.' });
    }
    return res.status(500).json({ message: 'Failed to delete employee', error: error.message });
  }
};

// Import employees from file (CSV/Excel)
const importEmployees = async (req, res, next) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an Excel file (.xlsx)' });
    }

    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    
    // Read from the uploaded file buffer
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.getWorksheet(1); // Get the first worksheet
    
    if (!worksheet) {
      return res.status(400).json({ message: 'Excel file has no worksheets' });
    }

    const employees = [];
    const errors = [];
    let successCount = 0;
    
    // Skip header row, start from row 2
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      
      // Check if row has data
      if (!row.getCell(1).value) continue;
      
      const employee = {
        name: row.getCell(1).value,
        email: row.getCell(2).value,
        password: row.getCell(3).value || 'employee123', // Default password if not provided
        role: row.getCell(4).value || 'employee',
        position_id: row.getCell(5).value,
        dept_id: row.getCell(6).value
      };
      
      try {
        // Validate required fields
        if (!employee.name || !employee.email) {
          errors.push({ row: i, error: 'Name and email are required', data: employee });
          continue;
        }

        // Check if employee with that email already exists
        const existingUser = await User.findOne({ where: { email: employee.email } });
        
        if (existingUser) {
          errors.push({ row: i, error: 'Email already in use', data: employee });
          continue;
        }

        // Validate position_id if provided
        if (employee.position_id) {
          const position = await Position.findByPk(employee.position_id);
          if (!position) {
            errors.push({ row: i, error: 'Invalid position ID', data: employee });
            continue;
          }
        }

        // Validate dept_id if provided
        if (employee.dept_id) {
          const department = await Department.findByPk(employee.dept_id);
          if (!department) {
            errors.push({ row: i, error: 'Invalid department ID', data: employee });
            continue;
          }
        }

        // Create new employee
        await User.create(employee);
        successCount++;
        employees.push({ row: i, data: employee });
      } catch (error) {
        logger.error(`Error processing employee at row ${i}:`, error);
        errors.push({ row: i, error: error.message, data: employee });
      }
    }
    
    return res.status(200).json({
      message: `Imported ${successCount} employees successfully, ${errors.length} errors`,
      successful: employees,
      errors: errors
    });
  } catch (error) {
    logger.error('Import employees error:', error);
    return res.status(500).json({ message: 'Failed to import employees', error: error.message });
  }
};

// Export employees to file
const exportEmployees = async (req, res, next) => {
  try {
    const { format, departmentId, positionId } = req.query;
    
    // Build where clause for filtering
    let whereClause = {};
    
    if (departmentId) {
      whereClause.dept_id = departmentId;
    }
    
    if (positionId) {
      whereClause.position_id = positionId;
    }
    
    // Fetch employees with their relations
    const employees = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      include: [
        { model: Position },
        { model: Department }
      ],
      order: [['name', 'ASC']]
    });
    
    // If format is not specified or is not Excel, return JSON
    if (!format || format.toLowerCase() !== 'excel') {
      return res.status(200).json({
        exportedAt: new Date(),
        employees
      });
    }
    
    // Generate Excel file
    const excelBuffer = await excelExporter.generateEmployeesReport(employees);
    
    // Set headers for Excel download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=employees-${new Date().toISOString().split('T')[0]}.xlsx`);
    res.setHeader('Content-Length', excelBuffer.length);
    
    // Send the Excel file
    return res.send(excelBuffer);
  } catch (error) {
    logger.error('Export employees error:', error);
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  importEmployees,
  exportEmployees
};