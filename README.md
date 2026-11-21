# Institute of Credit Risk Professionals (ICRP)

An 8-week credit analyst training platform for Nigerian banks, MFBs and digital lenders. The frontend is plain HTML, CSS and JavaScript. Google Sheets holds the data, Apps Script is the API, and Google Drive stores the exam recordings.

## Files

| File | What it does |
|---|---|
| `index.html` | Login, dashboard, course viewer, quiz and exam engine, proctoring overlay |
| `styles.css` | Day and night themes, Lato with Calibri Light fallback, responsive layout |
| `app.js` | State, routing, time and score gating display, WebRTC recorder, chunked uploader, offline auto-save |
| `content.js` | Syllabus, lesson HTML, SVG diagrams, case studies, questions (no answers) |
| `Code.gs` | Apps Script backend: sheet setup, login, grading, drip locks, exam sessions, Drive uploads, daily certificates |
| `appsscript.json` | Apps Script manifest (Lagos time zone, web app settings, permissions) |
| `demo-backend.js` | Browser-only fake backend for previewing. Delete before going live |
| `IMAGE_ASSETS_NEEDED.md` | Photos to source for `/assets/images/` |

## Try it without a backend

Open `index.html` through any local web server (for example `python -m http.server`) and sign in with `demo@academy.ng` / `password123` as a student, or `admin@academy.ng` / `admin12345` as an admin. Progress is kept in your browser only. Week 1 is fully playable, including a proctored exam (the recording is counted but not uploaded in demo mode).

## Go live

1. Create a new Google Sheet. Open Extensions > Apps Script.
2. Replace `Code.gs` with this repo's `Code.gs`. In Project Settings, tick "Show appsscript.json" and paste in `appsscript.json`.
3. Run `setup()` once and approve the permissions. It creates the tabs (Users, Curriculum_Progress, Answer_Key, Proctoring_Logs, plus Sessions, Exam_Sessions and Proctor_Events), seeds the Week 1 answer key, creates the Drive folders, and installs the 8:00 AM WAT certificate trigger.
4. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Copy the URL ending in `/exec`.
5. In `app.js`, paste that URL into `CONFIG.API_URL`.
6. Delete `demo-backend.js` and its `<script>` line in `index.html`.
7. Host the frontend on HTTPS (GitHub Pages works). Camera and screen capture only work on HTTPS or localhost.

After any change to `Code.gs`, use Deploy > Manage deployments > Edit > New version, or the live URL keeps running the old code.

## Admin test account

Admins can open every week, topic, case study and exam straight away. Date locks, score gates, the 24-hour cooldown and the 3-attempt limit don't apply to them. Exams are still proctored and recorded so you can test that too, and the Proctoring_Logs row is marked `Admin Test`. A "Reset my progress" button on the admin dashboard clears your scores so you can start over.

To create one on the live system:

1. In Code.gs, fill in `ADMIN_SETUP` (name, email, a password of 8+ characters).
2. Run `createAdminAccount()` from the editor. If the email already exists, it is promoted to admin and its password is reset.
3. Clear the password from `ADMIN_SETUP` and save, so it isn't left in the script.

You can also type `Admin` in the `Role` column of the Users sheet, or run `makeAdmin('email')` / `removeAdmin('email')`. If you ran `setup()` before this update, run it again once so the Users sheet gets the new `Role` column.

If an admin passes the final exam, they get a real certificate email the next morning, the same as a student. Use the reset button afterwards if you don't want that account to stay Certified.

## Admin tasks (run from the Apps Script editor)

- `setDefaultCohortStart('2026-12-07')` sets the start date given to everyone who registers after this point.
- `setCohortStart('student@email.com', '2026-12-07')` moves one student's cohort.
- `grantExtraAttempt('student@email.com', 'W3')` gives back one exam attempt and clears the cooldown.
- `testCertificateNow('student@email.com')` builds a sample certificate PDF in Drive without emailing it.
- To block a certificate after reviewing a final exam recording, set that row's `ReviewStatus` in Proctoring_Logs to `Rejected` before 8:00 AM.

## How the rules are enforced

- **Drip locking.** Week N opens at CohortStartDate + 7 × (N − 1) days, checked against the server clock. Changing the computer's clock does nothing.
- **Score gating.** Topic quizzes need 70% to open the next topic. All topic quizzes must be passed before the module exam. Module exams need 75% to open the next week (on its date). The final exam needs all eight module exams passed and Week 8 open.
- **Retakes.** Three exam attempts in total (first sitting plus two retakes), with a 24-hour cooldown after a failed attempt. An attempt counts as soon as it starts, so walking away from an exam does not reset anything. An exam left unsubmitted for 30 minutes past its end time is recorded as a fail.
- **Answers.** Correct answers live only in the hidden Answer_Key sheet. The browser receives right/wrong per question for topic quizzes and only the score for exams.
- **Proctoring.** Webcam and the whole screen are combined into one video, recorded as separate 1-minute WebM files (each plays on its own) and uploaded one at a time to `NCA Proctoring Recordings / <student> / <exam attempt>` in Drive. That keeps each request far below the 50 MB payload limit and the 6-minute execution limit.
- **Power and network cuts.** Answers save to the browser every 15 seconds and on every click. Going offline or losing the screen share starts a 3-minute grace window. Clips recorded while offline wait in the queue and upload when the connection returns. Disconnections, tab switches and late submissions are logged, and the attempt is marked `Flagged` for review where needed.
- **Certificates.** At 8:00 AM WAT every day, students marked `Eligible` before midnight get a PDF certificate by email, and their status changes to `Certified`.

## Adding the next week

1. In `content.js`, replace the placeholder `topics([...])` for that week with full topic objects (copy Week 1's shape) and add exam questions.
2. In `Code.gs`, add the answer strings to `ANSWER_SEED`, for example `'W2-T1': 'cabdb'`, then run `seedAnswerKey()`.
3. Redeploy the web app as a new version.

## Limits to know about

- Apps Script handles about 30 simultaneous executions per script. A cohort of a few hundred is fine. For thousands of students sitting an exam at the same minute, stagger exam start times or move uploads to a dedicated storage service.
- Browser detection blocks phones and tablets from exams, but a determined student can fake a user agent. The recording and human review are the real control.
