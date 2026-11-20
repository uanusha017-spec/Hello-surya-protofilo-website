# Firestore Security Specification — HK Surya Digital Solutions

## 1. Data Invariants

1. **Default Deny**: Any unmatched Firestore path must be denied for all read/write operations.
2. **Admin-Only CMS Writes**: Only verified administrators (`isAdmin()`) may create, update, or delete documents in `/projects`, `/services`, `/siteConfig`, and `/admins`.
3. **Verified Email Requirement**: Bootstrapped admin email checks strictly require `request.auth.token.email_verified == true`.
4. **PII Isolation on Inquiries**: `/inquiries/{inquiryId}` contains visitor personal contact details (`name`, `email`, `phone`, `message`). Unauthenticated and non-admin users may ONLY `create` a strictly validated new inquiry (`status == 'new'`), and are completely blocked from `get`, `list`, `update`, or `delete`.
5. **Strict Keys & Size Bounds**: Every write validates exact key membership (`hasAll` + `hasOnly`), string `.size()` limits, bounded list lengths (`<= 8` deliverables), regex ID checks (`^[a-zA-Z0-9_-]+$`), URL/email patterns, and server-enforced timestamps (`request.time`).
6. **Immutability & Terminal State**: `createdAt` is immutable on updates. Inquiries with `status == 'archived'` are locked unless overridden by an admin.

## 2. The "Dirty Dozen" Payloads

1. **Unauthenticated Project Creation**: Anonymous client attempts `create` on `/projects/p1` → `PERMISSION_DENIED`.
2. **Non-Admin Authenticated Project Update**: Signed-in non-admin user attempts `update` on `/projects/p1` → `PERMISSION_DENIED`.
3. **Email Spoofing (Unverified Admin Email)**: Token has `email: "uanusha017@gmail.com"` with `email_verified: false` → `PERMISSION_DENIED`.
4. **Self-Admin Privilege Escalation**: Signed-in non-admin writes `/admins/{uid}` → `PERMISSION_DENIED`.
5. **Shadow / Ghost Field Injection**: Admin creates project with extra key `isSuperAdmin: true` → `PERMISSION_DENIED` (`hasOnly` rejection).
6. **ID Poisoning**: Creating `/projects/invalid$id!with*spaces` or a 200-char ID → `PERMISSION_DENIED` (`isValidId` rejection).
7. **Oversized Payload / Denial of Wallet**: Creating an inquiry with a 5,000-char `message` → `PERMISSION_DENIED` (`.size() <= 2000` rejection).
8. **Client Timestamp Forgery**: Creating an inquiry with backdated `createdAt` (`!= request.time`) → `PERMISSION_DENIED`.
9. **Inquiry Status Tampering on Create**: Visitor submits inquiry with `status: "replied"` instead of `"new"` → `PERMISSION_DENIED`.
10. **PII Leak Attempt (Inquiry Read)**: Signed-in non-admin calls `get` or `list` on `/inquiries` → `PERMISSION_DENIED`.
11. **Unbounded Array Injection**: Admin submits project with 12 deliverables (`> 8`) → `PERMISSION_DENIED`.
12. **Immutable Timestamp Mutation**: Admin attempts to alter `createdAt` during an `update` on `/projects/p1` → `PERMISSION_DENIED`.
