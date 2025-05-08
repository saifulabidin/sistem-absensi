const { Department, User } = require('../models');

// Get all departments
const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findAll({
      order: [['name', 'ASC']]
    });

    return res.status(200).json(departments);
  } catch (error) {
    next(error);
  }
};

// Get department by ID
const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    return res.status(200).json(department);
  } catch (error) {
    next(error);
  }
};

// Create new department
const createDepartment = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Department name is required' });
    }

    // Check if department with that name already exists
    const existingDepartment = await Department.findOne({ where: { name } });
    
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department with that name already exists' });
    }

    // Create new department
    const newDepartment = await Department.create({ name });

    return res.status(201).json(newDepartment);
  } catch (error) {
    next(error);
  }
};

// Update department
const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Department name is required' });
    }

    // Check if department exists
    const department = await Department.findByPk(id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if another department with the new name already exists
    if (name !== department.name) {
      const existingDepartment = await Department.findOne({ 
        where: { name }
      });
      
      if (existingDepartment) {
        return res.status(400).json({ message: 'Department with that name already exists' });
      }
    }

    // Update department
    await department.update({ name });

    return res.status(200).json(department);
  } catch (error) {
    next(error);
  }
};

// Delete department
const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if department exists
    const department = await Department.findByPk(id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if there are employees in this department
    const employeesInDepartment = await User.count({ where: { dept_id: id } });
    
    if (employeesInDepartment > 0) {
      return res.status(400).json({ 
        message: `Cannot delete department with ${employeesInDepartment} employees. Reassign employees first.` 
      });
    }

    // Delete department
    await department.destroy();

    return res.status(200).json({ message: 'Department successfully deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};