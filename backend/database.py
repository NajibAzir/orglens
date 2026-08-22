import sqlite3
import os

DB_PATH = "orglens.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.executescript("""
-- Departments
CREATE TABLE IF NOT EXISTS departments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    code        TEXT,
    budget      TEXT,
    color       TEXT,
    parent_id   INTEGER REFERENCES departments(id),
    created_at  DATE NOT NULL,
    retired_at  DATE,
    status      TEXT DEFAULT 'active'
);

-- Roles / Positions
CREATE TABLE IF NOT EXISTS roles (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    code            TEXT UNIQUE,
    title           TEXT NOT NULL,
    department_id   INTEGER REFERENCES departments(id),
    manager_role_id INTEGER REFERENCES roles(id),
    level           TEXT DEFAULT 'L4',
    tech_stack      TEXT, -- JSON string array
    skills_required TEXT, -- JSON string array
    relevancy_trend TEXT DEFAULT 'stable', -- growing, declining, stable, transforming
    description     TEXT,
    created_at      DATE NOT NULL,
    retired_at      DATE,
    status          TEXT DEFAULT 'active'
);

-- Role Mutations
CREATE TABLE IF NOT EXISTS role_mutations (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    source_role_id  INTEGER REFERENCES roles(id),
    target_role_id  INTEGER REFERENCES roles(id),
    mutation_type   TEXT NOT NULL, -- created, renamed, split, merged, reporting_change
    effective_date  DATE NOT NULL,
    notes           TEXT
);

-- Employees
CREATE TABLE IF NOT EXISTS employees (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT,
    avatar_url  TEXT,
    skills      TEXT, -- JSON string array
    location    TEXT DEFAULT 'Kuala Lumpur, Malaysia',
    level       TEXT DEFAULT 'L4',
    performance TEXT DEFAULT 'Meets Expectations',
    hire_date   DATE NOT NULL,
    exit_date   DATE,
    status      TEXT DEFAULT 'active'
);

-- Assignments (Person <-> Role over time)
CREATE TABLE IF NOT EXISTS assignments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER REFERENCES employees(id),
    role_id     INTEGER REFERENCES roles(id),
    start_date  DATE NOT NULL,
    end_date    DATE,
    reason      TEXT, -- hired, promoted, transferred, lateral, exited
    notes       TEXT
);

-- Reporting Lines
CREATE TABLE IF NOT EXISTS reporting_lines (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    subordinate_role_id INTEGER REFERENCES roles(id),
    manager_role_id     INTEGER REFERENCES roles(id),
    start_date          DATE NOT NULL,
    end_date            DATE,
    notes               TEXT
);

-- Ticket Logs
CREATE TABLE IF NOT EXISTS ticket_logs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id     INTEGER REFERENCES employees(id),
    ticket_id       TEXT,
    category        TEXT, -- backend, frontend, devops, data, testing, documentation, architecture
    hours_spent     REAL,
    completed_date  DATE
);

-- Role Relevancy
CREATE TABLE IF NOT EXISTS role_relevancy (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id         INTEGER REFERENCES roles(id),
    assessed_date   DATE NOT NULL,
    relevancy_score REAL,
    industry_trend  TEXT,
    trend_direction TEXT DEFAULT 'stable', -- up, down, stable
    upskill_suggestions TEXT -- JSON string array of {course, skill, duration, url}
);

-- Wellbeing Check-ins (Supportive event-driven)
CREATE TABLE IF NOT EXISTS wellbeing_checkins (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id     INTEGER REFERENCES employees(id),
    triggered_by    TEXT, -- reorg_split, manager_change, role_transfer, rapid_promotion
    trigger_date    DATE NOT NULL,
    org_changes_count INTEGER,
    responded       BOOLEAN DEFAULT 0,
    response_date   DATE,
    stress_level    INTEGER, -- 1 to 5
    notes           TEXT
);

-- Wellbeing Surveys
CREATE TABLE IF NOT EXISTS wellbeing_surveys (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    checkin_id      INTEGER REFERENCES wellbeing_checkins(id),
    question        TEXT,
    answer          TEXT,
    submitted_at    DATETIME
);

-- Restructuring Scenarios (Pre-packaged timeline events)
CREATE TABLE IF NOT EXISTS scenarios (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    effective_date  DATE NOT NULL,
    description     TEXT,
    tag             TEXT,
    key_changes     TEXT, -- JSON string array
    impact_level    TEXT -- Low, Medium, High
);

-- Staff Upskilling Progress (Persisted Learning Pathways)
CREATE TABLE IF NOT EXISTS upskilling_progress (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id     INTEGER REFERENCES employees(id),
    course_name     TEXT NOT NULL,
    status          TEXT DEFAULT 'in_progress',
    started_date    DATE,
    completed_date  DATE,
    notes           TEXT,
    UNIQUE(employee_id, course_name)
);

-- Employee Royalty Wallet (Solana-style simulated wallet)
CREATE TABLE IF NOT EXISTS wallets (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id     INTEGER UNIQUE REFERENCES employees(id),
    wallet_address  TEXT NOT NULL,
    balance         REAL DEFAULT 0.0,
    monthly_reload  REAL DEFAULT 150.0,
    last_reload     DATE,
    created_at      DATE NOT NULL
);

-- Wallet Transactions (history of reloads, payments, rewards)
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id     INTEGER REFERENCES employees(id),
    type            TEXT NOT NULL, -- reload, payment, reward
    amount          REAL NOT NULL,
    description     TEXT,
    recipient       TEXT, -- e.g. 'Cafeteria', 'Vending Machine', 'Parking'
    tx_hash         TEXT, -- simulated Solana tx hash
    created_at      DATETIME NOT NULL
);
    """)
    conn.commit()
    conn.close()
