# Room Access Control Tests for StudyHub v1.0.5

This document defines test cases for verifying room access control and authorization boundaries.

## Test Case 1: Non-Member Cannot Access Room Content

**Objective**: Verify users outside a room cannot view/edit its content

**Setup**:
- User A owns "Private Room A"
- User B is not a member
- Notes exist in the room

**Steps**:
1. User B: Manually navigate to room in URL
2. User B: Try to view notes via direct API call (using browser DevTools)
3. User B: Try to create a note in the room

**Expected Results**:
- 403 Forbidden on all requests
- UI shows "Access Denied" message
- User B redirected to Rooms list
- No content visible

---

## Test Case 2: Removed Member Loses Access

**Objective**: Verify access revocation is immediate

**Setup**:
- User A and User B both in "Test Room"
- Room page open in both browsers

**Steps**:
1. User A: Open Members modal
2. User A: Remove User B from room
3. User B: Try to refresh the Notes page
4. User B: Try to access any content from the room

**Expected Results**:
- User B receives 403 Forbidden
- User B redirected to Rooms list
- User B cannot see room in their Rooms list
- Error message explains they were removed

---

## Test Case 3: Owner-Only Operations

**Objective**: Verify only owners can perform admin actions

**Setup**:
- User A: Owner of "Test Room"
- User B: Member of "Test Room"

**Steps**:
1. User B: Try to delete the room
2. User B: Try to modify room settings
3. User B: Try to invite new members
4. User B: Try to remove other members
5. User A: Perform same operations (should succeed)

**Expected Results**:
- User B receives 403 on all attempts
- UI does not show admin options for User B
- User A can perform all operations
- No partial state updates on failed operations

---

## Test Case 4: Invalid Invite Code Handling

**Objective**: Verify system rejects invalid/expired codes

**Setup**:
- Room with valid invite code: ABC123

**Steps**:
1. User B: Try code "INVALID"
2. User B: Try code "ABC12" (wrong code)
3. User B: Try empty code
4. User B: Try using valid code multiple times

**Expected Results**:
- Invalid codes show clear error message
- Valid code works every time
- User not added on any failed attempt
- No duplicate members if code reused

---

## Test Case 5: Authorization Doesn't Leak to Frontend

**Objective**: Verify error messages don't reveal system details

**Setup**:
- Attempt various unauthorized operations

**Steps**:
1. User B: Try to access non-existent room
2. User B: Try to edit another user's note (via API)
3. User B: Try to delete another user's quiz

**Expected Results**:
- Error messages are user-friendly, not technical
- No SQL errors or stack traces
- No internal IDs or system details exposed
- Consistent 403 responses (not 404 for existence check)

---

## Test Case 6: Cross-Room Contamination Prevention

**Objective**: Verify actions in one room don't affect another

**Setup**:
- Room A (User A owner, User B member)
- Room B (User C owner, User D member)

**Steps**:
1. User A: Delete all notes in Room A
2. User C: Verify Room B notes are unchanged
3. User B: Create note in Room A
4. User D: Verify cannot see Room A's note
5. User A: Change Room A settings
6. User C: Verify Room B settings unchanged

**Expected Results**:
- No cross-contamination
- Each room isolated
- No shared data leaks
- Permissions strictly enforced per room

---

## Test Case 7: Role-Based Access

**Objective**: Verify different member roles have correct permissions

**Setup**:
- User A: Owner
- User B: Member
- User C: Non-member

**Steps**:

| Operation | Owner | Member | Non-Member | Expected |
|-----------|-------|--------|-----------|----------|
| View room | ✓ | ✓ | ✗ | 200, 200, 403 |
| View content | ✓ | ✓ | ✗ | 200, 200, 403 |
| Create content | ✓ | ✓ | ✗ | 201, 201, 403 |
| Edit own content | ✓ | ✓ | ✗ | 200, 200, 403 |
| Edit others' content | ✓ | ✗ | ✗ | 200, 403, 403 |
| Delete own content | ✓ | ✓ | ✗ | 200, 200, 403 |
| Delete others' content | ✓ | ✗ | ✗ | 200, 403, 403 |
| Manage members | ✓ | ✗ | ✗ | 200, 403, 403 |
| Delete room | ✓ | ✗ | ✗ | 200, 403, 403 |

**Expected Results**:
- All operations return correct status codes
- No exceptions
- Audit log records all attempts

---

## Test Case 8: Session-Based Authorization

**Objective**: Verify authorization checks happen on every request

**Setup**:
- User A in room, has valid JWT

**Steps**:
1. User A: Make successful API request
2. User A: Manually modify JWT in localStorage to invalid value
3. User A: Try to make another API request
4. User A: Wait for token to expire (if using expiring tokens)
5. User A: Try to make another API request

**Expected Results**:
- Step 1: Request succeeds (200)
- Step 3: Request fails with 401 Unauthorized
- Step 5: Request fails with 401 Unauthorized
- User redirected to login
- Token automatically cleared

---

## Test Case 9: Concurrent Authorization Checks

**Objective**: Verify authorization works correctly under concurrent requests

**Setup**:
- User A with multiple browser tabs open in same room

**Steps**:
1. User A: Open DevTools Network tab
2. User A: Open room in Tab 1 and Tab 2
3. User A: Rapidly create notes in both tabs (Ctrl+Enter multiple times)
4. User A: Observe all requests in Network tab
5. User A: Verify all requests succeed with correct authorization

**Expected Results**:
- All requests have Authorization header
- All requests include valid JWT
- No 401 or 403 errors
- All notes created successfully
- No duplicates from concurrent POST requests

---

## Authorization Test Checklist

- [ ] Test Case 1: Non-member access blocked
- [ ] Test Case 2: Removed member loses access
- [ ] Test Case 3: Owner-only operations enforced
- [ ] Test Case 4: Invalid codes rejected
- [ ] Test Case 5: No information leakage
- [ ] Test Case 6: Cross-room isolation verified
- [ ] Test Case 7: Role-based access correct
- [ ] Test Case 8: Session authorization renewed
- [ ] Test Case 9: Concurrent requests authorized
- [ ] No 500 errors in any test
- [ ] All error messages user-friendly
- [ ] No sensitive data in error responses
- [ ] Performance acceptable on all tests

---

## How to Test

1. Use browser DevTools (F12) to monitor requests and responses
2. Check the Network tab to verify HTTP status codes
3. Check browser console for any errors
4. Use multiple user accounts to test
5. Document any unexpected behavior
6. Report failures with full request/response details
