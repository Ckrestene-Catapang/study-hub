# Beta Feedback & Issue Reporting Templates

Use these templates to document feedback, issues, and suggestions during beta testing.

---

## Template 1: Bug Report

**Title**: [Clear, concise title describing the bug]

**Date Found**: [YYYY-MM-DD]

**Browser/Device**:
- Browser: [Chrome 120, Firefox 121, Safari 17, etc.]
- OS: [Windows 10, macOS 14, iOS 17, Android 14]
- Device Type: [Desktop, Tablet, Mobile]

**Severity**:
- [ ] Critical (App doesn't work, data loss, security issue)
- [ ] High (Major feature broken, significant impact)
- [ ] Medium (Workaround exists, affects some users)
- [ ] Low (Cosmetic, minor inconvenience)

**Steps to Reproduce**:
1. [First step]
2. [Second step]
3. [Continue until bug occurs...]

**Expected Behavior**:
[What should have happened]

**Actual Behavior**:
[What actually happened]

**Error Message** (if applicable):
```
[Copy exact error message from console or UI]
```

**Console Errors** (F12 → Console tab):
```
[Paste any console errors here]
```

**Screenshots/Video**:
[Attach if helpful]

**Frequency**:
- [ ] Every time (100%)
- [ ] Most of the time (~75%)
- [ ] Sometimes (~50%)
- [ ] Rarely (~25%)
- [ ] Once (hard to reproduce)

**Network Conditions**:
- [ ] Stable/Fast (home WiFi)
- [ ] Throttled (DevTools: Slow 4G)
- [ ] Mobile data (3G/4G/5G)
- [ ] Offline (Airplane mode)

**Notes**:
[Any additional context or observations]

---

## Template 2: Feature Request

**Title**: [What feature would you like?]

**Priority**:
- [ ] Critical (Blocks my workflow)
- [ ] High (Would be very helpful)
- [ ] Medium (Nice to have)
- [ ] Low (Future consideration)

**Current Workaround** (if any):
[How are you currently solving this problem?]

**Desired Behavior**:
[Describe what you want to happen]

**Why Do You Need This?**:
[Explain the use case or problem it solves]

**Examples from Other Apps**:
[Mention similar features in Notion, Google Classroom, etc.]

**Proposed Implementation** (optional):
[Technical suggestion if you have one]

---

## Template 3: Performance Issue

**Description**:
[What's slow? Page load? Scrolling? Search?]

**Steps to Reproduce**:
1. [First step]
2. [Continue...]

**Expected Performance**:
[What's the acceptable time? e.g., page load < 3s]

**Actual Performance**:
[What timing did you observe?]

**Device & Network**:
- Device: [Desktop/Mobile/Tablet]
- Network: [Stable/Throttled/Mobile data]
- Browser: [Chrome/Firefox/Safari/Edge]

**Memory Usage**:
- Before action: [e.g., 120MB]
- After action: [e.g., 450MB]
- After waiting 10s: [e.g., 430MB]

**Impact**:
- [ ] Makes app unusable
- [ ] Noticeably sluggish
- [ ] Slightly slower than expected
- [ ] Minor annoyance

---

## Template 4: Usability Issue

**Problem**:
[What confused you? What was hard to do?]

**Scenario**:
[What were you trying to accomplish?]

**Expected Workflow**:
[How did you think it would work?]

**Actual Workflow**:
[What actually happened?]

**Suggestion** (if any):
[How could this be improved?]

**Impact**:
- [ ] Major blocker
- [ ] Somewhat confusing
- [ ] Minor confusion
- [ ] Just a preference

---

## Template 5: Crash Report

**When It Happened**:
[What were you doing?]

**Error Message**:
```
[If shown, include exact error]
```

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Continue...]

**Console Error** (F12 → Console):
```
[Paste full error stack trace]
```

**Device & Network**:
- Browser: [Chrome 120, etc.]
- OS: [Windows 10, macOS 14, etc.]
- Network: [Stable/Throttled/Offline]

**Recovery**:
- [ ] Page refresh fixed it
- [ ] Logout and login fixed it
- [ ] Browser restart fixed it
- [ ] Still broken

---

## Template 6: Security or Privacy Concern

**Issue**:
[Describe the security/privacy issue]

**How to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Continue...]

**Severity**:
- [ ] Critical (Data exposed, account compromise)
- [ ] High (Unauthorized access possible)
- [ ] Medium (Information leak)
- [ ] Low (Minor privacy issue)

**Affected Data**:
[What data is at risk?]

**Proof of Concept** (if possible):
[Show how to exploit this]

**Recommended Fix** (if known):
[Technical suggestion]

**Note**: Do NOT share this feedback publicly. Send security issues directly to the team.

---

## Template 7: Multi-User Collaboration Issue

**Scenario**:
[Describe the multi-user scenario]

**Users Involved**:
- User A: [test-alpha-user-1]
- User B: [test-alpha-user-2]
- Room: [Room name]

**Timeline**:
- 10:23 AM: User A [action]
- 10:24 AM: User B [action]
- 10:25 AM: [Unexpected behavior]

**Expected Result**:
[What should happen in this scenario?]

**Actual Result**:
[What actually happened?]

**Data Consistency**:
- [ ] Data lost
- [ ] Data duplicated
- [ ] Data corrupted
- [ ] Conflicting states
- [ ] Other: [Describe]

---

## Template 8: Data Persistence Issue

**Scenario**:
[What data should persist?]

**Actions Taken**:
1. [Created/edited something]
2. [Refreshed page / Logged out / Changed device]
3. [Logged back in / Returned to page]

**Expected Result**:
[Data should still be there]

**Actual Result**:
[What happened to the data?]

**Last Seen**:
[When was the data last visible?]

**Recovery**:
[Has the data reappeared? When?]

---

## Feedback Submission Guidelines

1. **One issue per report**: Don't combine multiple bugs in one report
2. **Be specific**: Vague descriptions are hard to debug
3. **Provide context**: Browser, device, network conditions matter
4. **Reproduce first**: Try to reproduce the issue before reporting
5. **Check duplicates**: Look for existing similar reports
6. **Screenshots help**: Visual evidence is much faster to understand
7. **Stay professional**: Be constructive, not critical
8. **Include your details**: We might need to follow up

---

## Issue Severity Guide

**Critical**:
- App crashes
- Complete feature broken
- Data loss
- Security vulnerability
- App becomes unusable

**High**:
- Major feature partially broken
- Wrong data displayed
- Serious UX issue
- Performance severely degraded

**Medium**:
- Workaround exists
- Only affects specific scenario
- Moderate UX issue
- Moderate performance impact

**Low**:
- Minor UI bug
- Rare edge case
- Cosmetic issue
- Minimal user impact

---

## Response Times

We aim to respond to feedback within:
- **Critical**: 2-4 hours
- **High**: 24 hours
- **Medium**: 2-3 days
- **Low**: 1 week

Please note that we may not be able to fix all issues before beta ends, but we will acknowledge and prioritize all feedback.

---

## Thank You!

Your feedback is invaluable in making StudyHub better. Thank you for taking the time to test and report issues!

For sensitive security issues, please email: security@studyhub.local
For general feedback, use the templates above.
For quick questions, use the in-app support chat.
