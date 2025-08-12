import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login/Login';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import AuditPlans from './components/AuditPlans/AuditPlans';
import AuditReports from './components/AuditReports/AuditReports';
import CARForms from './components/CARForms/CARForms';
import Actions from './components/Actions/Actions';
import Timeline from './components/Timeline/Timeline';
import DueDateLogs from './components/DueDateLogs/DueDateLogs';
import ReportsSummary from './components/ReportsSummary/ReportsSummary';
import Analytics from './components/Analytics/Analytics';

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'audit-plans':
        return <AuditPlans />;
      case 'audit-reports':
        return <AuditReports />;
      case 'car-forms':
        return <CARForms />;
      case 'assigned-findings':
        return <CARForms />;
      case 'actions':
      case 'my-actions':
        return <Actions />;
      case 'timeline':
        return <Timeline />;
      case 'due-date-logs':
        return <DueDateLogs />;
      case 'reports-summary':
        return <ReportsSummary />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}

export default App;