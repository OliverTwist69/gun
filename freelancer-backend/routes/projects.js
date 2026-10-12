const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { auth, isClient } = require('../middleware/auth');

// Создание проекта (только клиенты)
router.post('/', auth, isClient, projectController.createProject);

// Получение всех проектов (доступно всем)
router.get('/', projectController.getProjects);

// Получение проекта по ID (доступно всем)
router.get('/:id', projectController.getProjectById);

// Обновление проекта (только владелец-клиент)
router.put('/:id', auth, isClient, projectController.updateProject);

// Удаление проекта (только владелец-клиент)
router.delete('/:id', auth, isClient, projectController.deleteProject);

// Получение проектов текущего пользователя
router.get('/my/projects', auth, isClient, projectController.getMyProjects);

module.exports = router;