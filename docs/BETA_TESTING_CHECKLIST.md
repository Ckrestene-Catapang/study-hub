# StudyHub v1.0.4 - Beta Testing Checklist

This checklist ensures that all critical user flows work reliably before releasing to beta users.

---

## 1. Authentication & Account Management

### Registration
- [ ] User can register with email and password
- [ ] Password validation works (minimum 8 characters, etc.)
- [ ] Duplicate email is rejected with clear error message
- [ ] After successful registration, user is logged in automatically
- [ ] User info (name, email) is accessible after registration

### Login
- [ ] User can log in with correct credentials
- [ ] Incorrect password shows error message (not exposing user exists)
- [ ] Invalid email shows appropriate error
- [ ] After login, user is redirected to dashboard
- [ ] Token is stored in localStorage and persists on page refresh

### Logout
- [ ] Logout button clears user session
- [ ] After logout, accessing protected pages redirects to login
- [ ] Token is removed from localStorage

### Session Persistence
- [ ] Closing and reopening browser keeps user logged in
- [ ] Refreshing any page maintains user session
- [ ] Expired tokens show login prompt
- [ ] Token error handling doesn't crash the app

---

## 2. Room Management

### Creating Rooms
- [ ] Authenticated user can create a room with name and description
- [ ] Room creation shows success message
- [ ] New room appears immediately in rooms list
- [ ] Room owner is automatically set to current user
- [ ] Room code is generated and displayed

### Joining Rooms
- [ ] User can join room with valid code
- [ ] User joins and appears in room members list
- [ ] Invalid room code shows error message
- [ ] User cannot join same room twice (duplicate check)
- [ ] User is added to room_members table in database

### Room Permissions
- [ ] Only room owner can delete room
- [ ] Only room owner can remove members
- [ ] Non-owners cannot delete/remove members (403 error)
- [ ] Owner cannot leave their own room (error shown)
- [ ] Member can leave a room they joined
- [ ] Leaving removes user from room_members

### Room Access
- [ ] Only room members can view room content (notes, quizzes)
- [ ] Non-members get 403 error when accessing room resources
- [ ] Room membership persists after logout/login
- [ ] Member counts are accurate

---

## 3. Notes Management

### Creating Notes
- [ ] User can create note with title and content
- [ ] Notes are created successfully in database
- [ ] User-created notes appear in personal notes list
- [ ] Notes can be associated with a room
- [ ] User cannot create note in room they don't belong to (403 error)
- [ ] Tags can be added to notes
- [ ] Note creation shows success message

### Viewing Notes
- [ ] All user's personal notes are visible
- [ ] Notes in user's rooms are visible
- [ ] Private notes (no room) only show to owner
- [ ] Room notes visible to all room members
- [ ] Notes display correctly after page refresh
- [ ] Empty state shows when no notes exist

### Updating Notes
- [ ] Only note creator can edit note
- [ ] Non-creators get 403 error on edit attempt
- [ ] Updated notes reflect changes immediately
- [ ] Changes persist after page refresh
- [ ] Update success message displays

### Deleting Notes
- [ ] Only note creator can delete note
- [ ] Deletion is soft delete (status = 'deleted')
- [ ] Deleted notes don't appear in list
- [ ] Delete confirmation prevents accidental deletion
- [ ] Delete success message displays

### Searching/Filtering Notes
- [ ] Search by title finds notes
- [ ] Search by content finds notes
- [ ] Search by tags finds notes
- [ ] Search is case-insensitive
- [ ] No results shows appropriate empty state
- [ ] Filters work in combination

---

## 4. Quizzes Management

### Creating Quizzes
- [ ] User can create quiz with title and description
- [ ] Quiz is created and appears in list
- [ ] Only quiz creator can see unpublished quizzes
- [ ] Quiz associated with room accessible to room members
- [ ] Quiz creation shows success message

### Adding Questions
- [ ] Quiz creator can add questions
- [ ] Questions include text, type, and correct answer
- [ ] Questions are saved and appear in quiz
- [ ] Only quiz creator can add questions (403 for others)
- [ ] Multiple questions can be added to single quiz

### Publishing Quizzes
- [ ] Quiz creator can publish quiz
- [ ] Published quizzes visible to room members
- [ ] Unpublished quizzes only visible to creator
- [ ] Publishing toggles correctly

### Quiz Access
- [ ] Quiz creator can always access quiz (draft or published)
- [ ] Room members can see published quizzes
- [ ] Non-members cannot access quiz (403 error)
- [ ] Room members cannot edit quiz (403 error)

