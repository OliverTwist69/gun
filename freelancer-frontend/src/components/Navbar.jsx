import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            FreelanceHub
          </Link>
        </div>

        <div className="navbar-links">
          <Link to="/projects" className="nav-link">
            Проекты
          </Link>

          {user?.role === 'client' && (
            <Link to="/dashboard" className="nav-link">
              Мой кабинет
            </Link>
          )}

          {user?.role === 'freelancer' && (
            <>
              <Link to="/my-proposals" className="nav-link">
                Мои предложения
              </Link>
              <Link to="/my-orders" className="nav-link">
                Мои заказы
              </Link>
            </>
          )}

          <Link to="/chat" className="nav-link">
            Сообщения
          </Link>
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to={`/profile/${user?.id}`} className="user-profile">
                <div className="user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <span>{user?.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="username">{user?.username}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Выйти
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Войти
              </Link>
              <Link to="/register" className="btn btn-primary">
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;