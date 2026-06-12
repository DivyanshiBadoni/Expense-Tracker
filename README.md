# Mini Expense Tracker

A full-stack expense tracking application built with Node.js + Express on the backend and React (Vite) on the frontend. Users can log daily spending across categories, filter by date range and category, and see a visual summary of where their money is going.

This is Exercise 2 from the Studio Graphene Full Stack Developer assessment.

---

## Live Demo

> _Add your deployed links here after deployment._
>
> - **Frontend:** https://your-app.vercel.app
> - **Backend:** https://your-api.render.com

---

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Backend runtime | Node.js + Express | Familiar, minimal boilerplate for a REST API |
| Frontend | React 18 + Vite | Fast dev server, modern React with hooks |
| Charts | Recharts | Simple API, works well with React, good defaults |
| Storage | JSON file (via `fs`) | Persistence across server restarts without needing a DB setup |
| Unique IDs | `uuid` | Collision-safe IDs for expense records |
| Styling | Plain CSS with CSS variables | No build complexity, easy to maintain, dark-mode-ready |

---

## How to Run Locally

You only need **Node.js (v18+)** installed.

```bash
# 1. Clone the repo
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker

# 2. Install all dependencies (server + client)
npm run install:all

# 3. Start the backend (runs on http://localhost:5000)
npm run dev:server

# 4. In a second terminal, start the frontend (runs on http://localhost:5173)
npm run dev:client

# 5. Open http://localhost:5173 in your browser
```

The Vite dev server proxies `/api` requests to `localhost:5000`, so there are no CORS issues locally.

### Running Tests

```bash
npm test
# or directly:
npm test --prefix server
```

---

## API Documentation

Base URL: `http://localhost:5000/api`

### `GET /expenses`

Returns a list of expenses, sorted by date descending.

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category (`Food`, `Transport`, `Bills`, `Entertainment`, `Other`) |
| `startDate` | string (ISO date) | Filter expenses on or after this date |
| `endDate` | string (ISO date) | Filter expenses on or before this date |

**Response:**
```json
[
  {
    "id": "uuid",
    "amount": 250.00,
    "category": "Food",
    "date": "2024-06-01",
    "note": "Lunch",
    "createdAt": "2024-06-01T10:00:00.000Z"
  }
]
```

---

### `GET /expenses/summary`

Returns aggregated stats for the current calendar month.

**Response:**
```json
{
  "totalThisMonth": 4500.00,
  "byCategory": {
    "Food": 1200,
    "Transport": 800,
    "Bills": 2000,
    "Entertainment": 500,
    "Other": 0
  },
  "highest": {
    "id": "uuid",
    "amount": 2000,
    "category": "Bills",
    "date": "2024-06-03",
    "note": "Rent"
  }
}
```

---

### `GET /expenses/:id`

Returns a single expense by ID. Returns `404` if not found.

---

### `POST /expenses`

Creates a new expense.

**Request body:**
```json
{
  "amount": 250,
  "category": "Food",
  "date": "2024-06-01",
  "note": "Optional note"
}
```

**Validation rules:**
- `amount`: required, must be a positive number
- `category`: required, must be one of the five valid categories
- `date`: required, cannot be in the future

**Response:** `201 Created` with the created expense object.

**Error response:** `400 Bad Request`
```json
{ "errors": ["amount must be a positive number"] }
```

---

### `PUT /expenses/:id`

Updates an existing expense. Same request body and validation as `POST`.

**Response:** `200 OK` with the updated expense object.

---

### `DELETE /expenses/:id`

Deletes an expense by ID.

**Response:** `204 No Content`

---

### `GET /health`

Health check endpoint. Returns `{ "status": "ok" }`.

---

## Project Structure

```
expense-tracker/
├── package.json            # Root scripts (install:all, dev:server, dev:client)
├── .gitignore
│
├── server/
│   ├── package.json
│   ├── data/
│   │   └── expenses.json   # Persisted data (git-ignored)
│   └── src/
│       ├── index.js        # Express app setup + server start
│       ├── store.js        # In-memory store with JSON file persistence
│       ├── routes/
│       │   └── expenses.js # All expense CRUD routes + validation
│       └── __tests__/
│           └── expenses.test.js  # Integration tests with supertest
│
└── client/
    ├── package.json
    ├── vite.config.js      # Vite config + /api proxy to backend
    ├── index.html
    └── src/
        ├── main.jsx        # React entry point
        ├── App.jsx         # Root component, state wiring
        ├── App.css         # Layout (grid, header, responsive)
        ├── index.css       # Global styles, design tokens
        ├── components/
        │   ├── ExpenseForm.jsx    # Add/edit form with validation
        │   ├── ExpenseList.jsx    # List with inline edit + delete confirm
        │   ├── SummaryPanel.jsx   # Stats cards + Recharts pie chart
        │   └── FilterBar.jsx      # Category + date range filters
        ├── hooks/
        │   └── useExpenses.js    # Data fetching, state, CRUD actions
        └── utils/
            ├── api.js            # Typed fetch wrappers for all endpoints
            └── format.js         # Currency/date formatting, constants
```

---

## Deployment

**Frontend (Vercel):**
1. Import the repo into Vercel
2. Set root directory to `client`
3. Set `VITE_API_URL` environment variable to your backend URL
4. Update `vite.config.js` proxy or use the env variable in `api.js`

**Backend (Render):**
1. Create a new Web Service pointing to the `server` folder
2. Build command: `npm install`
3. Start command: `npm start`
4. Note: JSON file storage will reset on Render's free tier on each deploy — swap `store.js` to use SQLite for persistence in production

---

## Next Steps

Things I chose not to implement within the timeframe, and what I would build next:

- **CSV export** — straightforward to add; map the filtered array to comma-separated strings and trigger a browser download via `Blob` + `URL.createObjectURL`.
- **Budget per category** — store budget limits as a separate key in the JSON file; compare `byCategory[cat]` against the limit and show a progress bar with a warning color when exceeded.
- **SQLite persistence** — swap the JSON file store for `better-sqlite3` to get proper atomic writes and query support. The `store.js` interface wouldn't change — only the implementation.
- **Authentication** — add JWT-based auth with a `/auth/login` endpoint; prefix all expense routes with a user ID so multiple users can coexist.
- **More meaningful tests** — test the `summary` endpoint edge cases (month boundary, empty month), and add React Testing Library tests for the `ExpenseForm` validation UI.
- **Accessibility pass** — add `aria-live` regions for the expense list so screen readers announce adds/deletes.

---

## Notes

- AI tools (Claude) were used to assist with boilerplate and syntax. I understand every line of code and can walk through it in the interview.
- Currency is formatted in INR (`en-IN` locale) since this position is based in Gurgaon. This is easy to make configurable.
