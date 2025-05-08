const { Position, User } = require('../models');

// Get all positions
const getAllPositions = async (req, res, next) => {
  try {
    const positions = await Position.findAll({
      order: [['level', 'ASC'], ['name', 'ASC']]
    });

    return res.status(200).json(positions);
  } catch (error) {
    next(error);
  }
};

// Get position by ID
const getPositionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const position = await Position.findByPk(id);

    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    return res.status(200).json(position);
  } catch (error) {
    next(error);
  }
};

// Create new position
const createPosition = async (req, res, next) => {
  try {
    const { name, level } = req.body;
    
    if (!name || level === undefined) {
      return res.status(400).json({ message: 'Position name and level are required' });
    }

    // Check if position with that name already exists
    const existingPosition = await Position.findOne({ where: { name } });
    
    if (existingPosition) {
      return res.status(400).json({ message: 'Position with that name already exists' });
    }

    // Create new position
    const newPosition = await Position.create({ name, level });

    return res.status(201).json(newPosition);
  } catch (error) {
    next(error);
  }
};

// Update position
const updatePosition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, level } = req.body;
    
    // Check if position exists
    const position = await Position.findByPk(id);
    
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    // Check if another position with the new name already exists
    if (name && name !== position.name) {
      const existingPosition = await Position.findOne({ where: { name } });
      
      if (existingPosition) {
        return res.status(400).json({ message: 'Position with that name already exists' });
      }
    }

    // Update position
    const updateData = {
      ...(name && { name }),
      ...(level !== undefined && { level })
    };
    
    await position.update(updateData);

    return res.status(200).json(position);
  } catch (error) {
    next(error);
  }
};

// Delete position
const deletePosition = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if position exists
    const position = await Position.findByPk(id);
    
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    // Check if there are employees with this position
    const employeesWithPosition = await User.count({ where: { position_id: id } });
    
    if (employeesWithPosition > 0) {
      return res.status(400).json({ 
        message: `Cannot delete position with ${employeesWithPosition} employees assigned. Reassign employees first.` 
      });
    }

    // Delete position
    await position.destroy();

    return res.status(200).json({ message: 'Position successfully deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition
};