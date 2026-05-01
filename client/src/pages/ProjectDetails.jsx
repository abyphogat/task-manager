import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { ArrowLeft, Plus, Clock, CheckCircle2, Circle, X, Calendar, FileText } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New task modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get('/tasks')
      ]);
      setProject(projectRes.data);
      // Filter tasks for this project
      setTasks(tasksRes.data.filter(t => t.project._id === id || t.project === id));
    } catch (error) {
      console.error('Failed to fetch project details', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/tasks', {
        title,
        description,
        project: id,
        dueDate: dueDate || undefined,
        assignedTo: user._id // Default assign to self for simplicity
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Failed to create task', error);
    } finally {
      setCreating(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  if (loading) return <div className="loading-spinner">Loading project...</div>;
  if (!project) return (
    <div className="empty-state min-h-[60vh]">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
        <X className="w-7 h-7 text-red-400" />
      </div>
      <p className="text-red-400 font-medium">Project not found or access denied.</p>
      <Link to="/projects" className="text-primary-400 text-sm mt-3 hover:underline">← Back to projects</Link>
    </div>
  );

  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  const columns = [
    { title: 'To Do', icon: Circle, iconColor: 'text-gray-400', tasks: todoTasks, dotColor: 'bg-gray-400' },
    { title: 'In Progress', icon: Clock, iconColor: 'text-amber-400', tasks: inProgressTasks, dotColor: 'bg-amber-400' },
    { title: 'Done', icon: CheckCircle2, iconColor: 'text-primary-400', tasks: doneTasks, dotColor: 'bg-primary-400' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back link + Header */}
      <div className="animate-fade-in-up">
        <Link
          to="/projects"
          className="inline-flex items-center text-sm text-gray-500 hover:text-primary-400 transition-colors mb-5 group"
          id="back-to-projects"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Projects
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">{project.name}</h1>
            {project.description && (
              <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-xl">{project.description}</p>
            )}
            <div className="flex items-center space-x-4 mt-3 text-xs text-gray-600">
              <span>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{doneTasks.length} completed</span>
            </div>
          </div>
          {user.role === 'Admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center space-x-2 flex-shrink-0"
              id="add-task-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
        {columns.map(({ title: colTitle, icon: ColIcon, iconColor, tasks: colTasks, dotColor }) => (
          <div key={colTitle} className="task-column p-5">
            {/* Column header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white text-sm flex items-center space-x-2">
                <ColIcon className={`w-4 h-4 ${iconColor}`} />
                <span>{colTitle}</span>
              </h3>
              <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full font-medium">
                {colTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {colTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-600 text-xs">
                  No tasks
                </div>
              ) : (
                colTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    updateStatus={updateTaskStatus}
                    user={user}
                    dotColor={dotColor}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-display font-semibold text-white">Add New Task</h3>
                <p className="text-xs text-gray-500 mt-0.5">Create a task for {project.name}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all"
                id="close-task-modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateTask} className="p-6 space-y-5" id="create-task-form">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="task-title">
                  Task Title
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    id="task-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-premium pl-10"
                    placeholder="e.g. Design homepage wireframe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="task-description">
                  Description <span className="text-gray-600">(optional)</span>
                </label>
                <textarea
                  id="task-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-premium min-h-[80px] resize-none"
                  placeholder="Add more details..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="task-due-date">
                  Due Date <span className="text-gray-600">(optional)</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    id="task-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input-premium pl-10"
                  />
                </div>
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
                      <span>Create Task</span>
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

// ── Task Card Component ──
const TaskCard = ({ task, updateStatus, user, dotColor }) => {
  const isAssignedToMe = task.assignedTo?._id === user._id || task.assignedTo === user._id;
  const canEdit = user.role === 'Admin' || isAssignedToMe;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <div className={`task-card ${isOverdue ? 'border-red-500/20' : ''}`}>
      {/* Title + due date */}
      <div className="flex items-start justify-between mb-1">
        <h4 className="text-sm font-medium text-gray-200 leading-snug pr-2">{task.title}</h4>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
      )}

      {task.dueDate && (
        <div className={`flex items-center space-x-1 text-xs mb-3 ${
          isOverdue ? 'text-red-400' : 'text-gray-500'
        }`}>
          <Clock className="w-3 h-3" />
          <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          {isOverdue && <span className="text-[10px] font-semibold uppercase ml-1">Overdue</span>}
        </div>
      )}
      
      {/* Status change buttons */}
      {canEdit && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
          {task.status !== 'To Do' && (
            <button 
              onClick={() => updateStatus(task._id, 'To Do')}
              className="status-btn bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
            >
              To Do
            </button>
          )}
          {task.status !== 'In Progress' && (
            <button 
              onClick={() => updateStatus(task._id, 'In Progress')}
              className="status-btn bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
            >
              In Progress
            </button>
          )}
          {task.status !== 'Done' && (
            <button 
              onClick={() => updateStatus(task._id, 'Done')}
              className="status-btn bg-primary-500/10 text-primary-400 hover:bg-primary-500/20"
            >
              Done
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
