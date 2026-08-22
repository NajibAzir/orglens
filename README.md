# OrgLens

## How to Run

### Prerequisites

- Python 3.10+
- Node.js 18+

### Step 1: Start the Backend

Open a terminal and run:

```bash
cd backend
pip install -r requirements.txt
python seed_data.py        # optional: load sample data into the database
uvicorn main:app --reload
```

The API will be running at `http://localhost:8000`.

### Step 2: Start the Frontend

Open a **second terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

### Step 3: Open in Browser

Go to [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** Both backend and frontend must be running at the same time. The frontend communicates with the backend API on port 8000.