### Quiz Updates/Deletion
- [ ] Only quiz creator can edit quiz
- [ ] Only quiz creator can delete quiz
- [ ] Deletion is soft delete (status = 'deleted')
- [ ] Edit/delete permission errors show 403

---

## 5. Error Handling & Edge Cases

### Network Errors
- [ ] Failed API calls show error message (not blank screen)
- [ ] Retry button appears on error state
- [ ] Clicking retry retries the failed operation
- [ ] Toast messages appear for success/error

### Validation Errors
- [ ] Empty title/content shows validation error
- [ ] Long inputs are truncated or rejected appropriately
- [ ] Special characters handled correctly
- [ ] Error messages are clear and actionable

### Authorization Errors
- [ ] 401 unauthorized redirects to login
- [ ] 403 forbidden shows appropriate error
- [ ] No access to other user's private data
- [ ] Room-based access enforced correctly

### Database Errors
- [ ] Duplicate emails handled gracefully
- [ ] Foreign key violations don't crash app
- [ ] Timeouts show retry option
- [ ] Generic errors don't expose server details

---

## 6. Frontend UI/UX

### Loading States
- [ ] Skeleton loading states appear while fetching
- [ ] Loading doesn't block navigation
- [ ] Spinners appear on form submission
- [ ] No duplicate requests on double-click

### Error States
- [ ] Error alerts display clearly
- [ ] Error dismissible or with retry
- [ ] Errors don't prevent page navigation
- [ ] Stack traces not exposed to users

### Empty States
- [ ] Empty states appear when no data
- [ ] CTAs (Create buttons) present in empty states
- [ ] Empty states are helpful not frustrating
- [ ] Search returns empty state (not error)

### Responsive Design
- [ ] Mobile: All pages readable and functional
- [ ] Tablet: Layout adapts properly
- [ ] Desktop: Full-width usage optimized
- [ ] Touch targets are at least 44px

---

## 7. Data Persistence & Refresh

### Core User Flow
- [ ] User registers → can log in
- [ ] User creates room → can rejoin after logout
- [ ] User adds note to room → data persists
- [ ] Page refresh → all data preserved
- [ ] Browser close → session restored on reopen
- [ ] Complete user journey works end-to-end

### Nested Route Refresh
- [ ] Refresh on /rooms page works
- [ ] Refresh on /notes page works
- [ ] Refresh on /quizzes page works
- [ ] No 404 errors on nested route refresh
- [ ] Deep links work correctly

### Database Integrity
- [ ] No orphaned records after deletion
- [ ] Foreign key constraints enforced
- [ ] User can't access deleted content
- [ ] Soft deletes don't affect queries
- [ ] Status filters applied correctly

---

## 8. Performance & Stability

### Load Times
- [ ] Initial page load < 3 seconds
- [ ] API responses < 1 second
- [ ] No white screen of death
- [ ] Progressive rendering visible

### Memory/Stability
- [ ] No memory leaks after repeated actions
- [ ] Rapid clicking doesn't duplicate submissions
- [ ] Large lists (50+ items) load smoothly
- [ ] No console errors during normal use

### Browser Compatibility
- [ ] Chrome/Chromium latest: Fully functional
- [ ] Firefox latest: Fully functional
- [ ] Safari latest: Fully functional
- [ ] Mobile browsers: Fully functional

---

## 9. Security Checks

### Token Security
- [ ] JWT tokens not exposed in URLs
- [ ] Tokens in localStorage (acceptable for SPA)
- [ ] Token expiration handled gracefully
- [ ] No plaintext passwords in requests

### Input Validation
- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked
- [ ] CSRF protection (if applicable)

### Access Control
- [ ] User cannot access other user's data
- [ ] User cannot modify resources they don't own
- [ ] Room access restricted to members
- [ ] Authorization checked on all mutations

---

## 10. Documentation & Onboarding

### Help Resources
- [ ] User can find how to create room
- [ ] User can find how to join room
- [ ] User can find how to add notes
- [ ] Error messages guide users to solutions

### Demo Data
- [ ] Demo account works (demo@studyhub.local)
- [ ] Demo room accessible with code
- [ ] Demo content visible on first login
- [ ] Demo data doesn't interfere with user data

---

## Testing Notes

### Pre-Release Checklist
- [ ] All sections completed
- [ ] No high-priority bugs found
- [ ] Critical user flows verified
- [ ] Error handling tested
- [ ] Data persistence verified

### Known Issues (Document Any)
- Issue: [Description]
- Workaround: [If applicable]
- Fixed in: [Version]

---

## Sign-Off

- **Tested By:** _________________
- **Date:** _________________
- **Status:** [ ] Ready for Beta | [ ] Issues Found - See Above
- **Sign-Off:** _________________
