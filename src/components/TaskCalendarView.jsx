import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function TaskCalendarView({ tasks, onToggleTask, onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month & total days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Format date string as YYYY-MM-DD
  const formatDateKey = (dayNum) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Group tasks by date key
  const tasksByDate = {};
  tasks.forEach(t => {
    if (t.dueDate) {
      if (!tasksByDate[t.dueDate]) tasksByDate[t.dueDate] = [];
      tasksByDate[t.dueDate].push(t);
    }
  });

  const todayKey = new Date().toISOString().split('T')[0];

  return (
    <div className="glass-panel p-5 rounded-2xl space-y-4 border border-cyan-500/30">
      
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              {monthNames[month]} {year}
            </h3>
            <p className="text-xs text-slate-400 font-mono">Graphical Duty & Deadline Timeline</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-cyan-300 hover:bg-slate-800"
          >
            Today
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-slate-400 font-bold">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-1 uppercase tracking-wider">{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Blank cells for offset before month start */}
        {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
          <div key={`offset-${idx}`} className="h-24 rounded-xl bg-slate-950/40 border border-white/5 opacity-30" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const dateKey = formatDateKey(dayNum);
          const dayTasks = tasksByDate[dateKey] || [];
          const isToday = dateKey === todayKey;

          return (
            <div
              key={dateKey}
              onClick={() => onSelectDate && onSelectDate(dateKey)}
              className={`h-28 p-2 rounded-xl border flex flex-col justify-between transition-all cursor-pointer group ${
                isToday
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold ${isToday ? 'text-cyan-300' : 'text-slate-300'}`}>
                  {dayNum}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-mono text-slate-400">
                    {dayTasks.length} {dayTasks.length === 1 ? 'duty' : 'duties'}
                  </span>
                )}
              </div>

              {/* Task Pills on Cell */}
              <div className="space-y-1 my-1 overflow-y-auto max-h-16 scrollbar-none">
                {dayTasks.slice(0, 3).map((t) => {
                  const badgeColor = t.completed
                    ? 'bg-slate-800 text-slate-500 line-through border-white/5'
                    : t.priority === 'high'
                    ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                    : t.priority === 'medium'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

                  return (
                    <div
                      key={t.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleTask) onToggleTask(t.id);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono truncate border flex items-center justify-between ${badgeColor}`}
                      title={t.title}
                    >
                      <span className="truncate">{t.title}</span>
                      {t.completed && <CheckCircle2 className="w-2.5 h-2.5 ml-1 shrink-0 text-emerald-400" />}
                    </div>
                  );
                })}
                {dayTasks.length > 3 && (
                  <div className="text-[9px] font-mono text-cyan-400 text-center">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>

              {/* Hover Quick Add Indicator */}
              <div className="text-[9px] font-mono text-slate-500 group-hover:text-cyan-400 flex items-center justify-end">
                <Plus className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
