import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle2, Clock, AlertCircle, ListTodo, ArrowRight, TrendingUp, Calendar } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, gradient, delay = 0 }) => (
  <div
    className="stat-card rounded-2xl p-6 border border-white/5 animate-fade-in-up"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{title}</p>
        <h3 className="text-4xl font-display font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${gradient}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/tasks/dashboard/stats'),
          api.get('/tasks')
        ]);
        
        setStats(statsRes.data);
        // Show up to 5 recent tasks
        setRecentTasks(tasksRes.data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading-spinner">Loading dashboard...</div>;

  // Calculate completion percentage
  const completionPercent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Welcome back, <span className="gradient-text">{user.name}</span> 👋
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Here's an overview of your team's progress
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="glass px-4 py-2 rounded-xl flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-primary-400" />
            <span className="text-gray-300">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="glass px-3 py-2 rounded-xl text-sm">
            <span className="text-gray-500">Role: </span>
            <span className="text-primary-400 font-semibold">{user.role}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
        <StatCard 
          title="Total Tasks" 
          value={stats.total} 
          icon={ListTodo} 
          gradient="bg-blue-500/10 text-blue-400"
          delay={0.05}
        />
        <StatCard 
          title="To Do" 
          value={stats.todo} 
          icon={Clock} 
          gradient="bg-gray-500/10 text-gray-400"
          delay={0.1}
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgress} 
          icon={TrendingUp} 
          gradient="bg-amber-500/10 text-amber-400"
          delay={0.15}
        />
        <StatCard 
          title="Completed" 
          value={stats.done} 
          icon={CheckCircle2} 
          gradient="bg-primary-500/10 text-primary-400"
          delay={0.2}
        />
      </div>

      {/* Progress Bar */}
      <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-300">Overall Completion</h3>
          <span className="text-2xl font-display font-bold gradient-text">{completionPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-dark-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${completionPercent}%`,
              background: 'linear-gradient(90deg, #059669, #10b981, #34d399)'
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {stats.done} of {stats.total} tasks completed
        </p>
      </div>

      {/* Overdue Alert */}
      {stats.overdue > 0 && (
        <div className="overdue-alert flex items-start space-x-3">
          <div className="p-2 bg-red-500/10 rounded-lg flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-red-400 font-semibold text-sm">Overdue Tasks</h4>
            <p className="text-red-400/70 text-sm mt-0.5">
              You have <span className="font-bold text-red-400">{stats.overdue}</span> task(s) past their due date. Please review them.
            </p>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="glass rounded-2xl overflow-hidden border border-white/5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-white">Recent Tasks</h2>
          <Link 
            to="/projects" 
            className="text-xs text-primary-400 hover:text-primary-300 flex items-center space-x-1 transition-colors"
            id="view-all-projects"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div>
          {recentTasks.length === 0 ? (
            <div className="empty-state py-12">
              <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
                <ListTodo className="w-7 h-7 text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm">No tasks found.</p>
              <p className="text-gray-600 text-xs mt-1">Get started by creating a project and adding tasks!</p>
            </div>
          ) : (
            <div className="stagger-children">
              {recentTasks.map((task, index) => (
                <div
                  key={task._id}
                  className="px-6 py-4 flex items-center justify-between border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-200 cursor-default"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      task.status === 'Done' ? 'bg-primary-500' :
                      task.status === 'In Progress' ? 'bg-amber-400' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-200 text-sm">{task.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {task.project?.name || 'Unknown project'}
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${
                    task.status === 'Done' ? 'badge-done' :
                    task.status === 'In Progress' ? 'badge-progress' :
                    'badge-todo'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
