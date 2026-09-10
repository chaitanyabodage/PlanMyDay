import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  ListTodo,
  Plus,
  Trash2,
  Check,
  Clock,
  Search,
  Calendar,
  Bell,
  Volume2,
  VolumeX,
  Activity,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Task, SecurityEvent, DesignTheme } from '../types';
import { playCyberChime } from '../lib/crypto';
import { THEMES } from '../lib/themes';

interface DashboardProps {
  username: string;
  addSecurityEvent: (action: string, details: string, type: 'info' | 'success' | 'warning') => void;
  securityEvents: SecurityEvent[];
  currentTheme?: DesignTheme;
  onThemeChange?: (theme: DesignTheme) => void;
}

export default function Dashboard({
  username,
  addSecurityEvent,
  securityEvents,
  currentTheme = 'solar',
  onThemeChange,
}: DashboardProps) {
  // Task State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Task['category']>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Task['priority']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  // New Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Task['category']>('work');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');
  const [newDueDate, setNewDueDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [newReminderTime, setNewReminderTime] = useState('');

  // Active Alert Overlay State for custom reminder trigger
  const [triggeredReminder, setTriggeredReminder] = useState<Task | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Refs for checking reminder times
  const checkedRemindersRef = useRef<Record<string, string>>({}); // { taskId: date_triggered }

  // Load task data on mount
  useEffect(() => {
    const loadTasks = () => {
      try {
        const stored = localStorage.getItem(`planmyday_tasks_${username}`);
        if (stored) {
          setTasks(JSON.parse(stored));
        } else {
          // Initialize empty checklist
          setTasks([]);
          addSecurityEvent(
            'Checklist Initialized',
            `Created a blank workspace container for ${username}.`,
            'info'
          );
        }
      } catch (err) {
        console.error('Error loading tasks:', err);
        addSecurityEvent(
          'Load Error',
          'Could not retrieve task parameters from local storage.',
          'warning'
        );
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [username]);

  // Save task data to local storage on changes
  const saveTasks = (updatedTasks: Task[]) => {
    try {
      localStorage.setItem(`planmyday_tasks_${username}`, JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Error saving tasks:', err);
      addSecurityEvent(
        'Save Error',
        'Failed to persist task updates in memory.',
        'warning'
      );
    }
  };

  // Add a new task
  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      completed: false,
      priority: newPriority,
      dueDate: newDueDate,
      reminderTime: newReminderTime || undefined,
      isReminderActive: !!newReminderTime,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    saveTasks(updatedTasks);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewReminderTime('');
    
    playCyberChime('success');
    addSecurityEvent(
      'Task Created',
      `Created task: "${newTask.title.substring(0, 20)}..."`,
      'info'
    );
  };

  // Toggle Task Completion
  const handleToggleComplete = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const nextStatus = !task.completed;
        addSecurityEvent(
          nextStatus ? 'Task Completed' : 'Task Reopened',
          `Updated status for: "${task.title.substring(0, 20)}..."`,
          nextStatus ? 'success' : 'info'
        );
        return {
          ...task,
          completed: nextStatus,
          completedAt: nextStatus ? new Date().toISOString() : undefined,
        };
      }
      return task;
    });

    saveTasks(updatedTasks);
    playCyberChime('success');
  };

  // Delete Task
  const handleDeleteTask = (taskId: string, title: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    saveTasks(updatedTasks);

    addSecurityEvent('Task Deleted', `Removed task: "${title}"`, 'warning');
    playCyberChime('lock');
  };

  // Custom clock-scheduler reminder loops: checks every 3 seconds for alert triggers
  useEffect(() => {
    const reminderInterval = setInterval(() => {
      const now = new Date();
      const currentHourMin = now.toTimeString().split(' ')[0].substring(0, 5); // "HH:MM"
      const todayStr = now.toISOString().split('T')[0];

      tasks.forEach((task) => {
        if (
          task.reminderTime &&
          task.isReminderActive &&
          !task.completed &&
          task.reminderTime === currentHourMin
        ) {
          // Double check to ensure we only trigger ONCE per task per day
          if (checkedRemindersRef.current[task.id] !== todayStr) {
            checkedRemindersRef.current[task.id] = todayStr;
            setTriggeredReminder(task);
            
            if (!isMuted) {
              playCyberChime('remind');
            }

            addSecurityEvent(
              'Reminder Triggered',
              `Alarm triggered for: "${task.title}"`,
              'info'
            );
          }
        }
      });
    }, 3000);

    return () => clearInterval(reminderInterval);
  }, [tasks, isMuted]);

  // Dismiss / Complete triggered reminder
  const dismissReminder = (completeTask = false) => {
    if (triggeredReminder) {
      if (completeTask) {
        handleToggleComplete(triggeredReminder.id);
      }
      setTriggeredReminder(null);
    }
  };

  // Calculations for progress meters
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !task.completed) ||
      (statusFilter === 'completed' && task.completed);

    const matchesCalendarDate = !selectedCalendarDate || task.dueDate === selectedCalendarDate;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesCalendarDate;
  });

  const activeTheme = THEMES[currentTheme];

  // Calendar Navigation & Interactive States
  const [currentCalendarDate, setCurrentCalendarDate] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  const handlePrevMonth = () => {
    setCurrentCalendarDate(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  };

  const calendarYear = currentCalendarDate.getFullYear();
  const calendarMonth = currentCalendarDate.getMonth();

  // Get days in month
  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthName = currentCalendarDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className={`relative min-h-screen pt-32 pb-20 px-6 font-sans ${activeTheme.bg} ${activeTheme.textPrimary} transition-colors duration-500`}>
      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-8">
        
        {/* DASHBOARD GRID & STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Tasks List, Search & Filters (Col span 8/12) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Minimalist Dashboard Metric Rings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Progress Ring Card */}
              <div className="bg-[#18181B]/40 backdrop-blur-md border border-neutral-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase block mb-1 text-neutral-400">
                    Workspace Progress
                  </span>
                  <h3 className="text-2xl font-extrabold text-white">{completionRate}%</h3>
                  <span className="text-xs text-neutral-400 font-normal">Daily items completed</span>
                </div>
                
                {/* SVG Radial Meter */}
                <div className="relative w-14 h-14">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="#222"
                      strokeWidth="3.5"
                      fill="transparent"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="url(#progressGradient)"
                      strokeWidth="3.5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 24}
                      strokeDashoffset={2 * Math.PI * 24 * (1 - completionRate / 100)}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={activeTheme.accent1} />
                        <stop offset="100%" stopColor={activeTheme.accent2} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                    {completionRate}%
                  </span>
                </div>
              </div>

              {/* Single Stats Mini-cards */}
              <div className="bg-[#18181B]/40 backdrop-blur-md border border-neutral-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                  Pending Tasks
                </span>
                <span className="text-2xl font-black text-white mt-1.5">
                  {pendingTasks}
                </span>
                <span className="text-xs text-neutral-400 mt-0.5">Awaiting completion</span>
              </div>

              <div className="bg-[#18181B]/40 backdrop-blur-md border border-neutral-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                  Completed Tasks
                </span>
                <span className="text-2xl font-black text-white mt-1.5">
                  {completedTasks}
                </span>
                <span className="text-xs text-neutral-400 mt-0.5">Finished today</span>
              </div>
            </div>

            {/* Filter and Search Action Box */}
            <div className="bg-[#18181B]/40 border border-neutral-800 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 focus:border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Status Filters Tab Group */}
                <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-lg p-1 shrink-0">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      statusFilter === 'all'
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter('active')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      statusFilter === 'active'
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setStatusFilter('completed')}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      statusFilter === 'completed'
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>

              {/* Tag/Category & Priority Dropdown Selection Row */}
              <div className="flex flex-wrap gap-4 items-center pt-3 border-t border-neutral-800 text-xs">
                <div className="flex items-center gap-2">
                  <Filter size={11} className="text-neutral-500" />
                  <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">Category:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 rounded-lg py-1 px-2.5 focus:outline-none cursor-pointer hover:border-neutral-700 transition-colors"
                  >
                    <option value="all">All Categories</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="creative">Creative</option>
                    <option value="routine">Routine</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                  <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">Priority:</span>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 rounded-lg py-1 px-2.5 focus:outline-none cursor-pointer hover:border-neutral-700 transition-colors"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {selectedCalendarDate && (
                <div className="flex items-center gap-2 pt-2.5 border-t border-neutral-800 text-[10px] text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-neutral-500" />
                    Filtered by date: <strong className="text-white bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 font-semibold">{selectedCalendarDate}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedCalendarDate(null)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-bold ml-auto cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* TASK LIST WRAPPER */}
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center py-12 bg-neutral-900/10 border border-neutral-800 rounded-xl animate-pulse">
                  <span className="text-xs text-neutral-400">Loading checklist items...</span>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-12 bg-neutral-900/10 border border-neutral-800 rounded-xl flex flex-col items-center justify-center space-y-2">
                  <ListTodo className="text-neutral-600" size={22} />
                  <span className="text-xs text-neutral-400 font-medium">No tasks found. Try adjusting your filters.</span>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const priorityColors = {
                    low: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                    medium: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                    high: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
                  };

                  const categoryColors = {
                    work: 'text-blue-400 bg-blue-500/5 border border-blue-500/10',
                    personal: 'text-indigo-400 bg-indigo-500/5 border border-indigo-500/10',
                    creative: 'text-pink-400 bg-pink-500/5 border border-pink-500/10',
                    routine: 'text-amber-400 bg-amber-500/5 border border-amber-500/10',
                  };

                  return (
                    <div
                      key={task.id}
                      className={`group relative overflow-hidden rounded-xl border p-4 flex items-start gap-3.5 transition-all duration-200 ${
                        task.completed
                          ? 'bg-neutral-950/30 border-neutral-800/60 opacity-60'
                          : 'bg-[#18181B]/20 border-neutral-800/80 hover:border-neutral-700 hover:bg-[#18181B]/40 shadow-sm'
                      }`}
                    >
                      {/* Premium Circular Checkbox */}
                      <button
                        onClick={() => handleToggleComplete(task.id)}
                        className={`mt-0.5 h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 ${
                          task.completed
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'border-neutral-700 hover:border-neutral-500 text-transparent'
                        }`}
                      >
                        <Check size={11} className={task.completed ? 'opacity-100' : 'opacity-0'} />
                      </button>

                      {/* Content Column */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`text-xs font-semibold truncate ${
                              task.completed ? 'text-neutral-500 line-through' : 'text-white'
                            }`}
                          >
                            {task.title}
                          </h4>

                          {/* Priority tag */}
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                              priorityColors[task.priority]
                            }`}
                          >
                            {task.priority}
                          </span>

                          {/* Category tag */}
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              categoryColors[task.category]
                            }`}
                          >
                            {task.category}
                          </span>

                          {/* Reminder status */}
                          {task.reminderTime && (
                            <span className="flex items-center gap-1 text-[9px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                              <Bell size={9} className="text-[#3B82F6]" />
                              {task.reminderTime}
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Node Footer detail */}
                        <div className="flex items-center gap-3 pt-2 text-[10px] text-neutral-500 border-t border-neutral-900/65">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            Due: {task.dueDate}
                          </span>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <button
                        onClick={() => handleDeleteTask(task.id, task.title)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-neutral-950/40 text-neutral-400 border border-neutral-800 hover:text-rose-400 hover:border-rose-500/20 transition-all duration-200 cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* INTERACTIVE WORKSPACE CALENDAR */}
            <div className="bg-[#18181B]/40 backdrop-blur-md border border-neutral-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} style={{ color: activeTheme.accent1 }} />
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Workspace Calendar</h3>
                    <p className="text-[10px] text-neutral-400 font-medium">Click a date to filter your workspace schedule</p>
                  </div>
                </div>

                {/* Calendar Navigation Buttons */}
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Previous Month"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <span className="text-[10px] font-bold text-neutral-300 min-w-[70px] text-center">
                    {monthName}
                  </span>
                  <button 
                    onClick={handleNextMonth}
                    className="p-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Next Month"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid Container */}
              <div className="space-y-2">
                {/* Weekdays Labels */}
                <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty Spacer cells for start offset */}
                  {Array.from({ length: startDayOfWeek }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="h-11 bg-neutral-900/5 rounded-md border border-transparent"></div>
                  ))}

                  {/* Active Month Days */}
                  {daysArray.map((dayNum) => {
                    const cellYear = calendarYear;
                    const cellMonth = String(calendarMonth + 1).padStart(2, '0');
                    const cellDay = String(dayNum).padStart(2, '0');
                    const cellDateString = `${cellYear}-${cellMonth}-${cellDay}`;
                    
                    const isSelected = selectedCalendarDate === cellDateString;
                    const isToday = new Date().toISOString().split('T')[0] === cellDateString;

                    // Filter tasks due on this calendar day
                    const dayTasks = tasks.filter(t => t.dueDate === cellDateString);

                    return (
                      <button
                        key={`day-${dayNum}`}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedCalendarDate(null); // toggle off
                          } else {
                            setSelectedCalendarDate(cellDateString); // filter by this date
                          }
                        }}
                        className={`h-11 p-1 rounded-md border flex flex-col justify-between items-start transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? 'bg-neutral-900/60 border-neutral-500 shadow-md text-white' 
                            : isToday 
                              ? 'bg-white/5 border-white/20 text-white' 
                              : 'bg-neutral-950/20 border-neutral-900 hover:border-neutral-700 hover:bg-neutral-900/20 text-neutral-400'
                        }`}
                      >
                        {/* Day Number */}
                        <span className={`text-[10px] font-bold ${isToday ? 'text-white underline decoration-2' : ''}`}>
                          {dayNum}
                        </span>

                        {/* Task Dot Indicators with different colors */}
                        <div className="flex flex-wrap gap-0.5 w-full overflow-hidden h-3 items-end">
                          {dayTasks.map((t, idx) => {
                            if (idx >= 3) return null; // cap visual dots
                            let colorClass = 'bg-sky-400';
                            if (t.category === 'personal') colorClass = 'bg-indigo-400';
                            if (t.category === 'creative') colorClass = 'bg-pink-400';
                            if (t.category === 'routine') colorClass = 'bg-amber-400';
                            if (t.completed) colorClass = 'bg-emerald-500 opacity-60';

                            return (
                              <span 
                                key={t.id} 
                                className={`w-1.5 h-1.5 rounded-full ${colorClass}`}
                                title={`${t.title} (${t.category})`}
                              />
                            );
                          })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* HIGHLY VISUAL REMINDERS & ALERTS FEED */}
            <div className="bg-[#18181B]/40 backdrop-blur-md border border-neutral-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-amber-400" />
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Workspace Reminders</h3>
                    <p className="text-[10px] text-neutral-400 font-medium">Auto-scheduler alarms and custom timed notifications</p>
                  </div>
                </div>
              </div>

              {/* Reminders Feed List */}
              <div className="space-y-2.5">
                {tasks.filter(t => t.reminderTime && t.isReminderActive).length === 0 ? (
                  <div className="text-center py-6 bg-neutral-900/10 border border-neutral-900 rounded-lg">
                    <Clock size={16} className="text-neutral-600 mx-auto mb-1.5" />
                    <span className="text-[10px] text-neutral-500 font-semibold block">No active timed reminders set</span>
                    <span className="text-[9px] text-neutral-600 block mt-0.5">Add a reminder time below to schedule notification chimes</span>
                  </div>
                ) : (
                  tasks
                    .filter(t => t.reminderTime && t.isReminderActive)
                    .map(t => {
                      // Color schemes according to category
                      let badgeColor = 'text-sky-400 bg-sky-500/10 border-sky-500/20';
                      if (t.category === 'personal') badgeColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
                      if (t.category === 'creative') badgeColor = 'text-pink-400 bg-pink-500/10 border-pink-500/20';
                      if (t.category === 'routine') badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';

                      // Priority color accent border
                      let priorityBorder = 'border-l-2 border-l-sky-500';
                      if (t.priority === 'medium') priorityBorder = 'border-l-2 border-l-amber-500';
                      if (t.priority === 'high') priorityBorder = 'border-l-2 border-l-rose-500';

                      return (
                        <div 
                          key={`rem-${t.id}`}
                          className={`bg-neutral-950/40 border border-neutral-800/65 ${priorityBorder} p-3 rounded-lg flex items-center justify-between gap-3`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded border uppercase ${badgeColor}`}>
                                {t.category}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wide flex items-center gap-1">
                                <Clock size={10} className="text-amber-500" />
                                {t.reminderTime}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white leading-tight">
                              {t.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[9px] bg-neutral-950 border border-neutral-800 px-2 py-1 rounded text-neutral-400 font-bold tracking-wide uppercase">
                              Active
                            </span>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Add Task Form & Activity History (Col span 4/12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* ADD TASK NODE FORM */}
            <div className="bg-[#18181B]/40 backdrop-blur-md border border-neutral-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-2.5 mb-4 border-b border-neutral-800/80 pb-3">
                <ListTodo style={{ color: activeTheme.accent1 }} size={15} />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  New Task
                </h3>
              </div>

              <form onSubmit={handleAddTask} className="space-y-3.5">
                {/* Title */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                    Task Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="What needs to be done?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter task details..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all duration-200 resize-none font-sans"
                  />
                </div>

                {/* Dual Layout: Category & Priority */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="creative">Creative</option>
                      <option value="routine">Routine</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                      Priority
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Dual Layout: Due Date & Reminder Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                      Due Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none font-sans cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide flex items-center justify-between">
                      Reminder
                    </label>
                    <input
                      type="time"
                      value={newReminderTime}
                      onChange={(e) => setNewReminderTime(e.target.value)}
                      placeholder="HH:MM"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none font-sans cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-neutral-950 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:opacity-95"
                  style={{ backgroundImage: `linear-gradient(to r, ${activeTheme.accent1}, ${activeTheme.accent2})` }}
                >
                  <Plus size={13} className="text-neutral-950" />
                  Add Task
                </button>
              </form>
            </div>

            {/* ACTIVITY LOGGER CONSOLE */}
            <div className="bg-[#18181B]/40 border border-neutral-800 rounded-xl overflow-hidden shadow-lg relative text-xs">
              {/* Header */}
              <div className="bg-neutral-950/40 px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-300 font-bold">
                  <Activity size={13} className="text-emerald-500 animate-pulse" />
                  <span>Activity History</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[9px] text-neutral-400 uppercase font-semibold tracking-wide">Sync Live</span>
                </div>
              </div>

              {/* Logger Body */}
              <div className="p-4 space-y-4 max-h-[30vh] overflow-y-auto text-neutral-400">
                <div className="space-y-2.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider border-b border-neutral-800 pb-1.5 flex items-center justify-between">
                    <span>Recent actions log</span>
                    {isMuted ? (
                      <button onClick={() => setIsMuted(false)} className="text-neutral-500 hover:text-white cursor-pointer" title="Unmute Alerts">
                        <VolumeX size={11} />
                      </button>
                    ) : (
                      <button onClick={() => setIsMuted(true)} className="text-neutral-400 hover:text-white cursor-pointer" title="Mute Alerts">
                        <Volume2 size={11} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {securityEvents.slice(-6).reverse().map((evt) => (
                      <div key={evt.id} className="text-[11px] leading-relaxed flex items-start gap-1.5">
                        <span className="text-neutral-600 shrink-0">[{evt.timestamp.split('T')[1].substring(0, 5)}]</span>
                        <div className="flex-1">
                          <span className={`font-bold uppercase text-[9px] mr-1 ${
                            evt.type === 'warning' ? 'text-rose-400 bg-rose-500/10 px-1 rounded' :
                            evt.type === 'success' ? 'text-emerald-400 bg-emerald-500/10 px-1 rounded' : 'text-neutral-400 bg-neutral-800 px-1 rounded'
                          }`}>
                            {evt.action}:
                          </span>
                          <span className="text-neutral-300">{evt.details}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CUSTOM REMINDER POPUP OVERLAY */}
      {triggeredReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-sm p-6 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-[#3B82F6]">
                <Bell size={18} className="animate-bounce" />
              </div>
              <div>
                <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase block">
                  Task Reminder
                </span>
                <h3 className="text-base font-bold text-white">Schedule Notification</h3>
              </div>
            </div>

            {/* Body */}
            <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800/80 space-y-1.5">
              <h4 className="text-xs font-bold text-[#3B82F6]">{triggeredReminder.title}</h4>
              {triggeredReminder.description && (
                <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                  {triggeredReminder.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-[10px] text-neutral-500 border-t border-neutral-800 pt-2 mt-2">
                <span className="text-[#3B82F6] font-bold">Time: {triggeredReminder.reminderTime}</span>
                <span>|</span>
                <span className="capitalize">Priority: {triggeredReminder.priority}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 mt-6">
              <button
                onClick={() => dismissReminder(true)}
                className="flex-1 py-2 px-3 text-neutral-950 rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-1"
                style={{ backgroundImage: `linear-gradient(to r, ${activeTheme.accent1}, ${activeTheme.accent2})` }}
              >
                <Check size={12} className="text-neutral-950" />
                Done
              </button>
              <button
                onClick={() => dismissReminder(false)}
                className="flex-1 py-2 px-3 bg-neutral-950 hover:bg-neutral-950/60 border border-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
