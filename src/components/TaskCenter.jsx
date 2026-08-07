import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Repeat, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  ListTodo
} from 'lucide-react';

export default function TaskCenter({ tasks, setTasks }) {
  const [filter, setFilter] = useState('All');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('Duties');
  const [newTaskRecurring, setNewTaskRecurring] = useState('None');
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [newSubtaskText, setNewSubtaskText] = useState({});

  const todayStr = new Date().toISOString().split('T')[0];

  const handleToggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      category: newTaskCategory,
      dueDate: todayStr,
      completed: false,
      recurring: newTaskRecurring,
      subtasks: [],
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedSubs = (task.subtasks || []).map(s => 
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        return { ...task, subtasks: updatedSubs };
      }
      return task;
    }));
  };

  const handleAddSubtask = (taskId) => {
    const text = newSubtaskText[taskId];
    if (!text || !text.trim()) return;

    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newSub = {
          id: `sub-${Date.now()}`,
          title: text.trim(),
          completed: false,
        };
        return { ...task, subtasks: [...(task.subtasks || []), newSub] };
      }
      return task;
    }));

    setNewSubtaskText(prev => ({ ...prev, [taskId]: '' }));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'Today') return t.dueDate === todayStr && !t.completed;
    if (filter === 'High Priority') return t.priority === 'high' && !t.completed;
    if (filter === 'Completed') return t.completed;
    if (filter === 'Upcoming') return !t.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Overall Progress */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Tasks & Duty Command Center</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Keep track of daily rituals, recurring duties, and urgent high-priority focus items.
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full md:w-64 bg-slate-900/80 p-3 rounded-xl border border-white/10">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-slate-400">Completion</span>
            <span className="text-emerald-400 font-bold">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-pink-500 h-full transition-all duration-300 shadow-[0_0_10px_rgba(0,255,157,0.5)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Inline Quick Add Task Bar */}
      <form onSubmit={handleAddTask} className="glass-panel p-3 rounded-2xl flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Quick add new task or duty..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 min-w-[200px] bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
        />

        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
          className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
        >
          <option value="high">🔴 High Priority</option>
          <option value="medium">🔵 Medium Priority</option>
          <option value="low">🟢 Low Priority</option>
        </select>

        <select
          value={newTaskRecurring}
          onChange={(e) => setNewTaskRecurring(e.target.value)}
          className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
        >
          <option value="None">One-time Task</option>
          <option value="Daily">Daily Duty</option>
          <option value="Weekly">Weekly Duty</option>
          <option value="Monthly">Monthly Ritual</option>
        </select>

        <button
          type="submit"
          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,255,157,0.2)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Duty</span>
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {['All', 'Today', 'Upcoming', 'High Priority', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-[0_0_12px_rgba(0,255,157,0.2)]'
                : 'bg-slate-900/60 text-slate-400 border border-white/10 hover:text-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border-dashed border-white/10">
          <ListTodo className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No tasks found</h3>
          <p className="text-xs text-slate-500 mt-1">All clear! Add a new duty above to track your schedule.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            const subtasks = task.subtasks || [];
            const completedSubs = subtasks.filter(s => s.completed).length;

            const priorityBadge = 
              task.priority === 'high' 
                ? 'bg-pink-500/10 text-pink-400 border-pink-500/30 glow-border-magenta' 
                : task.priority === 'medium'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

            return (
              <div
                key={task.id}
                className={`glass-card p-4 rounded-2xl transition-all border ${
                  task.completed ? 'opacity-60 border-white/5' : 'border-white/10 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  
                  {/* Left Checkbox & Info */}
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_10px_rgba(0,255,157,0.6)]'
                          : 'border-white/30 hover:border-emerald-400 bg-slate-900/60'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4 text-slate-950 font-bold" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <span className={`text-sm font-medium block truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {task.title}
                      </span>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${priorityBadge}`}>
                          {task.priority.toUpperCase()}
                        </span>

                        {task.recurring !== 'None' && (
                          <span className="flex items-center text-amber-300 font-mono text-[10px]">
                            <Repeat className="w-3 h-3 mr-1" />
                            {task.recurring}
                          </span>
                        )}

                        {subtasks.length > 0 && (
                          <span className="text-slate-400 font-mono text-[10px]">
                            Subtasks: {completedSubs}/{subtasks.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg bg-slate-900/60 border border-white/5"
                      title="Toggle subtasks"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900/60"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Subtask Section */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2 pl-8">
                    {subtasks.map((sub) => (
                      <div key={sub.id} className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={sub.completed}
                          onChange={() => handleToggleSubtask(task.id, sub.id)}
                          className="rounded border-white/20 accent-emerald-400"
                        />
                        <span className={sub.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                          {sub.title}
                        </span>
                      </div>
                    ))}

                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add subtask..."
                        value={newSubtaskText[task.id] || ''}
                        onChange={(e) => setNewSubtaskText({ ...newSubtaskText, [task.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask(task.id)}
                        className="bg-slate-900/90 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSubtask(task.id)}
                        className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
