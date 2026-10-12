import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';

const API_URL = 'http://localhost:5000/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minBudget: '',
    maxBudget: '',
    search: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1
  });

  const categories = [
    { value: '', label: 'Все категории' },
    { value: 'web', label: 'Веб-разработка' },
    { value: 'mobile', label: 'Мобильная разработка' },
    { value: 'design', label: 'Дизайн' },
    { value: 'writing', label: 'Копирайтинг' },
    { value: 'marketing', label: 'Маркетинг' },
    { value: 'data', label: 'Аналитика данных' },
    { value: 'other', label: 'Другое' }
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`${API_URL}/projects?${params.toString()}`);
      setProjects(response.data.projects);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filters.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Сбрасываем на первую страницу при смене фильтров
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="projects-page">
      <div className="container">
        {/* Заголовок и фильтры */}
        <div className="page-header">
          <h1 className="page-title">Проекты</h1>
          <p className="page-subtitle">
            Найдите интересующие вас проекты и отправьте свои предложения
          </p>
        </div>

        {/* Фильтры */}
        <div className="filters-section">
          <form onSubmit={handleSearch} className="filters-form">
            <div className="search-bar">
              <input
                type="text"
                name="search"
                placeholder="Поиск проектов..."
                value={filters.search}
                onChange={handleFilterChange}
                className="search-input"
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </div>

            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Категория</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Бюджет от</label>
                <input
                  type="number"
                  name="minBudget"
                  placeholder="0"
                  value={filters.minBudget}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Бюджет до</label>
                <input
                  type="number"
                  name="maxBudget"
                  placeholder="10000"
                  value={filters.maxBudget}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>

              <button
                type="button"
                onClick={fetchProjects}
                className="btn btn-primary"
              >
                Применить фильтры
              </button>
            </div>
          </form>
        </div>

        {/* Список проектов */}
        <div className="projects-section">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Загрузка проектов...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Проекты не найдены</h3>
              <p>Попробуйте изменить параметры поиска</p>
            </div>
          ) : (
            <>
              <div className="projects-grid">
                {projects.map(project => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>

              {/* Пагинация */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="pagination-btn"
                  >
                    ← Назад
                  </button>

                  <div className="pagination-pages">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`pagination-btn ${
                            pageNum === pagination.page ? 'active' : ''
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="pagination-btn"
                  >
                    Далее →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;