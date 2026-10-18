import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0,
    averageRating: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'client') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Загрузка статистики
      const projectsResponse = await axios.get(`${API_URL}/projects/my/projects`);
      const projects = projectsResponse.data.projects;

      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => p.status === 'in_progress').length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;

      // Расчет общей суммы потраченных средств (упрощенно)
      const totalSpent = projects
        .filter(p => p.status === 'completed')
        .reduce((sum, project) => {
          const proposals = project.proposals || [];
          const acceptedProposal = proposals.find(p => p.status === 'accepted');
          return sum + (acceptedProposal?.bidAmount || 0);
        }, 0);

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalSpent,
        averageRating: user?.rating || 0
      });

      // Последние проекты
      setRecentProjects(projects.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (user?.role !== 'client') {
    return (
      <div className="container">
        <div className="alert alert-error">
          Эта страница доступна только клиентам
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Заголовок */}
        <div className="page-header">
          <h1 className="page-title">Панель управления</h1>
          <p className="page-subtitle">
            Управляйте своими проектами и анализируйте статистику
          </p>
        </div>

        {/* Быстрые действия */}
        <div className="quick-actions">
          <Link to="/projects/create" className="action-card">
            <div className="action-icon">➕</div>
            <h3>Создать проект1333</h3>
            <p>Опубликовать новый проект для фрилансеров</p>
          </Link>
          <Link to="/my-orders" className="action-card">
            <div className="action-icon">📋</div>
            <h3>Мои заказы</h3>
            <p>Управление текущими и завершенными заказами</p>
          </Link>
          <Link to="/chat" className="action-card">
            <div className="action-icon">💬</div>
            <h3>Сообщения</h3>
            <p>Общение с фрилансерами</p>
          </Link>
          <Link to="/profile" className="action-card">
            <div className="action-icon">👤</div>
            <h3>Профиль</h3>
            <p>Редактирование информации о себе</p>
          </Link>
        </div>

        {/* Статистика */}
        <div className="stats-section">
          <h2 className="section-title">Статистика</h2>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Загрузка статистики...</p>
            </div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.totalProjects}</div>
                <div className="stat-label">Всего проектов</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.activeProjects}</div>
                <div className="stat-label">Активных проектов</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.completedProjects}</div>
                <div className="stat-label">Завершено проектов</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{formatCurrency(stats.totalSpent)}</div>
                <div className="stat-label">Всего потрачено</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.averageRating.toFixed(1)}</div>
                <div className="stat-label">Средний рейтинг</div>
              </div>
            </div>
          )}
        </div>

        {/* Последние проекты */}
        <div className="recent-projects">
          <div className="section-header">
            <h2 className="section-title">Последние проекты</h2>
            <Link to="/my-orders" className="btn btn-outline">
              Все проекты →
            </Link>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Загрузка проектов...</p>
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Нет проектов</h3>
              <p>Создайте свой первый проект</p>
              <Link to="/projects/create" className="btn btn-primary">
                Создать проект
              </Link>
            </div>
          ) : (
            <div className="projects-table">
              <table>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Статус</th>
                    <th>Бюджет</th>
                    <th>Срок</th>
                    <th>Предложений</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map(project => (
                    <tr key={project._id}>
                      <td>
                        <Link to={`/projects/${project._id}`} className="project-link">
                          {project.title}
                        </Link>
                      </td>
                      <td>
                        <span className={`status-badge ${project.status === 'open' ? 'success' : 'warning'}`}>
                          {project.status === 'open' ? 'Открыт' : 'В работе'}
                        </span>
                      </td>
                      <td>
                        ${project.budget?.min} - ${project.budget?.max}
                      </td>
                      <td>
                        {new Date(project.deadline).toLocaleDateString('ru-RU')}
                      </td>
                      <td>{project.proposals?.length || 0}</td>
                      <td>
                        <Link
                          to={`/projects/${project._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          Посмотреть
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Активность */}
        <div className="activity-section">
          <h2 className="section-title">Недавняя активность</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📨</div>
              <div className="activity-content">
                <p>Получено новое предложение на проект "Разработка сайта"</p>
                <span className="activity-time">2 часа назад</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <p>Проект "Дизайн логотипа" завершен</p>
                <span className="activity-time">1 день назад</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">💬</div>
              <div className="activity-content">
                <p>Новое сообщение от фрилансера Ивана</p>
                <span className="activity-time">2 дня назад</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;