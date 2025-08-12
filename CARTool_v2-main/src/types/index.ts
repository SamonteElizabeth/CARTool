export interface User {
  id: string;
  email: string;
  name: string;
  role: 'lead_auditor' | 'auditor' | 'auditee' | 'ap_manager' | 'executive';
  department?: string;
}

export interface AuditPlan {
  id: string;
  title: string;
  scope: string;
  criteria: string;
  objectives: string;
  auditees: string[];
  scheduledDate: Date;
  status: 'draft' | 'sent' | 'accepted' | 'completed';
  createdBy: string;
  createdAt: Date;
}

export interface AuditReport {
  id: string;
  planId: string;
  title: string;
  findings: string;
  status: 'draft' | 'submitted' | 'approved';
  createdBy: string;
  approvedBy?: string;
  createdAt: Date;
}

export interface CARForm {
  id: string;
  reportId: string;
  type: 'NC' | 'OFI';
  title: string;
  description: string;
  processArea: string;
  clause: string;
  rootCause?: string;
  immediateCorrection?: string;
  status: 'for_response' | 'for_approval' | 'for_verification' | 'passed' | 'failed';
  assignedTo: string;
  dueDate: Date;
  createdBy: string;
  approvedBy?: string;
  createdAt: Date;
}

export interface Action {
  id: string;
  carId: string;
  description: string;
  evidence?: string;
  status: 'for_execution' | 'for_verification' | 'passed' | 'failed';
  assignedTo: string;
  dueDate: Date;
  originalDueDate: Date;
  completedDate?: Date;
  verifiedBy?: string;
  createdAt: Date;
}

export interface DueDateLog {
  id: string;
  actionId: string;
  oldDate: Date;
  newDate: Date;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface Analytics {
  totalNCs: number;
  totalOFIs: number;
  completedActions: number;
  overdueActions: number;
  repeatedNCs: number;
  ncsByProcessArea: Record<string, number>;
  ncsByClause: Record<string, number>;
}