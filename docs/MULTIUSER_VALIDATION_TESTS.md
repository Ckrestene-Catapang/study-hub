# Multi-User Validation Tests for StudyHub v1.0.5

This document outlines comprehensive test scenarios for validating multi-user collaboration features in StudyHub.

## Test Scenario 1: Room Creation and Sharing

**Objective**: Verify User A can create a room and User B can join via code

**Setup**:
- Open two browser windows (User A and User B) side-by-side
- Both users logged in to different accounts

**Steps**:
1. User A: Navigate to Rooms page
2. User A: Click "Create Room" button
3. User A: Enter room name "Test Collab Room"
4. User A: Submit form
5. User A: Copy the invite code displayed
6. User B: Navigate to Rooms page
7. User B: Click "Join Room" button
8. User B: Paste the invite code
9. User B: Submit form

**Expected Results**:
- User A sees the room in their Rooms list
- User B successfully joins and room appears in their Rooms list
- Both users see the same room name and member count
- Room status shows both users as members

**Failure Cases to Handle**:
- Invalid invite code → Show clear error message
- Expired invite code → Allow retrying with new code
- User already in room → Prevent duplicate join
- Network error during join → Retry logic kicks in

---

## Test Scenario 2: Concurrent Content Creation

**Objective**: Verify both users can add notes/quizzes without conflicts

**Setup**:
- Both users in the same room
- Notes page open in both browsers

**Steps**:
1. User A: Create a note titled "Note from User A"
2. User B: Create a note titled "Note from User B" (at same time or within seconds)
3. Both users: Refresh the page
4. Both users: Verify both notes are visible

**Expected Results**:
- No content loss
- Both notes appear in both users' views
- Notes correctly attributed to respective creators
- No "duplicate key" or constraint errors
- Timestamps are accurate

**Failure Cases to Handle**:
- Simultaneous POST requests → Database handles via unique ID
- Network delay → Retry logic prevents data loss
- Stale data after refresh → Cache invalidation works

---

## Test Scenario 3: Room Membership Management

**Objective**: Verify membership can be viewed and managed correctly

**Setup**:
- Room with multiple members (User A, User B, User C)

**Steps**:
1. User A (owner): Open Room Members modal
2. Verify User A, B, C listed with correct roles
3. User A: Try removing User B
4. User C: Check if User B is still in room
5. User B: Try to access room content

**Expected Results**:
- Members list shows all current members
- Removal operation succeeds
- Removed user can no longer access room or content
- Owner can always manage but cannot remove themselves
- Authorization checks prevent unauthorized removals

---

## Test Scenario 4: Offline and Network Resilience

**Objective**: Verify app handles network interruptions gracefully

**Setup**:
- User logged in with Rooms/Notes pages open

**Steps**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Throttling" dropdown, select "Offline"
4. Try to perform action (create note, join room)
5. Observe error handling
6. Change throttling back to "Online"
7. Click retry button

**Expected Results**:
- Clear error message displayed
- Retry button appears
- After going online, retry succeeds
- No data loss
- App recovers to previous state

---

## Test Scenario 5: Session Persistence Across Devices

**Objective**: Verify data persists across login/logout and different devices

**Setup**:
- Room with content created by User A

**Steps**:
1. User A: Log out completely
2. User A: Clear browser cache/cookies (Ctrl+Shift+Delete)
3. User A: Log back in
4. User A: Navigate to Rooms
5. User A: Verify room and content still exist

**Expected Results**:
- Room appears in Rooms list
- Member list is intact
- All notes/quizzes created previously are present
- No "Session not found" errors
- Auth token is renewed successfully

---

## Test Scenario 6: Authorization Boundaries

**Objective**: Verify users cannot access unauthorized resources

**Setup**:
- Two separate rooms (Room A, Room B)
- User A owns Room A
- User B owns Room B
- User A is member of Room B, but not an owner

**Steps**:
1. User A (member): Try to delete Room B
2. User A (member): Try to remove other members from Room B
3. User A (member): Try to view admin settings
4. User B (owner): Verify User A cannot perform above actions

**Expected Results**:
- All unauthorized actions return 403 Forbidden
- No error messages expose system details
- UI does not show options user cannot perform
- Audit logs record all attempts

---

## Test Scenario 7: Data Consistency Under Load

**Objective**: Verify multiple rapid operations don't corrupt data

**Setup**:
- Empty room with User A and User B

**Steps**:
1. User A: Rapidly create 5 notes (quickly click Create button 5 times)
2. User B: Simultaneously join room and create 3 notes
3. Both users: Refresh page
4. Both users: Verify all notes present and correctly attributed

**Expected Results**:
- All 8 notes created successfully
- No race conditions
- Notes correctly assigned to creators
- Database has no orphaned records
- Counts are accurate

---

## Validation Checklist

- [ ] Test Scenario 1: Room creation and sharing passes
- [ ] Test Scenario 2: Concurrent content creation passes
- [ ] Test Scenario 3: Membership management passes
- [ ] Test Scenario 4: Offline resilience passes
- [ ] Test Scenario 5: Session persistence passes
- [ ] Test Scenario 6: Authorization boundaries passes
- [ ] Test Scenario 7: Data consistency passes
- [ ] No console errors observed
- [ ] Network tab shows no failed requests
- [ ] Database has no constraint violations
- [ ] Performance is acceptable (pages load < 3 seconds)
- [ ] All tests pass on multiple devices/browsers

---

## Notes for Testers

- Use browser DevTools to monitor network requests
- Check browser console for any errors
- Test on at least 2 different browsers (Chrome, Firefox, Safari, Edge)
- Test on at least 1 mobile device
- Document any failures with screenshots and browser logs
- Report memory usage if app becomes sluggish
