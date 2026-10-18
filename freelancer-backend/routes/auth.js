const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Регистрация
router.post('/register', authController.register);

// Вход
router.post('/login', authController.login);

// Получение текущего пользователя
router.get('/me', auth, authController.getCurrentUser);

// Обновление профиля
router.put('/profile', auth, authController.updateProfile);

// Загрузка аватара
router.post('/upload-avatar', auth, upload.single('avatar'), authController.uploadAvatar);

// Выход
router.post('/logout', auth, authController.logout);

module.exports = router;