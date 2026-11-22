# City Public Library - project notes

Every page has its own CSS file and its own JS file. Nothing is shared between
pages, so each page works on its own. There is no server, so data is saved in the browser with `localStorage`
and is lost if the browser data is cleared.

## File structure
| Page | CSS | JS |
|---|---|---|
| index.html | css/index.css | - |
| user/home.html | css/user/home.css | - |
| user/apply.html | css/user/apply.css | js/user/apply.js |
| user/collect.html | css/user/collect.css | js/user/collect.js |
| user/notices.html | css/user/notices.css | js/user/notices.js |
| admin/login.html | css/admin/login.css | js/admin/login.js |
| admin/home.html | css/admin/home.css | js/admin/home.js |
| admin/applications.html | css/admin/applications.css | js/admin/applications.js |
| admin/returns.html | css/admin/returns.css | js/admin/returns.js |

Each page JS file calls its own `init...()` function at the bottom.

## Where data is saved
| Key | What it holds |
|---|---|
| `cl_apps` | every application: member, book, status, token, valid-until date, used or not |
| `cl_loans` | every collected book: due date, On loan or Returned |
| `cl_date` | optional working date set by the librarian (for testing) |
| `cl_admin` | in sessionStorage only. "yes" means staff is signed in |

## Page by page
| Page | Function | What it does |
|---|---|---|
| user/apply.html | `initApply` | Saves a new application with status Pending. Blocks a second open request for the same book. |
| user/collect.html | `initCollect` | `checkToken` tests: token exists and matches member, not used, not expired. If fine, a loan is created (due in 7 days) and the token is marked used. |
| user/notices.html | `initNotices` | Finds the member's applications and loans and shows a text for each. From day 6 the loan text says "return tomorrow". |
| admin/login.html | `initLogin` | Compares username and password with `admin` / `admin123`, then opens home.html. |
| admin/home.html | `initOverview` | Shows the four counts. The Working Date form changes today's date so the reminder can be tested. |
| admin/applications.html | `initApplications` | Approve makes a random token valid for 7 days. Reject only changes the status. |
| admin/returns.html | `initReturns` | The Return button sets the loan to Returned, so the token case is closed. Also lists reminders for books due tomorrow. |

## The full flow in 6 steps
1. Member applies (status Pending).
2. Librarian approves (token created, valid 7 days).
3. Member shows the token and collects the book (loan created, token used).
4. On day 6 the member sees "return tomorrow" in My Notices.
5. Librarian presses Return (loan status Returned).
6. The token case is closed. It can not be used again.

## Easy way to test day 6
Apply, approve, collect. Then in Staff Overview set the Working Date to 6 days
later and open My Notices.

## Limits
- Data stays in one browser only.
- The staff password is inside js/admin/login.js, so this is for learning, not real security.
