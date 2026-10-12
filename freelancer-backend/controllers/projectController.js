const Project = require('../models/Project');
const User = require('../models/User');

// Создание проекта
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, skillsRequired, budget, deadline } = req.body;

    const project = new Project({
      title,
      description,
      client: req.user._id,
      category,
      skillsRequired,
      budget,
      deadline: new Date(deadline),
      status: 'open'
    });

    await project.save();

    // Популяция данных клиента
    await project.populate('client', 'username fullName avatar rating');

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};

// Получение всех проектов (с фильтрацией)
exports.getProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      minBudget,
      maxBudget,
      search,
      skills
    } = req.query;

    const query = {};

    // Фильтр по статусу
    if (status) {
      query.status = status;
    } else {
      query.status = 'open'; // По умолчанию показываем открытые проекты
    }

    // Фильтр по категории
    if (category) {
      query.category = category;
    }

    // Фильтр по бюджету
    if (minBudget || maxBudget) {
      query['budget.min'] = {};
      if (minBudget) query['budget.min'].$gte = Number(minBudget);
      if (maxBudget) query['budget.min'].$lte = Number(maxBudget);
    }

    // Поиск по тексту
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Фильтр по навыкам
    if (skills) {
      const skillsArray = skills.split(',');
      query.skillsRequired = { $in: skillsArray };
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const projects = await Project.find(query)
      .populate('client', 'username fullName avatar rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Failed to get projects', error: error.message });
  }
};

// Получение проекта по ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'username fullName avatar rating')
      .populate('proposals.freelancer', 'username fullName avatar rating bio skills');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Failed to get project', error: error.message });
  }
};

// Обновление проекта
exports.updateProject = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['title', 'description', 'category', 'skillsRequired', 'budget', 'deadline', 'status'];

    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (filteredUpdates.deadline) {
      filteredUpdates.deadline = new Date(filteredUpdates.deadline);
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, client: req.user._id },
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).populate('client', 'username fullName avatar rating');

    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
};

// Удаление проекта
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      client: req.user._id,
      status: 'open'
    });

    if (!project) {
      return res.status(404).json({
        message: 'Project not found, unauthorized, or cannot delete non-open projects'
      });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};

// Получение проектов пользователя
exports.getMyProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { client: req.user._id };

    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate('client', 'username fullName avatar rating')
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({ message: 'Failed to get projects', error: error.message });
  }
};