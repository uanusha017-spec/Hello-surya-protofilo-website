/**
 * Security Rules Verification Suite (Phase 0 TDD)
 * Documents and verifies all 12 Dirty Dozen adversarial payloads against firestore.rules.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'create' | 'update' | 'get' | 'list' | 'delete';
  expected: 'PERMISSION_DENIED';
  reason: string;
}

export const DIRTY_DOZEN_TESTS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated Project Creation',
    collection: 'projects/proj_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'Blocks unauthenticated writes via isSignedIn() && isAdmin()',
  },
  {
    id: 2,
    name: 'Non-Admin Authenticated Project Update',
    collection: 'projects/proj_1',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    reason: 'Blocks non-admin authenticated writes via isAdmin()',
  },
  {
    id: 3,
    name: 'Unverified Admin Email Spoofing',
    collection: 'projects/proj_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'Requires request.auth.token.email_verified == true inside isVerifiedEmail()',
  },
  {
    id: 4,
    name: 'Self-Assigned Admin Escalation',
    collection: 'admins/attacker_uid',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'Blocks non-admin writes to /admins/{uid}',
  },
  {
    id: 5,
    name: 'Shadow / Ghost Field Injection',
    collection: 'projects/proj_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'Rejected by strict data.keys().hasOnly(...) in isValidProject()',
  },
  {
    id: 6,
    name: 'Document ID Poisoning',
    collection: 'projects/bad$id with spaces',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'Rejected by isValidId(projectId) regex and length check',
  },
  {
    id: 7,
    name: 'Oversized Inquiry Message (DoW)',
    collection: 'inquiries/inq_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'Rejected by data.message.size() <= 2000',
  },
  {
    id: 8,
    name: 'Forged Client Timestamp',
    collection: 'inquiries/inq_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'Rejected by incoming().createdAt == request.time',
  },
  {
    id: 9,
    name: 'Inquiry Status Tampering on Create',
    collection: 'inquiries/inq_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'Rejected by incoming().status == "new"',
  },
  {
    id: 10,
    name: 'Non-Admin PII Read on Inquiries',
    collection: 'inquiries',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
    reason: 'PII strictly isolated to verified admins',
  },
  {
    id: 11,
    name: 'Unbounded Deliverables Array',
    collection: 'services/svc_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    reason: 'Rejected by isValidStringList(data.deliverables, 8)',
  },
  {
    id: 12,
    name: 'Immutable createdAt Mutation',
    collection: 'projects/proj_1',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    reason: 'Rejected by incoming().createdAt == existing().createdAt',
  },
];
