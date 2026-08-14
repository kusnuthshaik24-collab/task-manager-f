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
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  ClipboardList,
  Award,
  User as UserIcon,
  Mail
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState({
    name: 'Riya',
    email: 'Riya@gmail.com',
    initials: 'RI'
  });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(`tasker_tasks_${user.email}`);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasker_tasks_${user.email}`);
    setTasks(savedTasks ? JSON.parse(savedTasks) : []);
  }, [user.email]);

  useEffect(() => {
    localStorage.setItem(`tasker_tasks_${user.email}`, JSON.stringify(tasks));
  }, [tasks, user.email]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const addTask = (newTask) => {
    setTasks([
      { ...newTask, id: Date.now().toString() },
      ...tasks
    ]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
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
        <div className="w-full h-16 rounded-xl bg-gradient-to-t from-purple-900/40 to-transparent relative overflow-hidden flex items-end justify-center pb-2">
          <div className="absolute -bottom-6 w-32 h-12 bg-purple-500/20 rounded-full blur-xl"></div>
        </div>

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
          <div className="bg-white/90 backdrop-blur-md border border-purple-100/60 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-purple-300 transition">
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Tasks</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{filtered.length}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Ready to start</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold border border-purple-100"><Check size={18} /></div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-purple-100/60 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-purple-300 transition">
            <div>
              <p className="text-xs font-semibold text-slate-500">Completed</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{completedTasks}</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">{completedTasks} completed</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold border border-emerald-100"><CheckCircle2 size={18} /></div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-purple-100/60 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-purple-300 transition">
            <div>
              <p className="text-xs font-semibold text-slate-500">In Progress</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{inProgressTasks}</h3>
              <p className="text-[11px] text-purple-600 font-medium mt-1">{inProgressTasks} active items</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold border border-purple-100"><Clock size={18} /></div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-purple-100/60 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-purple-300 transition">
            <div>
              <p className="text-xs font-semibold text-slate-500">Overdue</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{overdueCount}</h3>
              <p className="text-[11px] text-rose-600 font-medium mt-1">{overdueCount} overdue</p>
            </div>
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-bold border border-rose-100"><AlertCircle size={18} /></div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-purple-100/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-extrabold text-slate-800">My Tasks</h2>
            <Link to="/my-tasks" className="text-xs font-bold text-purple-600 hover:text-purple-700 transition">
              View All
            </Link>
          </div>

          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center font-medium">No tasks found</p>
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
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs bg-purple-50 text-purple-600">
                        <CheckSquare size={16} />
                      </div>
                      <div>
                        <Link to={`/tasks/${task.id}`} className="font-bold text-xs text-slate-800 hover:text-purple-600 transition block">{task.title}</Link>
                        <p className="text-[11px] text-slate-500 mt-0.5">{task.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <select 
                        value={task.status} 
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        className={`text-[10px] border rounded-xl px-2.5 py-1 font-bold focus:outline-none ${
                          task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          task.status === 'In Progress' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-purple-50/60 text-purple-700 border-purple-200'
                        }`}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>

                      <span className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1">
                        <CalendarIcon size={12} className="inline mr-1 text-slate-400" />
                        {task.date}
                      </span>

                      <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-[10px] font-bold shadow-2xs" title={user?.email}>
                        {user?.initials || 'RI'}
                      </div>

                      <button 
                        onClick={() => deleteTask(task.id)} 
                        className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-1"
                        title="Delete Task"
                      >
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
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-purple-100 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-500/30 mb-2">
            <CheckSquare className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">Welcome Back</h1>
          <p className="text-xs text-slate-500 font-medium">Please enter your details to sign in</p>
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
            <p className="text-xs text-slate-500 mt-0.5">Manage and update your tasks list</p>
          </div>
          <div className="flex items-center space-x-3">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-purple-100 rounded-2xl px-4 py-2 text-xs text-slate-800 font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
            <button 
              onClick={openModal}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-md shadow-purple-600/25 cursor-pointer"
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
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-purple-50/30 transition">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      checked={task.status === 'Completed'} 
                      onChange={(e) => updateTaskStatus(task.id, e.target.checked ? 'Completed' : 'To Do')}
                      className="w-4 h-4 rounded border-slate-300 text-purple-600 cursor-pointer accent-purple-600" 
                    />
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs bg-purple-50 text-purple-600">
                      <CheckSquare size={16} />
                    </div>
                    <div>
                      <Link to={`/tasks/${task.id}`} className="font-bold text-sm text-slate-800 hover:text-purple-600 transition">{task.title}</Link>
                      <p className="text-xs text-slate-500">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select 
                      value={task.status} 
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className="text-xs border border-purple-200 rounded-xl px-3 py-1.5 bg-purple-50/40 font-semibold text-purple-700 focus:outline-none"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <span className="text-xs text-slate-500 font-semibold">{task.date}</span>
                    <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition">
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
  const columns = [
    { title: 'To Do', countColor: 'bg-purple-100 text-purple-700' },
    { title: 'In Progress', countColor: 'bg-amber-100 text-amber-700' },
    { title: 'Completed', countColor: 'bg-emerald-100 text-emerald-700' }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f3eefc] via-[#e6ebf8] to-[#dce4f7]">
      <Sidebar user={user} />
      <main className="flex-1 p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Task Board</h1>
          <button 
            onClick={openModal} 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-lg shadow-purple-600/30 transition transform hover:-translate-y-0.5"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {columns.map(col => {
            const columnTasks = tasks.filter(t => t.status === col.title);
            return (
              <div 
                key={col.title} 
                className="bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] p-5 shadow-xl shadow-purple-950/5 space-y-5 flex flex-col min-h-[580px]"
              >
                <div className="flex justify-between items-center px-2 pt-2">
                  <h3 className="font-extrabold text-base text-slate-900">{col.title}</h3>
                  <span className={`text-xs px-3 py-0.5 rounded-full font-extrabold ${col.countColor}`}>
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-4 flex-1 flex flex-col">
                  {columnTasks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
                      {col.title === 'In Progress' ? (
                        <div className="space-y-4">
                          <div className="w-24 h-24 bg-purple-50/80 rounded-3xl mx-auto flex items-center justify-center shadow-inner relative">
                            <div className="absolute inset-2 bg-purple-100/50 rounded-2xl filter blur-xs"></div>
                            <ClipboardList className="text-purple-400 relative z-10" size={40} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-sm text-slate-800">No tasks in progress</h4>
                            <p className="text-[11px] text-slate-400 font-medium">Move tasks here to track progress</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-24 h-24 bg-emerald-50/80 rounded-3xl mx-auto flex items-center justify-center shadow-inner relative">
                            <div className="absolute inset-2 bg-emerald-100/50 rounded-2xl filter blur-xs"></div>
                            <Award className="text-emerald-500 relative z-10" size={40} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-sm text-slate-800">No completed tasks yet</h4>
                            <p className="text-[11px] text-slate-400 font-medium">Great work awaits!</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    columnTasks.map((task, idx) => (
                      <div 
                        key={task.id} 
                        className={`p-4 bg-white rounded-2xl shadow-sm border space-y-3 relative group transition hover:shadow-md ${
                          idx === 0 ? 'border-l-4 border-l-purple-600 border-purple-100' : 'border-l-4 border-l-emerald-500 border-purple-100'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${idx === 0 ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              {idx === 0 ? <FileText size={16} /> : <FolderOpen size={16} />}
                            </div>
                            <Link 
                              to={`/tasks/${task.id}`} 
                              className="font-extrabold text-sm text-slate-900 hover:text-purple-600 transition block"
                            >
                              {task.title}
                            </Link>
                          </div>

                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-300 hover:text-rose-500 transition cursor-pointer p-0.5 opacity-0 group-hover:opacity-100"
                            title="Delete Task"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <p className="text-xs text-slate-500 font-medium">{task.description}</p>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                          <span className="text-xs text-slate-600 font-bold">
                            {task.date}
                          </span>
                          <div className="relative">
                            <select 
                              value={task.status} 
                              onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                              className="text-xs bg-purple-50/70 border border-purple-100 rounded-xl px-3 py-1 font-extrabold text-purple-700 focus:outline-none hover:bg-purple-100 transition cursor-pointer appearance-none pr-7"
                            >
                              <option value="To Do">To Do</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600 text-[10px]">▼</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 14));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f3eefc] via-[#e6ebf8] to-[#dce4f7]">
      <Sidebar user={user} />
      <main className="flex-1 p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Calendar Schedule</h1>
            <p className="text-xs text-slate-500 mt-0.5">Interactive calendar grid with highlighted task dates</p>
          </div>
          <button onClick={openModal} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-md shadow-purple-600/25">
            <Plus size={16} /><span>Add Task</span>
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-purple-100/60 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-base font-extrabold text-slate-800">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center space-x-2">
              <button onClick={prevMonth} className="p-2 border border-purple-200 rounded-xl hover:bg-purple-50 text-slate-600 cursor-pointer">
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextMonth} className="p-2 border border-purple-200 rounded-xl hover:bg-purple-50 text-slate-600 cursor-pointer">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span key={day} className="text-xs font-bold text-slate-400 py-1">{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {days.map((dayNum, index) => {
              if (dayNum === null) {
                return <div key={`empty-${index}`} className="h-24 bg-transparent rounded-2xl"></div>;
              }

              const formattedMonth = String(month + 1).padStart(2, '0');
              const formattedDay = String(dayNum).padStart(2, '0');
              const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

              const dayTasks = tasks.filter(t => t.date === dateStr);
              const hasTasks = dayTasks.length > 0;

              return (
                <div 
                  key={`day-${dayNum}`} 
                  className={`h-24 border rounded-2xl p-2.5 flex flex-col justify-between transition ${
                    hasTasks 
                      ? 'bg-purple-50/60 border-purple-200 ring-2 ring-purple-500/10 shadow-xs' 
                      : 'bg-white border-purple-100/60 hover:border-purple-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold ${hasTasks ? 'text-purple-700' : 'text-slate-700'}`}>
                      {dayNum}
                    </span>
                    {hasTasks && (
                      <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-12 scrollbar-none">
                    {dayTasks.map(task => (
                      <Link 
                        key={task.id} 
                        to={`/tasks/${task.id}`} 
                        className="block text-[10px] font-bold bg-purple-600 text-white rounded-lg px-1.5 py-0.5 truncate hover:bg-purple-700 transition"
                        title={task.title}
                      >
                        {task.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
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

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...user, name, email, initials: name.slice(0, 2).toUpperCase() });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const totalTasks = tasks.length || 1;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const pendingCount = tasks.filter(t => t.status === 'To Do').length;

  const completionPercentage = Math.round((completedCount / totalTasks) * 100);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f3eefc] via-[#e6ebf8] to-[#dce4f7] relative overflow-hidden">
      <Sidebar user={user} />
      
      <div className="absolute top-10 right-20 w-80 h-80 rounded-full border border-purple-200/40 pointer-events-none"></div>

      <main className="flex-1 p-10 max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-xs text-slate-500 font-medium">Manage your personal information and preferences</p>
            <div className="w-10 h-1 bg-purple-600 rounded-full mt-2"></div>
          </div>

          <div className="w-10 h-10 bg-white border border-purple-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-sm">
            <Bell size={18} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-4 bg-white/95 backdrop-blur-2xl border border-white rounded-[2.5xl] p-6 shadow-xl shadow-purple-950/5 space-y-6">
            <div className="text-center">
              <h3 className="font-extrabold text-sm text-slate-900">Your Task Progress</h3>
            </div>

            <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-purple-100"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-purple-600 transition-all duration-1000 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-slate-900">{completionPercentage}%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-purple-50/50 border border-purple-100/60 rounded-2xl p-3 text-center space-y-1">
                <span className="text-sm font-extrabold text-slate-900 block">{completedCount}</span>
                <span className="text-[10px] text-slate-400 font-bold block">Completed</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mt-1"></div>
              </div>
              <div className="bg-purple-50/50 border border-purple-100/60 rounded-2xl p-3 text-center space-y-1">
                <span className="text-sm font-extrabold text-slate-900 block">{inProgressCount}</span>
                <span className="text-[10px] text-slate-400 font-bold block">In Progress</span>
                <div className="w-2 h-2 rounded-full bg-amber-400 mx-auto mt-1"></div>
              </div>
              <div className="bg-purple-50/50 border border-purple-100/60 rounded-2xl p-3 text-center space-y-1">
                <span className="text-sm font-extrabold text-slate-900 block">{pendingCount}</span>
                <span className="text-[10px] text-slate-400 font-bold block">Pending</span>
                <div className="w-2 h-2 rounded-full bg-purple-400 mx-auto mt-1"></div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-800">Task Overview</h4>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="flex items-center space-x-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-purple-600 inline-block"></span>
                    <span>Completed</span>
                  </span>
                  <span className="text-slate-500">{completionPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-purple-100/60 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="flex items-center space-x-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                    <span>In Progress</span>
                  </span>
                  <span className="text-slate-500">{Math.round((inProgressCount / totalTasks) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-purple-100/60 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.round((inProgressCount / totalTasks) * 100)}%` }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="flex items-center space-x-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-purple-300 inline-block"></span>
                    <span>Pending</span>
                  </span>
                  <span className="text-slate-500">{Math.round((pendingCount / totalTasks) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-purple-100/60 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-300 rounded-full" style={{ width: `${Math.round((pendingCount / totalTasks) * 100)}%` }}></div>
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-8 bg-white/95 backdrop-blur-2xl border border-white rounded-[2.5xl] p-8 shadow-xl shadow-purple-950/5 relative overflow-hidden space-y-6">
            
            <form onSubmit={handleSave} className="space-y-6">
              {savedMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl">
                  Changes saved successfully!
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-800">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600">
                    <UserIcon size={16} />
                  </span>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full bg-white border border-purple-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-800">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600">
                    <Mail size={16} />
                  </span>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full bg-white border border-purple-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    required 
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-7 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30 cursor-pointer transition transform hover:-translate-y-0.5"
                >
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>

          </div>

        </div>
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
  const [date, setDate] = useState(task ? task.date : '2026-08-14');
  const [time, setTime] = useState(task ? (task.time || '12:00') : '12:00');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setDate(task.date || '2026-08-14');
      setTime(task.time || '12:00');
    }
  }, [task]);

  if (!task) return <div className="p-8 text-slate-800">Task not found. <Link to="/dashboard" className="text-purple-600 underline">Back to dashboard</Link></div>;

  const handleSave = (e) => {
    e.preventDefault();
    updateTask({ ...task, title, description, status, date, time });
    navigate('/board');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f3eefc] via-[#e6ebf8] to-[#dce4f7]">
      <Sidebar user={user} />
      <main className="flex-1 p-8 max-w-4xl mx-auto space-y-6">
        <Link to="/board" className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-block transition">
          &larr; Back to Board
        </Link>

        <form onSubmit={handleSave} className="bg-white/95 backdrop-blur-md border border-purple-100/60 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex justify-between items-center gap-4">
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full text-lg font-extrabold text-slate-800 bg-transparent border border-purple-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              required 
            />
            <button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md shadow-purple-600/25 cursor-pointer whitespace-nowrap"
            >
              Save
            </button>
          </div>

          <div>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full h-32 bg-purple-50/30 border border-purple-100 rounded-2xl p-4 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
              placeholder="Task description..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none"
              />
            </div>
          </div>
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
  const [time, setTime] = useState('12:00');
  const [status, setStatus] = useState('To Do');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({ title, description, date, time, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-purple-100 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-800">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
            <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-purple-50/40 border border-purple-100 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea placeholder="Task details" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-purple-50/40 border border-purple-100 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium h-20 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-purple-50/40 border border-purple-100 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-purple-50/40 border border-purple-100 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-purple-50/40 border border-purple-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30">
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-200 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl text-xs font-bold text-white cursor-pointer shadow-md shadow-purple-600/25 transition">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};
