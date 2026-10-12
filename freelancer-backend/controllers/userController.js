const User = require('../models/User');

// Получение всех пользователей (админ)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
};

// Получение пользователя по ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Проверка прав доступа (пользователь может видеть свой профиль или любой публичный профиль)
    if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      // Для публичных профилей показываем только основную информацию
      const publicProfile = {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        rating: user.rating,
        completedProjects: user.completedProjects,
        role: user.role,
        createdAt: user.createdAt
      };
      return res.json({ user: publicProfile });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};

// Получение фрилансеров
exports.getFreelancers = async (req, res) => {
  try {
    const { page = 1, limit = 10, skills, minRating, search } = req.query;

    const query = { role: 'freelancer' };

    // Фильтр по навыкам
    if (skills) {
      const skillsArray = skills.split(',');
      query.skills = { $in: skillsArray };
    }

    // Фильтр по рейтингу
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Поиск по тексту
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const freelancers = await User.find(query)
      .select('-password -email -balance -isVerified')
      .sort({ rating: -1, completedProjects: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await User.countDocuments(query);

    res.json({
      freelancers,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Get freelancers error:', error);
    res.status(500).json({ message: 'Failed to get freelancers', error: error.message });
  }
};

// Обновление пользователя
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Проверка прав доступа
    if (id !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const allowedUpdates = ['fullName', 'bio', 'skills', 'avatar', 'role', 'balance', 'isVerified'];
    if (req.user.role !== 'admin') {
      // Не-админы не могут менять роль, баланс и статус верификации
      const nonAdminAllowed = allowedUpdates.filter(field => !['role', 'balance', 'isVerified'].includes(field));
      Object.keys(updates).forEach(key => {
        if (!nonAdminAllowed.includes(key)) {
          delete updates[key];
        }
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// Удаление пользователя
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверка прав доступа
    if (id !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// Получение профиля текущего пользователя
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
};