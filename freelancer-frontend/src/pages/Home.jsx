import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef } from 'react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const imageRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateX = (mouseY - centerY) / 10;
    const rotateY = (centerX - mouseX) / 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="home-page">
      {/* Hero секция */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Найди идеального фрилансера для своего проекта
            </h1>
            <p className="hero-subtitle">
              FreelanceGirsh соединяет клиентов и фрилансеров со всего мира.
              Создавай проекты, находи исполнителей и расти вместе с нами.
            </p>
            <div className="hero-buttons">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Начать бесплатно
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg">
                    Уже есть аккаунт
                  </Link>
                </>
              ) : user?.role === 'client' ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Создать проект
                </Link>
              ) : (
                <Link to="/projects" className="btn btn-primary btn-lg">
                  Найти проекты
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Картинка */}
      <section className="image-section">
        <div className="container" style={{ perspective: '1000px', display: 'flex', justifyContent: 'center' }}>
          <img
            ref={imageRef}
            src="/cartinka.png"
            alt="Платформа FreelanceGirsh"
            className="featured-image"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              width: '300px',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginTop: '10px',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transition: 'transform 0.1s ease-out',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>
      </section>

      {/* Как это работает */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">Как это работает</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Создайте проект</h3>
              <p>Опишите задачу, укажите бюджет и сроки выполнения</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Получите предложения</h3>
              <p>Фрилансеры пришлют свои предложения с ценами и сроками</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Выберите исполнителя</h3>
              <p>Просмотрите портфолио и отзывы, выберите лучшего</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Завершите проект</h3>
              <p>Оплатите работу и оставьте отзыв о сотрудничестве</p>
            </div>
          </div>
        </div>
      </section>

      {/* Категории проектов */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Популярные категории</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">💻</div>
              <h3>Веб-разработка</h3>
              <p>Сайты, приложения, API</p>
            </div>
            <div className="category-card">
              <div className="category-icon">📱</div>
              <h3>Мобильная разработка</h3>
              <p>iOS, Android, кроссплатформенные приложения</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🎨</div>
              <h3>Дизайн</h3>
              <p>UI/UX, графика, брендинг</p>
            </div>
            <div className="category-card">
              <div className="category-icon">✍️</div>
              <h3>Копирайтинг</h3>
              <p>Тексты, статьи, контент</p>
            </div>
            <div className="category-card">
              <div className="category-icon">📊</div>
              <h3>Маркетинг</h3>
              <p>SMM, SEO, аналитика</p>
            </div>
            <div className="category-card">
              <div className="category-icon">📈</div>
              <h3>Аналитика данных</h3>
              <p>Обработка данных, визуализация</p>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="benefits">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2 className="section-title">Почему выбирают FreelanceGirsh</h2>
              <ul className="benefits-list">
                <li>✅ Безопасная система оплаты</li>
                <li>✅ Гарантия качества работы</li>
                <li>✅ Поддержка 24/7</li>
                <li>✅ Рейтинговая система</li>
                <li>✅ Защита обеих сторон</li>
                <li>✅ Низкая комиссия</li>
              </ul>
            </div>
            <div className="benefits-stats">
              <div className="stat-card">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Проектов выполнено</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Активных фрилансеров</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">99%</div>
                <div className="stat-label">Довольных клиентов</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Начните работу прямо сейчас</h2>
            <p>
              Присоединяйтесь к сообществу профессионалов и находите идеальные
              проекты или исполнителей.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Зарегистрироваться бесплатно
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;