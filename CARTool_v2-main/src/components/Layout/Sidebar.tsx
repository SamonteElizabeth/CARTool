import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, FileText, AlertTriangle, CheckSquare, Baseline as Timeline, BarChart3, Settings, Home, Clock, TrendingUp, Shield, Users } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-400' }
    ];

    switch (user?.role) {
      case 'lead_auditor':
        return [
          ...baseItems,
          { id: 'audit-plans', label: 'Audit Plans', icon: Calendar, color: 'text-purple-400' },
          { id: 'audit-reports', label: 'Audit Reports', icon: FileText, color: 'text-green-400' },
          { id: 'car-forms', label: 'CAR Forms', icon: AlertTriangle, color: 'text-red-400' },
          { id: 'actions', label: 'Actions', icon: CheckSquare, color: 'text-amber-400' },
          { id: 'timeline', label: 'Timeline', icon: Timeline, color: 'text-indigo-400' },
          { id: 'due-date-logs', label: 'Due Date Logs', icon: Clock, color: 'text-cyan-400' },
          { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-pink-400' },
        ];
      
      case 'auditor':
        return [
          ...baseItems,
          { id: 'audit-reports', label: 'Audit Reports', icon: FileText, color: 'text-green-400' },
          { id: 'car-forms', label: 'CAR Forms', icon: AlertTriangle, color: 'text-red-400' },
          { id: 'actions', label: 'Actions', icon: CheckSquare, color: 'text-amber-400' },
          { id: 'timeline', label: 'Timeline', icon: Timeline, color: 'text-indigo-400' }
        ];
      
      case 'auditee':
        return [
          ...baseItems,
          { id: 'my-actions', label: 'My Actions', icon: CheckSquare, color: 'text-amber-400' },
          { id: 'assigned-findings', label: 'Assigned Findings', icon: AlertTriangle, color: 'text-red-400' },
          { id: 'timeline', label: 'My Timeline', icon: Timeline, color: 'text-indigo-400' }
        ];
      
      case 'ap_manager':
        return [
          ...baseItems,
          { id: 'audit-reports', label: 'Audit Reports', icon: FileText, color: 'text-green-400' },
          { id: 'car-forms', label: 'CAR Forms', icon: AlertTriangle, color: 'text-red-400' },
          { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-pink-400' },
          { id: 'reports-summary', label: 'Reports Summary', icon: TrendingUp, color: 'text-emerald-400' }
        ];
      
      case 'executive':
        return [
          ...baseItems,
          { id: 'reports-summary', label: 'Executive Summary', icon: TrendingUp, color: 'text-emerald-400' },
          { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-pink-400' }
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-72 sidebar-gradient min-h-screen shadow-2xl">
      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden',
                isActive
                  ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl" />
              )}
              <Icon className={clsx(
                'w-5 h-5 transition-all duration-200 relative z-10',
                isActive ? 'text-white scale-110' : item.color
              )} />
              <span className={clsx(
                'font-medium relative z-10 transition-all duration-200',
                isActive ? 'text-white' : 'group-hover:text-white'
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute right-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="text-center">
          <p className="text-slate-400 text-xs">© 2024 IAMS Platform</p>
          <p className="text-slate-500 text-xs mt-1">Version 2.1.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;