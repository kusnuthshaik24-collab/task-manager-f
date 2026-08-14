import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useParams, 
  Navigate,
  useLocation
} from 'react-router-dom';
import { 
  CheckSquare, 
  LayoutDashboard, 
  CheckCircle2, 
  Kanban, 
  Calendar as CalendarIcon, 
  Settings as SettingsIcon, 
  Search, 
  Bell, 
  Plus, 
  Check, 
  Eye, 
  EyeOff, 
  Trash2, 
  Clock, 
  AlertCircle,
  LogOut
} from 'lucide-react';

// Live backend deployed on Render connected to MongoDB Atlas
const API_BASE = 'https://task-manager-b-1-evac.onrender.com/api';

export default function App() {
  const [user, setUser] = useState({
    name: 'Riya',
    email: 'Riya@gmail.com',
    initials: 'RI'
  });

  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tasks from MongoDB Atlas via your live backend
  useEffect(() => {
    if (user?.email) {
      fetch(`${API_BASE}/tasks?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setTasks(data.map(t => ({ ...t, id: t._id })));
          }
        })
        .catch(err => console.error('Failed to fetch tasks:', err));
    }
  }, [user]);

  const addTask = async (newTaskData) => {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTaskData, userEmail: user.email })
      });
      const saved = await response.json();
      setTasks([{ ...saved, id: saved._id }, ...tasks]);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      const saved = await response.json();
      setTasks(tasks.map(t => t.id === saved._id ? { ...saved, id: saved._id } : t));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) return;
    
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskToUpdate, status: newStatus })
      });
      const saved = await response.json();
      setTasks(tasks.map(t => t.id === id ? { ...saved, id: saved._id } : t));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />
        <Route 
          path="/dashboard" 
          element={
            <Dashboard 
              tasks={tasks} 
              user={user} 
              openModal={() => setIsModalOpen(true)} 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              updateTaskStatus={updateTaskStatus}
              deleteTask={deleteTask}
            />
          } 
        />
        <Route 
          path="/my-tasks" 
          element={
            <MyTasks 
              tasks={tasks} 
              user={user} 
              openModal={() => setIsModalOpen(true)}
              updateTaskStatus={updateTaskStatus}
              deleteTask={deleteTask}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          } 
        />
        <Route 
          path="/board" 
          element={
            <BoardView 
              tasks={tasks} 
              user={user} 
              openModal={() => setIsModalOpen(true)}
              updateTaskStatus={updateTaskStatus}
              deleteTask={deleteTask}
            />
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <CalendarView 
              tasks={tasks} 
              user={user} 
              openModal={() => setIsModalOpen(true)}
            />
          } 
        />
        <Route 
          path="/settings" 
          element={
            <SettingsView 
              user={user} 
              setUser={setUser} 
              tasks={tasks}
            />
          } 
        />
        <Route 
          path="/tasks/:id" 
          element={
            <TaskDetailView 
              tasks={tasks} 
              user={user} 
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {isModalOpen && (
        <TaskModal 
          onClose={() => setIsModalOpen(false)} 
          onAddTask={addTask} 
        />
      )}
    </BrowserRouter>
  );
}

// --- SIDEBAR COMPONENT ---
const Sidebar = ({ user }) => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#0d0f1d] border-r border-indigo-950/50 flex flex-col justify-between p-6 min-h-screen text-slate-300 shadow-xl relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#1b1736] via-[#121226]/60 to-transparent pointer-events-none"></div>

      <div className="space-y-8 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-md shadow-purple-600/30">
            <CheckSquare className="text-white" size={22} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">Tasker</span>
        </div>

        <nav className="space-y-1.5">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" currentPath={location.pathname} />
          <SidebarLink to="/my-tasks" icon={<CheckCircle2 size={18} />} label="My Tasks" currentPath={location.pathname} />
          <SidebarLink to="/board" icon={<Kanban size={18} />} label="Board" currentPath={location.pathname} />
          <SidebarLink to="/calendar" icon={<CalendarIcon size={18} />} label="Calendar" currentPath={location.pathname} />
          <SidebarLink to="/settings" icon={<SettingsIcon size={18} />} label="Settings" currentPath={location.pathname} />
        </nav>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="pt-4 border-t border-indigo-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-9 h-9 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md shrink-0">
              {user?.initials || 'RI'}
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-white truncate">{user?.name || 'Riya'}</h4>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'Riya@gmail.com'}</p>
            </div>
          </div>
          <Link to="/" className="text-slate-400 hover:text-rose-400 transition cursor-pointer ml-2 shrink-0" title="Log out">
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label, currentPath }) => {
  const isActive = currentPath === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition relative ${
        isActive 
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30' 
          : 'text-slate-400 hover:bg-indigo-950/40 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

// --- TOP HEADER ---
const TopHeader = ({ user, openModal, searchQuery, setSearchQuery, overdueTasks }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Good morning, {user?.name || 'Riya'}! 👋</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Here's what's happening with your tasks today.</p>
      </div>

      <div className="flex items-center space-x-3 w-full sm:w-auto relative">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-purple-100 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 shadow-2xs"
          />
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 bg-white border border-purple-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-purple-50/50 relative cursor-pointer shadow-2xs transition"
          >
            <Bell size={18} />
            {overdueTasks && overdueTasks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {overdueTasks.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-purple-100 rounded-3xl p-5 shadow-xl z-50 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-slate-800">Notifications</h3>
                {overdueTasks.length > 0 && (
                  <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2.5 py-1 rounded-full border border-rose-100">
                    {overdueTasks.length} Overdue
                  </span>
                )}
              </div>

              {overdueTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No new notifications</p>
              ) : (
                <div className="space-y-2">
                  {overdueTasks.map(task => (
                    <div key={task.id} className="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-rose-700">Task "{task.title}" is overdue</h4>
                        <span className="text-[10px] text-rose-500 font-medium">{task.date}</span>
                      </div>
                      <p className="text-[11px] text-rose-600 leading-snug">
                        Was due on {task.date} but status is still "{task.status}".
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button 
          onClick={openModal}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-md shadow-purple-600/25 cursor-pointer whitespace-nowrap transition"
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
};

// --- DASHBOARD ---
const Dashboard = ({ tasks, user, openModal, searchQuery, setSearchQuery, updateTaskStatus, deleteTask }) => {
  const todayStr = '2026-08-14';
  const filtered = tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const completedTasks = filtered.filter(t => t.status === 'Completed').length;
  const inProgressTasks = filtered.filter(t => t.status === 'In Progress').length;
  const overdueTasks = filtered.filter(t => t.status !== 'Completed' && t.date && t.date < todayStr);
  const overdueCount = overdueTasks.length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f3eefc] via-[#e6ebf8] to-[#dce4f7]">
      <Sidebar user={user} />
      <main className="flex-1 p-8 max-w-7xl mx-auto">
        <TopHeader user={user} openModal={openModal} searchQuery={searchQuery} setSearchQuery={setSearchQuery} overdueTasks={overdueTasks} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-md border border-purple-100/60 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Tasks</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{filtered.length}</h3>
            </div>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold border border-purple-100"><Check size={18} /></div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-purple-100/60 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Completed</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{completedTasks}</h3>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold border border-emerald-100"><CheckCircle2 size={18} /></div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-purple-100/60 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">In Progress</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{inProgressTasks}</h3>
            </div>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold border border-purple-100"><Clock size={18} /></div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-purple-100/60 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Overdue</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{overdueCount}</h3>
            </div>
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-bold border border-rose-100"><AlertCircle size={18} /></div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-purple-100/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-extrabold text-slate-800">My Tasks</h2>
            <Link to="/my-tasks" className="text-xs font-bold text-purple-600 hover:text-purple-700 transition">View All</Link>
          </div>

          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center font-medium">No tasks found for this account</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((task) => (
                <div key={task.id} className="relative p-1 rounded-2xl shadow-xs bg-gradient-to-r from-purple-500/40 to-indigo-500/20">
                  <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl hover:bg-purple-50/30 transition">
                    <div className="flex items-center space-x-3.5">
                      <input 
                        type="checkbox" 
                        checked={task.status === 'Completed'} 
                        onChange={(e) => updateTaskStatus(task.id, e.target.checked ? 'Completed' : 'To Do')}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 cursor-pointer accent-purple-600" 
                      />
                      <div>
                        <Link to={`/tasks/${task.id}`} className="font-bold text-xs text-slate-800 hover:text-purple-600 transition block">{task.title}</Link>
                        <p className="text-[11px] text-slate-500 mt-0.5">{task.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <select 
                        value={task.status} 
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        className="text-[10px] border rounded-xl px-2.5 py-1 font-bold focus:outline-none bg-purple-50 text-purple-700 border-purple-200"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>

                      <span className="text-[11px] font-semibold text-slate-500">{task.date}</span>
                      <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-1">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- LOGIN PAGE ---
const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim() || 'Riya@gmail.com';
    let namePart = cleanEmail.split('@')[0];
    const derivedName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : 'Riya';
    const derivedInitials = derivedName.slice(0, 2).toUpperCase();

    setUser({
      name: derivedName,
      email: cleanEmail,
      initials: derivedInitials
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0f1d] via-[#1b1736] to-[#2d2254] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-purple-100 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-500/30 mb-2">
            <CheckSquare className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">Welcome Back</h1>
          <p className="text-xs text-slate-500 font-medium">Sign in to view your MongoDB task database</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600 pl-1">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-purple-50/40 border border-purple-100 rounded-2xl py-3 px-4 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600 pl-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-purple-50/40 border border-purple-100 rounded-2xl py-3 pl-4 pr-11 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-purple-500/25 transition cursor-pointer text-xs"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// --- MY TASKS VIEW ---
const MyTasks = ({ tasks, user, openModal, updateTaskStatus, deleteTask, searchQuery, setSearchQuery }) => {
  const filtered = tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f3eefc] via-[#e6ebf8] to-[#dce4f7]">
      <Sidebar user={user} />
      <main className="flex-1 p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">All Tasks</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your tasks list</p>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-purple-100 rounded-2xl px-4 py-2 text-xs text-slate-800 font-medium shadow-2xs focus:outline-none"
            />
            <button 
              onClick={openModal}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-md"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-purple-100/60 rounded-3xl p-6 shadow-xl space-y-3">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6 font-medium">No tasks found</p>
          ) : (
            filtered.map((task) => (
              <div key={task.id} className="relative p-1 rounded-2xl shadow-xs bg-gradient-to-r from-purple-500/40 to-indigo-500/20">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      checked={task.status === 'Completed'} 
                      onChange={(e) => updateTaskStatus(task.id, e.target.checked ? 'Completed' : 'To Do')}
                      className="w-4 h-4 rounded border-slate-300 text-purple-600 cursor-pointer accent-purple-600" 
                    />
                    <div>
                      <Link to={`/tasks/${task.id}`} className="font-bold text-sm text-slate-800 hover:text-purple-600">{task.title}</Link>
                      <p className="text-xs text-slate-500">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select 
                      value={task.status} 
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className="text-xs border border-purple-200 rounded-xl px-3 py-1.5 bg-purple-50/40 font-semibold text-purple-700"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <span className="text-xs text-slate-500 font-semibold">{task.date}</span>
                    <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

// --- BOARD VIEW ---
const BoardView = ({ tasks, user, openModal, updateTaskStatus, deleteTask }) => {
  const columns = ['To Do', 'In Progress', 'Completed'];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f3eefc] via-[#e6ebf8] to-[#dce4f7]">
      <Sidebar user={user} />
      <main className="flex-1 p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-extrabold text-slate-900">Task Board</h1>
          <button onClick={openModal} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-lg">
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {columns.map(colTitle => {
            const columnTasks = tasks.filter(t => t.status === colTitle);
            return (
              <div key={colTitle} className="bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] p-5 shadow-xl space-y-5 flex flex-col min-h-[580px]">
                <div className="flex justify-between items-center px-2 pt-2">
                  <h3 className="font-extrabold text-base text-slate-900">{colTitle}</h3>
                  <span className="text-xs px-3 py-0.5 rounded-full font-extrabold bg-purple-100 text-purple-700">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-4 flex-1">
                  {columnTasks.map((task) => (
                    <div key={task.id} className="p-4 bg-white rounded-2xl shadow-sm border border-purple-100 space-y-3">
                      <div className="flex justify-between items-start">
                        <Link to={`/tasks/${task.id}`} className="font-extrabold text-sm text-slate-900 hover:text-purple-600">{task.title}</Link>
                        <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-rose-500 cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">{task.description}</p>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                        <span className="text-xs text-slate-600 font-bold">{task.date}</span>
                        <select 
                          value={task.status} 
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className="text-xs bg-purple-50 border border-purple-100 rounded-xl px-2 py-1 font-bold text-purple-700"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

// --- CALENDAR VIEW ---
const CalendarView = ({ tasks, user, openModal }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f3eefc] via-[#e6ebf8] to-[#dce4f7]">
      <Sidebar user={user} />
      <main className="flex-1 p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-slate-800">Calendar Schedule</h1>
          <button onClick={openModal} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <Plus size={16} /><span>Add Task</span>
          </button>
        </div>
        <div className="bg-white/95 rounded-3xl p-6 shadow-xl text-center py-12">
          <p className="text-xs text-slate-500 font-medium">Total active tasks loaded from MongoDB Atlas: {tasks.length}</p>
        </div>
      </main>
    </div>
  );
};

// --- SETTINGS VIEW ---
const SettingsView = ({ user, setUser, tasks }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...user, name, email, initials: name.slice(0, 2).toUpperCase() });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f3eefc] via-[#e6ebf8] to-[#dce4f7]">
      <Sidebar user={user} />
      <main className="flex-1 p-10 max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Account Settings</h1>
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 shadow-xl space-y-4">
          {savedMessage && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">Updated!</div>}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-xl p-3 text-xs" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-xl p-3 text-xs" required />
          </div>
          <button type="submit" className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold">Save</button>
        </form>
      </main>
    </div>
  );
};

// --- TASK DETAIL VIEW ---
const TaskDetailView = ({ tasks, user, updateTask }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find(t => t.id === id);

  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [status, setStatus] = useState(task ? task.status : 'To Do');

  if (!task) return <div className="p-8">Task not found. <Link to="/dashboard">Back</Link></div>;

  const handleSave = (e) => {
    e.preventDefault();
    updateTask({ ...task, title, description, status });
    navigate('/board');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f3eefc] via-[#e6ebf8] to-[#dce4f7]">
      <Sidebar user={user} />
      <main className="flex-1 p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 shadow-xl space-y-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-lg font-bold border rounded-xl p-3" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-xl p-3 text-xs" />
          <button type="submit" className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold">Save</button>
        </form>
      </main>
    </div>
  );
};

// --- TASK MODAL ---
const TaskModal = ({ onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-08-14');
  const [status, setStatus] = useState('To Do');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({ title, description, date, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white border rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800">Create New Task in MongoDB Atlas</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-xs" required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-xs" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-xs" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-xs">
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};
