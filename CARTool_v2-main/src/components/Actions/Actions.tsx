import React, { useState } from 'react';
import { mockActions, mockCARForms } from '../../data/mockData';
import { CheckSquare, Plus, User, Calendar, Clock, Upload, AlertTriangle, FileText } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { clsx } from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

const Actions: React.FC = () => {
  const { user } = useAuth();
  const [actions] = useState(mockActions);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showExtensionForm, setShowExtensionForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'for_execution': return 'bg-yellow-100 text-yellow-800';
      case 'for_verification': return 'bg-purple-100 text-purple-800';
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckSquare className="w-4 h-4 text-green-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'for_verification': return <Clock className="w-4 h-4 text-purple-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const isOverdue = (dueDate: Date, status: string) => {
    return status !== 'passed' && isAfter(new Date(), dueDate);
  };

  const canCreateAction = () => {
    return user?.role === 'auditee';
  };

  const canVerify = () => {
    return user?.role === 'auditor' || user?.role === 'lead_auditor';
  };

  const getMyActions = () => {
    if (user?.role === 'auditee') {
      return actions.filter(action => action.assignedTo === user.id);
    }
    return actions;
  };

  const filteredActions = getMyActions();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.role === 'auditee' ? 'My Actions' : 'Actions'}
          </h2>
        </div>
        {canCreateAction() && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Declare Action
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CAR Form
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActions.map((action) => {
                const carForm = mockCARForms.find(car => car.id === action.carId);
                const overdue = isOverdue(action.dueDate, action.status);
                
                return (
                  <tr key={action.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{action.description}</p>
                        {action.evidence && (
                          <div className="flex items-center gap-1 mt-1">
                            <FileText className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-600">Evidence uploaded</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{carForm?.title || 'N/A'}</p>
                        <span className={clsx(
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1',
                          carForm?.type === 'NC' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        )}>
                          {carForm?.type || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">User {action.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className={clsx(
                            'text-sm',
                            overdue ? 'text-red-600 font-medium' : 'text-gray-900'
                          )}>
                            {format(action.dueDate, 'MMM dd, yyyy')}
                          </span>
                          {overdue && (
                            <p className="text-xs text-red-600">Overdue</p>
                          )}
                          {action.dueDate.getTime() !== action.originalDueDate.getTime() && (
                            <p className="text-xs text-blue-600">Extended</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(action.status)}
                        <span className={clsx(
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          getStatusColor(action.status)
                        )}>
                          {action.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                        {user?.role === 'auditee' && action.assignedTo === user.id && (
                          <>
                            {action.status === 'for_execution' && (
                              <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1">
                                <Upload className="w-3 h-3" />
                                Upload
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setSelectedAction(action.id);
                                setShowExtensionForm(true);
                              }}
                              className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                            >
                              Extend
                            </button>
                          </>
                        )}
                        {canVerify() && action.status === 'for_verification' && (
                          <>
                            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                              Pass
                            </button>
                            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                              Fail
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Declare Corrective Action</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select CAR Form
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select a CAR form</option>
                    {mockCARForms.filter(car => car.assignedTo === user?.id).map(car => (
                      <option key={car.id} value={car.id}>{car.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the corrective action to be implemented"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supporting Evidence (Optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload documents, photos, or other evidence</p>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Declare Action
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showExtensionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Due Date Extension</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Extension
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Explain why you need more time"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Request Extension
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExtensionForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Actions;