# Data Persistence Tests for StudyHub v1.0.5

This document defines test cases for verifying that user data persists correctly across sessions, devices, and edge cases.

## Test Case 1: Page Refresh Preserves State

**Objective**: Verify all data survives a page refresh

**Setup**:
- User logged in, viewing a room with notes

**Steps**:
1. User: View a room with 5 notes
2. User: Note the titles and content of the notes
3. User: Refresh the page (Ctrl+R or F5)
4. User: Verify all 5 notes still visible
5. User: Click on each note and verify content intact
6. User: Check timestamps are unchanged

**Expected Results**:
- All notes reload instantly without "loading" state lasting more than 1 second
- No notes are missing or duplicated
- Content is exactly as before refresh
- Order is preserved (sort order maintained)
- No console errors

---

## Test Case 2: Logout and Login Preserves Data

**Objective**: Verify data survives complete session restart

**Setup**:
- User created 3 notes in Room A
- Room has 4 members

**Steps**:
1. User: Create 3 notes with titles "Note 1", "Note 2", "Note 3"
2. User: Navigate to Rooms page
3. User: Click Logout button
4. User: Verify redirected to login page
5. User: Log back in with same credentials
6. User: Navigate to Rooms
7. User: Select Room A
8. User: Verify all 3 notes present
9. User: Verify room member count is 4

**Expected Results**:
- Notes are not lost after logout/login
- Room membership is intact
- All metadata (timestamps, creator info) preserved
- No data corruption or reordering
- Session restored correctly

---

## Test Case 3: Browser Cache Clear Doesn't Loss Data

**Objective**: Verify data persists in database even if browser cache cleared

**Setup**:
- User has content in multiple rooms

**Steps**:
1. User: Create room and add 5 notes
2. User: Open browser cache clear dialog (Ctrl+Shift+Delete)
3. User: Select "All time" and all checkboxes
4. User: Click "Clear data"
5. User: Navigate back to StudyHub
6. User: Log in again
7. User: Check if notes are still there

**Expected Results**:
- Browser cache cleared successfully
- Session data cleared but database data intact
- User needs to log in again
- After login, all notes reappear
- No data loss from cache clear

---

## Test Case 4: Multiple Device Sync

**Objective**: Verify changes on one device appear on another

**Setup**:
- User logged in on Desktop and Mobile
- Both showing same room

**Steps**:
1. Desktop: Create a note "New Note"
2. Desktop: Wait 1 second
3. Mobile: Manually refresh page
4. Mobile: Verify "New Note" appears
5. Mobile: Create a quiz "Test Quiz"
6. Mobile: Wait 1 second
7. Desktop: Manually refresh page
8. Desktop: Verify "Test Quiz" appears

**Expected Results**:
- Changes appear within 1-2 seconds on other device after refresh
- No conflicts or duplicates
- Data is consistent across devices
- Order is preserved

---

## Test Case 5: Partial Network Interruption

**Objective**: Verify data is not lost during interrupted request

**Setup**:
- User creating a note

**Steps**:
1. User: Click "Create Note" button
2. User (quickly): Simulate network interruption (DevTools: Offline)
3. User: Observe error message and retry button
4. User: Verify note is not duplicated locally
5. User: Fix network (DevTools: Online)
6. User: Click retry button
7. User: Verify note created successfully

**Expected Results**:
- Error message appears
- Retry button available
- Note not created when offline
- No duplicate if retry clicked multiple times
- After retry succeeds, note appears correctly

---

## Test Case 6: Empty Database States

**Objective**: Verify app handles empty responses correctly

**Setup**:
- New user with no rooms/notes

**Steps**:
1. New User: Log in
2. New User: Navigate to Rooms page
3. New User: Verify empty state message
4. New User: Navigate to Notes page
5. New User: Verify empty state message
6. New User: Create first room
7. New User: Verify it appears immediately
8. New User: Refresh page
9. New User: Verify room still there

**Expected Results**:
- Empty states display correctly
- No errors when data is empty
- First item creates successfully
- No "undefined" errors in console
- Persistence works even for first item

---

## Test Case 7: Concurrent Create/Delete

**Objective**: Verify state consistency during rapid operations

**Setup**:
- User in room with 5 notes

**Steps**:
1. User: Select all 5 notes (Ctrl+Click or checkbox)
2. User: Click "Delete" button
3. User: Immediately click "Undo" (if available) or refresh
4. User: Check if any notes reappear
5. User: Verify final state is consistent

**Expected Results**:
- Delete operation completes atomically
- No partial deletes or orphaned records
- Final state is consistent (all deleted or all kept)
- Refresh shows same state
- No duplicate records

---

## Test Case 8: Auth Token Expiry

**Objective**: Verify data persists when auth token needs refresh

**Setup**:
- User viewing room
- Auth token about to expire

**Steps**:
1. User: Wait until token expires (or simulate in DevTools)
2. User: Try to perform action (create note)
3. User: Observe app behavior
4. User: Log in again if needed
5. User: Verify all data intact

**Expected Results**:
- If token expired, user prompted to log in
- On new login, all previous data still exists
- No data loss due to token expiry
- User can resume work immediately

---

## Test Case 9: Large Data Volumes

**Objective**: Verify performance with large datasets

**Setup**:
- Room with 100+ notes

**Steps**:
1. User: Navigate to Notes page
2. User: Observe load time
3. User: Scroll to bottom
4. User: Verify all notes load
5. User: Refresh page
6. User: Observe load time again
7. User: Search for a note
8. User: Verify search works

**Expected Results**:
- Page loads in under 3 seconds
- All notes render without crashing
- Scroll performance smooth (no lag)
- Search returns results quickly
- Memory usage reasonable

---

## Data Persistence Checklist

- [ ] Test Case 1: Page refresh preserves state
- [ ] Test Case 2: Logout/login preserves data
- [ ] Test Case 3: Cache clear doesn't lose data
- [ ] Test Case 4: Multiple device sync works
- [ ] Test Case 5: Partial network interruption handled
- [ ] Test Case 6: Empty database states handled
- [ ] Test Case 7: Concurrent create/delete safe
- [ ] Test Case 8: Auth token expiry handled
- [ ] Test Case 9: Large data volumes perform
- [ ] No console errors in any scenario
- [ ] No duplicate records created
- [ ] Timestamps remain accurate
- [ ] Member counts correct
- [ ] No orphaned records in database

---

## Database Verification

After running tests, verify database integrity:

```sql
-- Check for orphaned notes (no matching room or user)
SELECT COUNT(*) FROM notes WHERE room_id NOT IN (SELECT id FROM rooms) OR user_id NOT IN (SELECT id FROM users);

-- Check for duplicate notes
SELECT title, COUNT(*) FROM notes GROUP BY title HAVING COUNT(*) > 1;

-- Check member counts
SELECT room_id, COUNT(*) as member_count FROM room_members GROUP BY room_id;

-- Check soft-delete consistency
SELECT COUNT(*) FROM notes WHERE status = 'deleted' AND updated_at < NOW() - INTERVAL 30 DAYS;
```

Should all return 0 for healthy state.
