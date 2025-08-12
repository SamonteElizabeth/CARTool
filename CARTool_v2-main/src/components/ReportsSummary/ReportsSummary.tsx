import React, { useState } from 'react';
import { mockCARForms, mockActions, mockAuditReports } from '../../data/mockData';
import { FileText, TrendingUp, AlertTriangle, CheckCircle, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const ReportsSummary: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getAuditMaturityLevel = () => {
    const totalFindings = mockCARForms.length;
    const completedActions = mockActions.filter(action => action.status === 'passed').length;
    const totalActions = mockActions.length;
    
    const completionRate = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;
    
    if (completionRate >= 90) return { level: 'Advanced', color: 'text-green-600', bg: 'bg-green-100' };
    if (completionRate >= 70) return { level: 'Developing', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (completionRate >= 50) return { level: 'Basic', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Initial', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const maturity = getAuditMaturityLevel();

  const getCARsByStatus = () => {
    const ongoing = mockCARForms.filter(car => 
      car.status === 'for_response' || car.status === 'for_approval' || car.status === 'for_verification'
    ).length;
    
    const forCompletion = mockCARForms.filter(car => car.status === 'for_verification').length;
    const completed = mockCARForms.filter(car => car.status === 'passed').length;
    
    return { ongoing, forCompletion, completed };
  };

  const carStats = getCARsByStatus();

  const getKeyHighlights = () => [
    'Significant improvement in document control processes',
    'Enhanced management review effectiveness',
    'Successful implementation of calibration tracking system',
    'Improved stakeholder engagement in audit processes'
  ];

  const getKeyLowlights = () => [
    'Recurring issues in document version control',
    'Delayed response times for corrective actions',
    'Need for better training on audit procedures'
  ];

  const getMajorNCs = () => mockCARForms.filter(car => car.type === 'NC' && car.clause.includes('7.')).length;
  const getMinorNCs = () => mockCARForms.filter(car => car.type === 'NC' && !car.clause.includes('7.')).length;
  const getOFIs = () => mockCARForms.filter(car => car.type === 'OFI').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports Summary</h2>
          <p className="text-gray-600">Executive overview of audit performance and maturity</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="Q4-2024">Q4 2024</option>
              <option value="Q3-2024">Q3 2024</option>
            </select>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Audit Maturity</p>
              <p className={clsx('text-xl font-bold', maturity.color)}>{maturity.level}</p>
            </div>
            <div className={clsx('p-3 rounded-full', maturity.bg)}>
              <TrendingUp className={clsx('w-6 h-6', maturity.color)} />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={clsx('h-2 rounded-full', 
                  maturity.level === 'Advanced' ? 'bg-green-600' :
                  maturity.level === 'Developing' ? 'bg-blue-600' :
                  maturity.level === 'Basic' ? 'bg-yellow-600' : 'bg-red-600'
                )}
                style={{ 
                  width: maturity.level === 'Advanced' ? '90%' :
                         maturity.level === 'Developing' ? '70%' :
                         maturity.level === 'Basic' ? '50%' : '30%'
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Audits</p>
              <p className="text-2xl font-bold text-gray-900">{mockAuditReports.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 15% from last period</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Major NCs</p>
              <p className="text-2xl font-bold text-red-600">{getMajorNCs()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2">↓ 25% from last period</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Action Completion</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round((mockActions.filter(a => a.status === 'passed').length / mockActions.length) * 100)}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 12% from last period</p>
        </div>
      </div>

      {/* CAR Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">CAR Forms by Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600">{carStats.ongoing}</div>
              <div className="text-sm text-yellow-700 font-medium">Ongoing</div>
              <div className="text-xs text-yellow-600 mt-1">In Progress</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">{carStats.forCompletion}</div>
              <div className="text-sm text-purple-700 font-medium">For Completion</div>
              <div className="text-xs text-purple-600 mt-1">Awaiting Verification</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">{carStats.completed}</div>
              <div className="text-sm text-green-700 font-medium">Completed</div>
              <div className="text-xs text-green-600 mt-1">Successfully Closed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Findings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Findings Breakdown</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  <span className="font-medium text-gray-900">Major Non-Conformities</span>
                </div>
                <span className="text-lg font-bold text-red-600">{getMajorNCs()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-600 rounded"></div>
                  <span className="font-medium text-gray-900">Minor Non-Conformities</span>
                </div>
                <span className="text-lg font-bold text-orange-600">{getMinorNCs()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-amber-600 rounded"></div>
                  <span className="font-medium text-gray-900">Opportunities for Improvement</span>
                </div>
                <span className="text-lg font-bold text-amber-600">{getOFIs()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Audit Reports</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {mockAuditReports.map(report => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-600">{format(report.createdAt, 'MMM dd, yyyy')}</p>
                  </div>
                  <span className={clsx(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    report.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  )}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Highlights and Lowlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 text-green-700">Key Highlights</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {getKeyHighlights().map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 text-amber-700">Areas for Improvement</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {getKeyLowlights().map((lowlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{lowlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsSummary;