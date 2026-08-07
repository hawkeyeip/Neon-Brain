import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  isSameMonth, 
  isToday,
  parseISO,
  isSameDay
} from 'date-fns';

export default function CalendarView({ resources, onEdit, onSelectTab, setSearchText }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get weekday offset of the first day of the month (0 = Sun, 6 = Sat)
  const startDayOfWeek = getDay(monthStart);

  // Pad the calendar grid at the start
  const paddingDays = [];
  if (startDayOfWeek > 0) {
    const prevMonthEnd = endOfMonth(subMonths(currentMonth, 1));
    const prevMonthDays = eachDayOfInterval({ 
      start: startOfMonth(subMonths(currentMonth, 1)), 
      end: prevMonthEnd 
    });
    for (let i = prevMonthDays.length - startDayOfWeek; i < prevMonthDays.length; i++) {
      paddingDays.push(prevMonthDays[i]);
    }
  }

  // Combine padding and actual days
  const allDays = [...paddingDays.map(d => ({ date: d, isCurrentMonth: false })), 
                   ...daysInMonth.map(d => ({ date: d, isCurrentMonth: true }))];

  // Pad the end to complete the grid (multiples of 7)
  const totalCells = Math.ceil(allDays.length / 7) * 7;
  const nextMonthStart = startOfMonth(addMonths(currentMonth, 1));
  const nextMonthDays = eachDayOfInterval({
    start: nextMonthStart,
    end: endOfMonth(nextMonthStart)
  });
  
  const endPaddingCount = totalCells - allDays.length;
  for (let i = 0; i < endPaddingCount; i++) {
    allDays.push({ date: nextMonthDays[i], isCurrentMonth: false });
  }

  // Group events by YYYY-MM-DD
  const getEventsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return resources.filter(r => r.expiryDate === dateStr && !r.used);
  };

  const handleEventClick = (event) => {
    // Search for this item in the tracker tab
    setSearchText(event.name);
    onSelectTab('tracker');
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-section">
      <div className="calendar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="logo-icon" style={{ padding: '0.4rem', borderRadius: '8px' }}>
            <CalendarIcon size={18} />
          </div>
          <h2 style={{ fontSize: '1.25rem' }}>Renewal & Expiry Timeline</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary btn-icon-only" onClick={prevMonth}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '1.1rem', minWidth: '130px', textAlign: 'center' }}>
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button className="btn btn-secondary btn-icon-only" onClick={nextMonth}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {/* Days of week header */}
        {weekdays.map(day => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}

        {/* Days grid */}
        {allDays.map(({ date, isCurrentMonth }, idx) => {
          const events = getEventsForDate(date);
          const cellIsToday = isToday(date);
          
          return (
            <div 
              key={idx} 
              className={`calendar-day-cell ${isCurrentMonth ? '' : 'other-month'} ${cellIsToday ? 'today' : ''}`}
            >
              <span className="calendar-day-num">{format(date, 'd')}</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, overflowY: 'auto' }}>
                {events.map(event => (
                  <div 
                    key={event.id} 
                    className={`calendar-event ${event.type}`}
                    onClick={() => handleEventClick(event)}
                    style={{ cursor: 'pointer' }}
                    title={`${event.name} - ${event.type === 'subscription' ? 'Renews' : 'Expires'}`}
                  >
                    {event.type === 'subscription' ? '🔄 ' : '⏳ '}
                    {event.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
