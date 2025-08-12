import React, { useState } from 'react';
import { mockActions, mockCARForms } from '../../data/mockData';
import { Calendar, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns';
import { clsx } from 'clsx';

const Timeline: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'quarter'>('month');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getActionsForDate = (date: Date) => {
    return mockActions.filter(action => {
      if (filterStatus !== 'all' && action.status !== filterStatus) return false;
      return isSameDay(action.dueDate, date) || 
             (action.completedDate && isSameDay(action.completedDate, date));
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'for_execution': return 'bg-yellow-500';
      case 'for_verification': return 'bg-purple-500';
      case 'passed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Action Timeline</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Status</option>
              <option value="for_execution">For Execution</option>
              <option value="for_verification">For Verification</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('month')}
              className={clsx(
                'px-3 py-1 rounded text-sm transition-colors',
                viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('quarter')}
              className={clsx(
                'px-3 py-1 rounded text-sm transition-colors',
                viewMode === 'quarter' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              Quarter
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map(day => {
              const dayActions = getActionsForDate(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toISOString()}
                  className={clsx(
                    'min-h-[80px] p-2 border border-gray-100 rounded',
                    isToday ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  )}
                >
                  <div className={clsx(
                    'text-sm font-medium mb-1',
                    isToday ? 'text-blue-700' : 'text-gray-900'
                  )}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayActions.slice(0, 3).map(action => {
                      const carForm = mockCARForms.find(car => car.id === action.carId);
                      return (
                        <div
                          key={action.id}
                          className={clsx(
                            'w-full h-2 rounded text-xs px-1 flex items-center',
                            getStatusColor(action.status)
                          )}
                          title={`${carForm?.title} - ${action.description}`}
                        >
                        </div>
                      );
                    })}
                    {dayActions.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayActions.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Status Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-700">For Execution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-700">For Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Passed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">Failed</span>
          </div>
        </div>
      </div>

      {/* Upcoming Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Upcoming Actions (Next 7 Days)</h4>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {mockActions
              .filter(action => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                return isWithinInterval(action.dueDate, { start: new Date(), end: nextWeek }) &&
                       action.status !== 'passed';
              })
              .map(action => {
                const carForm = mockCARForms.find(car => car.id === action.carId);
                return (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={clsx('w-3 h-3 rounded-full', getStatusColor(action.status))}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{action.description}</p>
                        <p className="text-xs text-gray-600">{carForm?.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{format(action.dueDate, 'MMM dd')}</p>
                      <p className="text-xs text-gray-600">User {action.assignedTo}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;