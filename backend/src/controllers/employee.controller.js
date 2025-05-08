const { User, Position, Department } = require('../models');
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

    // Create new employee
    const newEmployee = await User.create({
      name,
      email,
      password,
      role: role || 'employee',
      position_id,
      dept_id
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
    next(error);
  }
};

// Update employee
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, position_id, dept_id } = req.body;
    
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
    next(error);
  }
};

// Delete employee
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if employee exists
    const employee = await User.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete employee
    await employee.destroy();

    return res.status(200).json({ message: 'Employee successfully deleted' });
  } catch (error) {
    next(error);
  }
};

// Import employees from file (CSV/Excel)
// In a real app, you would use a library like csv-parser or xlsx
const importEmployees = async (req, res, next) => {
  try {
    // TO-DO: Implement file upload with multer
    // TO-DO: Parse the uploaded file (CSV/Excel)
    // TO-DO: Validate the data
    // TO-DO: Create employees
    
    return res.status(501).json({ message: 'Import functionality not yet implemented' });
  } catch (error) {
    logger.error('Import employees error:', error);
    next(error);
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