import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      web: 'Веб-разработка',
      mobile: 'Мобильная разработка',
      design: 'Дизайн',
      writing: 'Копирайтинг',
      marketing: 'Маркетинг',
      data: 'Аналитика данных',
      other: 'Другое'
    };
    return labels[category] || category;
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: 'Открыт',
      in_progress: 'В работе',
      completed: 'Завершен',
      cancelled: 'Отменен'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'success',
      in_progress: 'warning',
      completed: 'info',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <div className="project-card">
      <div className="project-card-header">
        <div className="project-status">
          <span className={`status-badge ${getStatusColor(project.status)}`}>
            {getStatusLabel(project.status)}
          </span>
        </div>
        <div className="project-category">
          <span className="category-badge">
            {getCategoryLabel(project.category)}
          </span>
        </div>
      </div>

      <div className="project-card-body">
        <Link to={`/projects/${project._id}`} className="project-title">
          <h3>{project.title}</h3>
        </Link>

        <p className="project-description">
          {project.description.length > 150
            ? `${project.description.substring(0, 150)}...`
            : project.description}
        </p>

        <div className="project-skills">
          {project.skillsRequired?.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
          {project.skillsRequired?.length > 3 && (
            <span className="skill-tag more">+{project.skillsRequired.length - 3}</span>
          )}
        </div>

        <div className="project-meta">
          <div className="meta-item">
            <span className="meta-label">Бюджет:</span>
            <span className="meta-value">
              ${project.budget?.min} - ${project.budget?.max}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Срок:</span>
            <span className="meta-value">{formatDate(project.deadline)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Предложений:</span>
            <span className="meta-value">
              {project.proposals?.length || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="project-card-footer">
        <div className="project-client">
          {project.client?.avatar ? (
            <img
              src={project.client.avatar}
              alt={project.client.username}
              className="client-avatar"
            />
          ) : (
            <div className="client-avatar">
              {project.client?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="client-info">
            <div className="client-name">{project.client?.fullName}</div>
            <div className="client-rating">
              ★ {project.client?.rating || 'Нет рейтинга'}
            </div>
          </div>
        </div>

        <Link to={`/projects/${project._id}`} className="btn btn-outline btn-sm">
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;