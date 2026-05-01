import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, FolderGit2, Users, ArrowRight, X, Sparkles } from 'lucide-react';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create project modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/projects', { name, description });
      setIsModalOpen(false);
      setName('');
      setDescription('');
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading projects...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5 animate-fade-in-up">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-primary-500/10">
            <FolderGit2 className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">Projects</h1>
            <p className="text-sm text-gray-500">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
          </div>
        </div>
        {user.role === 'Admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
            id="create-project-btn"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {projects.length === 0 ? (
          <div className="col-span-full">
            <div className="empty-state glass rounded-2xl border border-white/5 py-16">
              <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mb-4 animate-float">
                <FolderGit2 className="w-7 h-7 text-gray-600" />
              </div>
              <p className="text-gray-400 font-medium">No projects yet</p>
              <p className="text-gray-600 text-sm mt-1">
                {user.role === 'Admin' ? 'Create one to get started!' : 'Ask your admin to create a project.'}
              </p>
              {user.role === 'Admin' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary mt-6 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create first project</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          projects.map((project, index) => (
            <Link 
              key={project._id} 
              to={`/projects/${project._id}`}
              className="project-card group block"
              id={`project-card-${project._id}`}
            >
              {/* Card content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-display font-semibold text-white group-hover:text-primary-300 transition-colors duration-300 line-clamp-1">
                    {project.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400 transition-all duration-300 group-hover:translate-x-0.5 flex-shrink-0 mt-1" />
                </div>
                <p className="text-gray-500 text-sm mb-5 line-clamp-2 leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-600 pt-4 border-t border-white/5">
                  <span className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{project.members?.length || 0} members</span>
                  </span>
                  <span>
                    {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-display font-semibold text-white">Create New Project</h3>
                <p className="text-xs text-gray-500 mt-0.5">Set up a new workspace for your team</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all"
                id="close-create-modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleCreateProject} className="p-6 space-y-5" id="create-project-form">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="project-name">
                  Project Name
                </label>
                <input
                  id="project-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-premium"
                  placeholder="e.g. Website Redesign"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="project-description">
                  Description <span className="text-gray-600">(optional)</span>
                </label>
                <textarea
                  id="project-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-premium min-h-[100px] resize-none"
                  placeholder="What's this project about?"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  {creating ? (
                    <span className="flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating...</span>
                    </span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
