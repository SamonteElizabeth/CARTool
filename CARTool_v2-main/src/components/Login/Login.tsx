import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) setError('Invalid email or password.');
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Lead Auditor', email: 'lead.auditor@company.com' },
    { role: 'Auditor', email: 'auditor@company.com' },
    { role: 'Auditee', email: 'auditee@company.com' },
    { role: 'AP Manager', email: 'ap.manager@company.com' },
    { role: 'Executive', email: 'executive@company.com' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl flex flex-col lg:flex-row gap-8">
        
        {/* Left - Login Form */}
        <div className="flex-1">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-3">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">IAMS</h1>
            <p className="text-gray-500 text-sm">Internal Audit Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Right - Demo Accounts */}
        <div className="flex-1 border-l pl-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Demo Accounts</h2>
          <div className="space-y-2">
            {demoAccounts.map((acc, i) => (
              <button
                key={i}
                onClick={() => {
                  setEmail(acc.email);
                  setPassword('demo123');
                }}
                className="w-full text-left px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm"
              >
                {acc.role} — {acc.email}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">Password: demo123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
