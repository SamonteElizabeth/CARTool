import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockCARForms, mockActions, mockAuditPlans } from '../../data/mockData';
import { 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckSquare, 
  TrendingUp, 
  Clock,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getStats = () => {
    const totalCARS = mockCARForms.length;
    const ncCount = mockCARForms.filter(car => car.type === 'NC').length;
    const ofiCount = mockCARForms.filter(car => car.type === 'OFI').length;
    const overdueActions = mockActions.filter(action => 
      action.status !== 'passed' && new Date(action.dueDate) < new Date()
    ).length;
    const completedActions = mockActions.filter(action => action.status === 'passed').length;
    const pendingPlans = mockAuditPlans.filter(plan => plan.status === 'draft' || plan.status === 'sent').length;
    const completionRate = mockActions.length > 0 ? Math.round((completedActions / mockActions.length) * 100) : 0;

    return {
      totalCARS,
      ncCount,
      ofiCount,
      overdueActions,
      completedActions,
      pendingPlans,
      completionRate
    };
  };

  const stats = getStats();

  const getQuickActions = () => {
    switch (user?.role) {
      case 'lead_auditor':
        return [
          { label: 'Create Audit Plan', icon: Calendar, action: () => {}, color: 'bg-purple-500 hover:bg-purple-600' },
          { label: 'Approve CAR Forms', icon: AlertTriangle, action: () => {}, color: 'bg-red-500 hover:bg-red-600' },
          { label: 'Review Reports', icon: FileText, action: () => {}, color: 'bg-green-500 hover:bg-green-600' },
          { label: 'View Analytics', icon: TrendingUp, action: () => {}, color: 'bg-blue-500 hover:bg-blue-600' }
        ];
      case 'auditor':
        return [
          { label: 'Create Audit Report', icon: FileText, action: () => {}, color: 'bg-green-500 hover:bg-green-600' },
          { label: 'Initiate CAR Form', icon: AlertTriangle, action: () => {}, color: 'bg-red-500 hover:bg-red-600' },
          { label: 'Verify Actions', icon: CheckSquare, action: () => {}, color: 'bg-amber-500 hover:bg-amber-600' }
        ];
      case 'auditee':
        return [
          { label: 'View My Actions', icon: CheckSquare, action: () => {}, color: 'bg-amber-500 hover:bg-amber-600' },
          { label: 'Upload Evidence', icon: FileText, action: () => {}, color: 'bg-green-500 hover:bg-green-600' },
          { label: 'Request Extension', icon: Clock, action: () => {}, color: 'bg-blue-500 hover:bg-blue-600' }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  const getRecentActivity = () => {
    return [
      { 
        type: 'CAR Created', 
        description: 'NC-2024-001 assigned to Emma Wilson', 
        time: '2 hours ago',
        icon: AlertTriangle,
        color: 'text-red-500'
      },
      { 
        type: 'Action Completed', 
        description: 'Calibration tracking system implemented', 
        time: '1 day ago',
        icon: CheckSquare,
        color: 'text-green-500'
      },
      { 
        type: 'Report Approved', 
        description: 'ISO 9001:2015 QMS Audit Report approved', 
        time: '2 days ago',
        icon: FileText,
        color: 'text-blue-500'
      },
      { 
        type: 'Due Date Extended', 
        description: 'Document control action extended to March 20', 
        time: '3 days ago',
        icon: Clock,
        color: 'text-amber-500'
      }
    ];
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            {getWelcomeMessage()}, {user?.name}! 👋
          </h1>
          <p className="text-blue-100 text-lg font-medium mb-4">
            Here's your audit management overview for today
          </p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>System Status: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Role: {user?.role?.replace(/_/g, ' ').toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card group hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total CAR Forms</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCARS}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="text-red-600 font-semibold flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  NC: {stats.ncCount}
                </span>
                <span className="text-amber-600 font-semibold flex items-center gap-1">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  OFI: {stats.ofiCount}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="metric-card group hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completed Actions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedActions}</p>
              <div className="flex items-center gap-1 mt-3 text-sm text-green-600 font-semibold">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="metric-card group hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Overdue Actions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.overdueActions}</p>
              <div className="flex items-center gap-1 mt-3 text-sm text-red-600 font-semibold">
                <Target className="w-4 h-4" />
                <span>Requires attention</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="metric-card group hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completionRate}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 card-shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`flex items-center gap-3 p-4 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg ${action.color}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 card-shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {getRecentActivity().map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-2 font-medium">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-2xl p-6 card-shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Performance Overview</h3>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">View Details →</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {((stats.completedActions / (stats.completedActions + stats.overdueActions || 1)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-blue-700 font-semibold">Action Completion Rate</div>
            <div className="text-xs text-blue-600 mt-1">Target: 90%</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.completedActions + stats.overdueActions}
            </div>
            <div className="text-sm text-green-700 font-semibold">Total Active Actions</div>
            <div className="text-xs text-green-600 mt-1">Across all audits</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {stats.totalCARS}
            </div>
            <div className="text-sm text-amber-700 font-semibold">Total Findings</div>
            <div className="text-xs text-amber-600 mt-1">NC + OFI combined</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;