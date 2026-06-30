# Vaultline — Login & Signup

A full login/signup flow: the original Express backend (lightly hardened) paired
with a new, professionally designed vanilla HTML/CSS/JS frontend.

```
project/
├── backend/          Express API (from your reference files)
│   ├── Controller/Api.js
│   ├── Middleware/auth.js
│   ├── Routes/UserRoutes.js
│   ├── index.js
│   └── package.json
└── frontend/          Static UI — no build step required
    ├── index.html      Sign in
    ├── signup.html      Create account
    ├── dashboard.html   Protected page (calls /pages/dashboard)
    ├── css/style.css
    └── js/
        ├── api.js       fetch helpers, validation, session storage
        ├── login.js
        ├── signup.js
        └── dashboard.js
```

## 1. Run the backend

```bash
cd backend
npm install
npm run dev        # nodemon index.js, listens on http://localhost:8888
```

Routes exposed (mounted under `/pages`):

| Method | Path             | Auth | Description                     |
|--------|------------------|------|----------------------------------|
| POST   | `/pages/register`| —    | Create an account, returns a JWT |
| POST   | `/pages/login`    | —    | Verify credentials, returns a JWT|
| GET    | `/pages/home`     | —    | Sample public route              |
| GET    | `/pages/dashboard`| JWT  | Sample protected route           |

> The in-memory `arr` "database" resets every time the server restarts —
> that's expected for this reference backend. Swap in a real database for
> production use.

## 2. Run the frontend

The frontend is static, so any local server works. Easiest option:

```bash
cd frontend
npx serve .
# or simply open index.html in your browser
```

It talks to the API at `http://localhost:8888/pages` — change `API_BASE` in
`frontend/js/api.js` if your backend runs elsewhere.

## What the frontend does

- **Sign in / Create account** — client-side validation (email format,
  password length, confirm-password match, live password-strength meter),
  inline error states, loading spinner on submit, and friendly handling of
  the backend's plain-text and JSON error responses.
- **Session** — the JWT returned by the API is stored in `localStorage` and
  attached as a `Bearer` token on subsequent requests.
- **Dashboard** — a protected page that calls `GET /pages/dashboard` with the
  stored token to prove the auth middleware is working; redirects back to
  sign-in if the token is missing or rejected.

## Notes on the backend reference code

- `Middleware/auth.js` was adjusted so a missing `Authorization` header no
  longer throws (`data.split` on `undefined`); behavior otherwise unchanged.
- Everything else (hashing with bcrypt, JWT signing, the in-memory store) is
  exactly as provided — this is meant as a learning/reference implementation,
  not a production-ready auth service. For production, add a real database,
  environment-based secrets (the JWT secret is currently hardcoded), and
  stronger error handling.
