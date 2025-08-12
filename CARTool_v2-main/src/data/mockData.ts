import { AuditPlan, AuditReport, CARForm, Action, Analytics } from '../types';

export const mockAuditPlans: AuditPlan[] = [
  {
    id: '1',
    title: 'ISO 9001:2015 Quality Management System Audit',
    scope: 'Document Control, Management Review, Internal Audit Process',
    criteria: 'ISO 9001:2015 clauses 7.5, 9.2, 9.3',
    objectives: 'Verify compliance with QMS requirements and effectiveness of processes',
    auditees: ['3', '4'],
    scheduledDate: new Date('2024-02-15'),
    status: 'accepted',
    createdBy: '1',
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    title: 'Environmental Management System Audit',
    scope: 'Waste Management, Energy Consumption, Environmental Monitoring',
    criteria: 'ISO 14001:2015 clauses 8.1, 9.1, 10.2',
    objectives: 'Assess environmental performance and compliance',
    auditees: ['3'],
    scheduledDate: new Date('2024-03-01'),
    status: 'sent',
    createdBy: '1',
    createdAt: new Date('2024-01-20')
  }
];

export const mockAuditReports: AuditReport[] = [
  {
    id: '1',
    planId: '1',
    title: 'ISO 9001:2015 QMS Audit Report - February 2024',
    findings: 'Two non-conformities identified in document control and one OFI in management review process',
    status: 'approved',
    createdBy: '2',
    approvedBy: '4',
    createdAt: new Date('2024-02-16')
  }
];

export const mockCARForms: CARForm[] = [
  {
    id: '1',
    reportId: '1',
    type: 'NC',
    title: 'Outdated Quality Manual Version in Use',
    description: 'Quality Manual Rev 3.1 found in production area while Rev 3.3 is current',
    processArea: 'Document Control',
    clause: '7.5.3',
    rootCause: 'Lack of controlled distribution process for updated documents',
    immediateCorrection: 'Replaced outdated manual with current version',
    status: 'for_verification',
    assignedTo: '3',
    dueDate: new Date('2024-03-15'),
    createdBy: '2',
    approvedBy: '1',
    createdAt: new Date('2024-02-17')
  },
  {
    id: '2',
    reportId: '1',
    type: 'OFI',
    title: 'Management Review Meeting Minutes Enhancement',
    description: 'Include more detailed action items and responsibility assignments',
    processArea: 'Management Review',
    clause: '9.3.3',
    status: 'for_execution',
    assignedTo: '4',
    dueDate: new Date('2024-03-30'),
    createdBy: '2',
    createdAt: new Date('2024-02-17')
  },
  {
    id: '3',
    reportId: '1',
    type: 'NC',
    title: 'Missing Calibration Records',
    description: 'Temperature monitoring equipment lacks calibration certificates',
    processArea: 'Monitoring and Measurement',
    clause: '7.1.5',
    rootCause: 'Calibration schedule not properly maintained',
    status: 'passed',
    assignedTo: '3',
    dueDate: new Date('2024-02-28'),
    createdBy: '1',
    approvedBy: '1',
    createdAt: new Date('2024-02-17')
  }
];

export const mockActions: Action[] = [
  {
    id: '1',
    carId: '1',
    description: 'Implement controlled document distribution matrix and update procedure',
    status: 'for_verification',
    assignedTo: '3',
    dueDate: new Date('2024-03-15'),
    originalDueDate: new Date('2024-03-10'),
    createdAt: new Date('2024-02-18')
  },
  {
    id: '2',
    carId: '2',
    description: 'Revise management review template to include detailed action items section',
    status: 'for_execution',
    assignedTo: '4',
    dueDate: new Date('2024-03-30'),
    originalDueDate: new Date('2024-03-30'),
    createdAt: new Date('2024-02-18')
  },
  {
    id: '3',
    carId: '3',
    description: 'Establish calibration tracking system and schedule',
    status: 'passed',
    assignedTo: '3',
    dueDate: new Date('2024-02-28'),
    originalDueDate: new Date('2024-02-28'),
    completedDate: new Date('2024-02-25'),
    verifiedBy: '2',
    createdAt: new Date('2024-02-18')
  }
];

export const mockAnalytics: Analytics = {
  totalNCs: 8,
  totalOFIs: 3,
  completedActions: 12,
  overdueActions: 2,
  repeatedNCs: 1,
  ncsByProcessArea: {
    'Document Control': 3,
    'Management Review': 2,
    'Monitoring and Measurement': 2,
    'Risk Management': 1
  },
  ncsByClause: {
    '7.5.3': 3,
    '9.3.3': 2,
    '7.1.5': 2,
    '6.1.1': 1
  }
};