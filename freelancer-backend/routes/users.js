const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

// Получение всех пользователей (только админ)
router.get('/', auth, isAdmin, userController.getAllUsers);

// Получение пользователя по ID (доступно всем авторизованным)
router.get('/:id', auth, userController.getUserById);

// Получение фрилансеров (доступно всем)
router.get('/freelancers/list', userController.getFreelancers);

// Обновление пользователя (только владелец или админ)
router.put('/:id', auth, userController.updateUser);

// Удаление пользователя (только владелец или админ)
router.delete('/:id', auth, userController.deleteUser);

// Получение профиля текущего пользователя (уже есть в auth routes)
// Это дублируется для единообразия
router.get('/me/profile', auth, userController.getMyProfile);

module.exports = router;