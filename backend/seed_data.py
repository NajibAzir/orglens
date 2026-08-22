import sqlite3
import random
import os
import json
from datetime import date, timedelta
from database import init_db, DB_PATH

if os.path.exists(DB_PATH):
    print(f"Resetting database {DB_PATH}...")
    os.remove(DB_PATH)

init_db()
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

print("1. Seeding Departments with Budgets & Tech Codes...")
depts = [
    (1, "Engineering", "ENG", "RM 4.2M", "#00BFFF", None, "2021-01-01"),
    (2, "Product & Design", "PRD", "RM 1.8M", "#8B5CF6", None, "2021-01-01"),
    (3, "Data & Analytics", "DAT", "RM 2.1M", "#10B981", None, "2021-06-01"),
    (4, "Quality Assurance", "QA", "RM 950K", "#F59E0B", None, "2021-01-01"),
    (5, "Platform Engineering", "PLT", "RM 2.8M", "#253DE8", None, "2023-07-01"),
    (6, "People & Culture", "P&C", "RM 1.6M", "#EC4899", None, "2021-01-01")
]
for d in depts:
    cursor.execute("""
        INSERT INTO departments (id, name, code, budget, color, parent_id, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, d)

print("2. Seeding Roles with Levels, Tech Stacks & Trends...")
roles_data = [
    (1, "ENG-CTO-001", "Chief Technology Officer", 1, None, "Executive", 
     json.dumps(["Architecture", "Leadership", "Cloud Strategy", "Budgeting"]),
     json.dumps(["System Architecture", "Executive Strategy", "People Leadership"]),
     "stable", "Oversees global technology strategy and organizational architecture.", "2021-01-01", None),
    
    (2, "ENG-VP-001", "VP of Engineering", 1, 1, "Director",
     json.dumps(["Engineering Ops", "Distributed Systems", "Hiring", "Agile"]),
     json.dumps(["Engineering Management", "Cross-team Delivery", "Architecture"]),
     "stable", "Directs software engineering execution and department growth.", "2021-01-01", None),
    
    (3, "ENG-MGR-001", "Engineering Manager (Core Services)", 1, 2, "Lead",
     json.dumps(["Golang", "Kubernetes", "1-on-1 Mentorship", "Jira"]),
     json.dumps(["Team Management", "Sprint Planning", "Golang"]),
     "stable", "Leads the core backend fintech microservices squad.", "2021-01-01", None),
    
    (4, "ENG-TL-001", "Tech Lead (Payments)", 1, 3, "L5",
     json.dumps(["Golang", "Kafka", "PostgreSQL", "System Design", "gRPC"]),
     json.dumps(["Distributed Systems", "Payment Gateways", "Event-Driven"]),
     "growing", "Technical architect for payment processing and wallet engine.", "2021-01-01", None),
    
    (5, "ENG-SSE-001", "Senior Software Engineer", 1, 4, "L4",
     json.dumps(["Golang", "FastAPI", "Redis", "Docker", "PostgreSQL"]),
     json.dumps(["Backend APIs", "Concurrency", "Database Optimization"]),
     "growing", "Builds high-throughput transaction APIs.", "2021-01-01", None),
    
    (6, "ENG-SWE-001", "Software Engineer", 1, 4, "L3",
     json.dumps(["Golang", "PostgreSQL", "Git", "REST APIs"]),
     json.dumps(["Backend Development", "Unit Testing", "SQL"]),
     "stable", "Develops backend services and integrates partner APIs.", "2021-01-01", None),
    
    (7, "ENG-JSWE-001", "Junior Software Engineer", 1, 4, "L2",
     json.dumps(["Golang", "Python", "SQL", "Git"]),
     json.dumps(["Code Implementation", "Bug Fixing", "API Testing"]),
     "stable", "Entry-level developer supporting core services.", "2021-01-01", None),
    
    (8, "ENG-FE-001", "Frontend Lead", 1, 2, "Lead",
     json.dumps(["React", "TypeScript", "Tailwind CSS", "Next.js", "Vite"]),
     json.dumps(["Frontend Architecture", "State Management", "Performance"]),
     "growing", "Drives web and merchant portal frontend experience.", "2021-03-01", None),
    
    (9, "PRD-HEAD-001", "Head of Product", 2, 1, "Director",
     json.dumps(["Roadmapping", "Fintech UX", "Discovery", "Analytics"]),
     json.dumps(["Product Strategy", "Market Fit", "OKRs"]),
     "stable", "Shapes Setel consumer app vision and commercial features.", "2021-01-01", None),
    
    (10, "PRD-PM-001", "Product Manager (Payments)", 2, 9, "L4",
     json.dumps(["Product Specs", "User Stories", "A/B Testing", "Mixpanel"]),
     json.dumps(["Fintech Workflows", "User Research", "Agile Execution"]),
     "growing", "Manages checkout, loyalty, and fueling transaction journeys.", "2021-01-01", None),
    
    (11, "PRD-UX-001", "Senior UX Designer", 2, 9, "L4",
     json.dumps(["Figma", "Design Systems", "Prototyping", "Usability Testing"]),
     json.dumps(["Mobile UI/UX", "User Journey Mapping", "Figma Design"]),
     "growing", "Crafts seamless mobile pump-and-pay interactions.", "2021-06-01", None),
    
    (12, "DAT-LEAD-001", "Lead Data Engineer", 3, 2, "Lead",
     json.dumps(["Python", "Apache Spark", "Snowflake", "dbt", "Airflow"]),
     json.dumps(["Data Pipelines", "Warehouse Modeling", "ETL"]),
     "growing", "Architects enterprise data lake and telemetry pipelines.", "2021-06-01", None),
    
    (13, "DAT-DE-001", "Data Engineer", 3, 12, "L3",
     json.dumps(["Python", "SQL", "Airflow", "Kafka", "PostgreSQL"]),
     json.dumps(["Data Ingestion", "SQL Transformation", "Pipeline Health"]),
     "growing", "Builds streaming data pipelines for fuel transaction analytics.", "2021-06-01", None),
    
    (14, "DAT-DA-001", "Data Analyst", 3, 12, "L3",
     json.dumps(["SQL", "Tableau", "Python", "Metabase", "PowerBI"]),
     json.dumps(["Business Dashboards", "Cohort Analysis", "SQL"]),
     "stable", "Generates loyalty conversion and fuel consumption insights.", "2021-09-01", None),
    
    (15, "QA-MGR-001", "QA Manager", 4, 2, "Lead",
     json.dumps(["Test Strategy", "Jira", "Selenium", "Postman", "ISTQB"]),
     json.dumps(["Quality Governance", "Release Management", "Test Planning"]),
     "transforming", "Manages quality assurance operations across mobile and backend.", "2021-01-01", None),
    
    (16, "QA-SQA-001", "Senior QA Engineer (Automation)", 4, 15, "L4",
     json.dumps(["Playwright", "Cypress", "Appium", "CI/CD", "TypeScript"]),
     json.dumps(["E2E Automation", "Mobile App Testing", "API Automation"]),
     "growing", "Develops automated test frameworks for regression testing.", "2021-01-01", None),
    
    (17, "QA-MQA-001", "Manual QA Tester", 4, 15, "L2",
     json.dumps(["Manual Testing", "Test Cases", "Bug Reports", "Postman"]),
     json.dumps(["Functional Testing", "Exploratory Testing", "Jira Logging"]),
     "declining", "Conducts manual regression passes on mobile releases.", "2021-01-01", "2023-12-31"),
    
    (18, "QA-MQA-002", "Manual QA Tester II", 4, 15, "L2",
     json.dumps(["Manual Testing", "Regression Scripts", "Device Matrix"]),
     json.dumps(["Test Execution", "User Acceptance Testing"]),
     "declining", "Executes POS hardware and terminal test scenarios.", "2021-01-01", "2023-06-30"),
    
    (19, "QA-AQA-001", "Automation QA Engineer", 4, 15, "L3",
     json.dumps(["Python", "Selenium", "Postman", "GitHub Actions"]),
     json.dumps(["Automated Regression", "API Testing", "Load Testing"]),
     "growing", "Builds automated test suites for continuous deployment.", "2022-06-01", None),
    
    (20, "PLT-MGR-001", "Head of Platform Engineering", 5, 2, "Director",
     json.dumps(["Kubernetes", "Terraform", "AWS", "Observability", "FinOps"]),
     json.dumps(["Cloud Infrastructure", "DevOps Culture", "SRE Strategy"]),
     "growing", "Oversees cloud infrastructure, developer platform, and SRE.", "2023-07-01", None),
    
    (21, "PLT-DEVOPS-001", "Senior DevOps Engineer", 5, 20, "L4",
     json.dumps(["Kubernetes", "Helm", "GitLab CI", "AWS", "Terraform"]),
     json.dumps(["Container Orchestration", "CI/CD Pipelines", "IaC"]),
     "growing", "Maintains production Kubernetes clusters and CI/CD pipelines.", "2023-07-01", None),
    
    (22, "PLT-CLOUD-001", "Cloud Security & SRE", 5, 20, "L4",
     json.dumps(["Datadog", "Prometheus", "AWS IAM", "Security Compliance"]),
     json.dumps(["Site Reliability", "Incident Management", "Cloud Security"]),
     "growing", "Ensures 99.99% uptime for Setel payment services.", "2023-07-01", None),

    (23, "HR-HEAD-001", "Head of People & Culture", 6, 1, "Director",
     json.dumps(["People Operations", "Talent Acquisition", "Org Design", "Culture", "Workday"]),
     json.dumps(["Strategic HR", "Talent Retention", "Change Management", "Wellbeing Leadership"]),
     "stable", "Directs organizational talent strategy, workforce wellbeing, and restructuring governance.", "2021-01-01", None),
]

for r in roles_data:
    cursor.execute("""
        INSERT INTO roles (id, code, title, department_id, manager_role_id, level, tech_stack, skills_required, relevancy_trend, description, created_at, retired_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, r)

print("3. Seeding 29 Malaysian Employees with Rich Metadata & Avatars...")

def make_avatar(name, gender, race):
    """Generate gender and ethnicity accurate avatars using dedicated DiceBear collections."""
    seed = name.replace(' ', '-').lower()
    if gender == 'Female':
        # Lorelei: Dedicated female illustrated avatars (clean, zero facial hair, distinct hairstyles)
        return f"https://api.dicebear.com/9.x/lorelei/svg?seed={seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf"
    else:
        # Micah: Dedicated male illustrated avatars (modern, clean, distinct masculine hairstyles)
        return f"https://api.dicebear.com/9.x/micah/svg?seed={seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf"

emps_data = [
    (1, "Tan Wei Ming", "Male", "Chinese", "Executive", ["Architecture", "Fintech Strategy", "Cloud", "Leadership"], "Exceeds Expectations", "2021-01-01", None),
    (2, "Sarah Lim", "Female", "Chinese", "Director", ["People Operations", "Org Design", "Talent Management", "Culture"], "High Potential", "2021-01-01", None),
    (3, "Ahmad Rizal bin Hassan", "Male", "Malay", "Lead", ["Golang", "Kubernetes", "Fintech APIs", "Team Leadership"], "Meets Expectations", "2021-01-01", None),
    (4, "Muthu Krishnan", "Male", "Indian", "L5", ["Golang", "Kafka", "High-Throughput", "PostgreSQL", "gRPC"], "High Potential", "2021-01-01", None),
    (5, "Priya Sharma", "Female", "Indian", "L4", ["Golang", "FastAPI", "Docker", "Payment Gateways"], "Exceeds Expectations", "2021-01-01", None),
    (6, "Chong Wei Lin", "Male", "Chinese", "L4", ["Golang", "Microservices", "Unit Testing", "Git"], "Meets Expectations", "2021-03-01", None),
    (7, "Siti Nurhaliza binti Ahmad", "Female", "Malay", "L5", ["Distributed Systems", "Golang", "Kafka", "Cloud"], "High Potential", "2021-01-01", None),
    (8, "Raj Kumar", "Male", "Indian", "Lead", ["React", "TypeScript", "Tailwind CSS", "Next.js"], "Exceeds Expectations", "2021-01-01", None),
    (9, "Faizal bin Mohd Nor", "Male", "Malay", "Director", ["Product Vision", "Fintech Strategy", "UX Discovery"], "Exceeds Expectations", "2021-01-01", None),
    (10, "Aisha binti Zainal", "Female", "Malay", "L4", ["Product Roadmapping", "User Stories", "A/B Testing"], "High Potential", "2021-01-01", None),
    (11, "Lee Mei Ling", "Female", "Chinese", "L4", ["Figma", "Design Systems", "Mobile UI/UX", "User Research"], "Exceeds Expectations", "2021-06-01", None),
    (12, "Nurul Izzah binti Kamal", "Female", "Malay", "Lead", ["Apache Spark", "Snowflake", "dbt", "Airflow", "Python"], "High Potential", "2021-01-01", None),
    (13, "Arjun Nair", "Male", "Indian", "L3", ["Python", "SQL", "Airflow", "ETL", "Kafka"], "Meets Expectations", "2021-06-01", None),
    (14, "Wong Jia Hui", "Female", "Chinese", "L3", ["SQL", "Tableau", "Data Modeling", "Metabase"], "Meets Expectations", "2021-03-01", None),
    (15, "Muhammad Hafiz", "Male", "Malay", "Lead", ["QA Strategy", "Release Management", "Selenium", "Postman"], "Meets Expectations", "2022-01-01", None),
    (16, "Kavitha Devi", "Female", "Indian", "L4", ["Playwright", "Cypress", "CI/CD Automation", "TypeScript"], "High Potential", "2021-06-01", None),
    (17, "Lim Zhi Xian", "Male", "Chinese", "L2", ["Manual Testing", "Jira", "Regression Passes"], "Needs Upskilling", "2021-09-01", None),
    (18, "Nor Azman bin Yusof", "Male", "Malay", "L2", ["Manual Testing", "Hardware POS Testing"], "Exited (Company Pivot)", "2021-01-01", "2023-06-01"),
    (19, "Tan Shu Qi", "Female", "Chinese", "L2", ["Manual Regression", "Bug Tracking"], "Exited (Role Replaced by AI)", "2021-01-01", "2024-03-01"),
    (20, "Ravi Chandran", "Male", "Indian", "L3", ["Python", "Selenium", "Automation Testing", "Docker"], "High Potential", "2023-10-01", None),
    (21, "Aminah binti Rahman", "Female", "Malay", "Director", ["Kubernetes", "AWS", "Terraform", "SRE", "FinOps"], "High Potential", "2021-01-01", None),
    (22, "Chen Jia Wei", "Male", "Chinese", "L4", ["Kubernetes", "Helm", "GitLab CI", "AWS", "IaC"], "Exceeds Expectations", "2022-06-01", None),
    (23, "Mohd Syafiq", "Male", "Malay", "L3", ["AWS", "Linux Admin", "Docker"], "Exited (Relocation)", "2021-01-01", "2024-01-01"),
    (24, "Nadia binti Ismail", "Female", "Malay", "L4", ["Datadog", "Prometheus", "Cloud Security", "SRE"], "High Potential", "2023-01-01", None),
    (25, "Vikram Singh", "Male", "Indian", "L3", ["Golang", "REST APIs", "Docker", "PostgreSQL"], "Meets Expectations", "2021-01-01", None),
    (26, "Liew Pei San", "Female", "Chinese", "L3", ["React", "JavaScript", "Tailwind CSS"], "Meets Expectations", "2022-06-01", None),
    (27, "Ibrahim bin Osman", "Male", "Malay", "L3", ["Golang", "Bug Fixing", "Legacy Code", "Unit Tests"], "Stagnant (3.5 Yrs No Move)", "2021-06-01", None),
    (28, "Deepa Lakshmi", "Female", "Indian", "L4", ["Playwright", "TypeScript", "Performance Testing"], "High Potential", "2024-03-01", None),
    (29, "Marcus Wong", "Male", "Chinese", "Director", ["Engineering Ops", "Distributed Systems", "Hiring", "Architecture"], "Exceeds Expectations", "2021-01-01", None),
]

for e in emps_data:
    emp_id, name, gender, race, level, skills, performance, hire_date, exit_date = e
    email = name.replace(' ', '.').lower() + "@orglens.com"
    status = "exited" if exit_date else "active"
    avatar = make_avatar(name, gender, race)
    cursor.execute("""
        INSERT INTO employees (id, name, email, avatar_url, skills, level, performance, hire_date, exit_date, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (emp_id, name, email, avatar, json.dumps(skills), level, performance, hire_date, exit_date, status))

print("4. Seeding Historical Career Movements & Assignments...")
assigns = [
    # C-Level & Directors
    (1, 1, '2021-01-01', None, 'hired', 'Initial company founding executive'),
    (2, 29, '2021-01-01', None, 'hired', 'Joined as VP of Engineering'),
    (23, 2, '2021-01-01', None, 'hired', 'Joined as Head of People & Culture (HR Admin)'),
    (3, 3, '2021-01-01', None, 'hired', 'Joined as Engineering Manager'),
    
    # Fast Track Storyline: Siti Nurhaliza (Emp 7) -> Tech Lead (Role 4)
    (5, 7, '2021-01-01', '2022-01-01', 'hired', 'Started as Software Engineer'),
    (5, 7, '2022-01-01', '2023-01-01', 'promoted', 'Promoted to Senior Software Engineer'),
    (4, 7, '2023-01-01', None, 'promoted', 'Fast-tracked to Tech Lead in 2 years'),
    
    # Muthu Krishnan (Emp 4) & Priya Sharma (Emp 5) & Chong Wei Lin (Emp 6)
    (5, 4, '2021-01-01', None, 'hired', 'Senior Backend Engineer on Payments'),
    (5, 5, '2021-01-01', None, 'hired', 'Senior Software Engineer on Core APIs'),
    (6, 6, '2021-03-01', None, 'hired', 'Backend Software Engineer'),
    
    # Stagnant Career Storyline: Ibrahim bin Osman (Emp 27) - 3.5+ years mid level
    (6, 27, '2021-06-01', None, 'hired', 'Software Engineer - no promotion for 3.5+ years'),
    
    # Junior SWE (Emp 25)
    (7, 25, '2021-01-01', None, 'hired', 'Junior Engineer handling bug fixes'),
    
    # Frontend Lead (Emp 8) & Dev (Emp 26)
    (8, 8, '2021-03-01', None, 'hired', 'Hired as Frontend Lead'),
    (8, 26, '2022-06-01', None, 'hired', 'Frontend Developer'),
    
    # Product Team
    (9, 9, '2021-01-01', None, 'hired', 'Head of Product'),
    (10, 10, '2021-01-01', None, 'hired', 'Senior PM on Fueling & Wallet'),
    (11, 11, '2021-06-01', None, 'hired', 'Lead UX Designer'),
    
    # Data Team
    (12, 12, '2021-06-01', None, 'hired', 'Lead Data Engineer'),
    (13, 13, '2021-06-01', None, 'hired', 'Data Engineer on ETL'),
    (14, 14, '2021-09-01', None, 'hired', 'Data Analyst on Telemetry'),
    
    # QA Department Transformation Storyline (Manual shrinking, Automation growing)
    (15, 15, '2021-01-01', None, 'hired', 'QA Manager'),
    (16, 16, '2021-01-01', None, 'hired', 'Senior QA Automation'),
    (17, 17, '2021-09-01', None, 'hired', 'Manual QA Tester (At Risk)'),
    (18, 18, '2021-01-01', '2023-06-01', 'exited', 'Manual Tester phased out during automation migration'),
    (19, 19, '2021-01-01', '2024-03-01', 'exited', 'Manual Tester exit'),
    (19, 20, '2023-10-01', None, 'hired', 'Automation QA Engineer hired to replace manual testing'),
    (16, 28, '2024-03-01', None, 'hired', 'Playwright Automation Specialist'),
    
    # Platform Engineering Split Storyline (Q3 2023)
    (20, 21, '2023-07-01', None, 'transferred', 'Transferred from Eng to Head of Platform'),
    (21, 22, '2023-07-01', None, 'transferred', 'DevOps Engineer moved to Platform Dept'),
    (21, 23, '2021-01-01', '2024-01-01', 'exited', 'DevOps Engineer (Relocated)'),
    (22, 24, '2023-07-01', None, 'transferred', 'Cloud SRE moved to Platform Dept'),
]

for a in assigns:
    cursor.execute("""
        INSERT INTO assignments (role_id, employee_id, start_date, end_date, reason, notes) 
        VALUES (?, ?, ?, ?, ?, ?)
    """, a)

print("5. Seeding Role Mutations & Restructuring Scenarios...")
mutations = [
    (15, 16, 'split', '2022-06-01', 'QA Split into Manual QA and Automated Testing units'),
    (3, 20, 'split', '2023-07-01', 'Infrastructure & DevOps squad split out of Core Engineering into new Platform Engineering Department'),
    (17, 19, 'merged', '2024-01-01', 'Manual QA roles phased out and merged into Automated QA discipline')
]
for m in mutations:
    cursor.execute("""
        INSERT INTO role_mutations (source_role_id, target_role_id, mutation_type, effective_date, notes) 
        VALUES (?, ?, ?, ?, ?)
    """, m)

# 3 Concrete Restructuring Scenarios
scenarios_data = [
    (1, "Baseline 2021 Foundation", "2021-01-01", 
     "Initial monolithic organization with combined Core Engineering and large manual QA team.",
     "Baseline", json.dumps(["5 Manual QAs active", "No dedicated Platform Dept", "Monolith backend"]), "Low"),
    
    (2, "Q3 2023 Platform Engineering Split", "2023-07-01", 
     "DevOps, SRE, and Cloud Infrastructure spun off into dedicated Platform Engineering Department. Reporting lines restructured.",
     "Reorg Split", json.dumps(["New Platform Dept created", "DevOps reporting moved to Aminah", "QA Automation team expanded"]), "High"),
    
    (3, "2025 AI & Automation Transformation", "2025-01-01", 
     "Manual QA completely phased out. AI-assisted testing and cloud automation adopted across Setel infrastructure.",
     "Tech Evolution", json.dumps(["Manual QA deprecated", "Upskilling to Playwright/Python", "100% CI/CD deployment automation"]), "Medium")
]
for sc in scenarios_data:
    cursor.execute("""
        INSERT INTO scenarios (id, name, effective_date, description, tag, key_changes, impact_level) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, sc)

print("6. Seeding 250+ Jira Ticket Logs for Work Analysis & Restructuring Placement...")
categories = ["backend", "frontend", "devops", "data", "testing", "documentation", "architecture"]
# Generate realistic work distribution
ticket_counter = 1000
for emp_id in range(1, 30):
    # Determine dominant work profile
    if emp_id in [4, 5, 6, 7, 27]: # Backend SWEs
        weights = [60, 10, 15, 5, 5, 5, 0]
    elif emp_id in [8, 26]: # Frontend
        weights = [10, 70, 5, 5, 5, 5, 0]
    elif emp_id in [21, 22, 24]: # Platform / DevOps
        weights = [15, 0, 70, 5, 5, 5, 0]
    elif emp_id in [12, 13, 14]: # Data
        weights = [10, 5, 10, 65, 5, 5, 0]
    elif emp_id in [15, 16, 17, 20, 28]: # QA
        weights = [5, 5, 10, 0, 70, 10, 0]
    elif emp_id == 2: # Sarah Lim - Head of People & Culture (HR)
        weights = [0, 0, 0, 0, 0, 60, 40]
    elif emp_id == 22: # Chen Jia Wei - Anomaly! A SWE who spends 75% on DevOps
        weights = [15, 5, 75, 0, 0, 5, 0]
    else:
        weights = [25, 25, 10, 10, 10, 10, 10]
        
    # Generate 10-15 tickets per employee
    num_tickets = random.randint(10, 15)
    for _ in range(num_tickets):
        ticket_counter += 1
        cat = random.choices(categories, weights=weights)[0]
        hours = round(random.uniform(2.5, 18.0), 1)
        rand_days = random.randint(10, 700)
        t_date = date(2023, 1, 1) + timedelta(days=rand_days)
        cursor.execute("""
            INSERT INTO ticket_logs (employee_id, ticket_id, category, hours_spent, completed_date) 
            VALUES (?, ?, ?, ?, ?)
        """, (emp_id, f"SETEL-{ticket_counter}", cat, hours, t_date.strftime("%Y-%m-%d")))

print("7. Seeding Role Relevancy & AI Upskilling Suggestions...")
relevancy_records = [
    (17, "2023-01-01", 0.32, "Manual QA demand declining by -38% due to automated CI/CD suites.", "down",
     json.dumps([
         {"course": "Playwright Modern E2E Testing with TypeScript", "duration": "4 weeks", "urgency": "High", "relevance_gain": "+45%"},
         {"course": "API Test Automation with Postman & Python", "duration": "2 weeks", "urgency": "Medium", "relevance_gain": "+30%"}
     ])),
    (21, "2023-07-01", 0.94, "DevOps and Platform Engineering demand up +52% in fintech.", "up",
     json.dumps([
         {"course": "Certified Kubernetes Administrator (CKA)", "duration": "6 weeks", "urgency": "Medium", "relevance_gain": "+15%"},
         {"course": "AWS FinOps & Infrastructure as Code (Terraform)", "duration": "3 weeks", "urgency": "Low", "relevance_gain": "+10%"}
     ])),
    (4, "2023-01-01", 0.91, "High-throughput fintech payment architecture demand is strong.", "up",
     json.dumps([
         {"course": "Distributed Consensus with Raft & Kafka Event Sourcing", "duration": "5 weeks", "urgency": "Medium", "relevance_gain": "+20%"}
     ])),
    (27, "2023-01-01", 0.58, "Legacy backend maintenance is transitioning to cloud-native Go microservices.", "down",
     json.dumps([
         {"course": "Modern Golang Concurrency & Microservices Architecture", "duration": "4 weeks", "urgency": "High", "relevance_gain": "+35%"},
         {"course": "Cloud Native Architecture on AWS EKS", "duration": "4 weeks", "urgency": "High", "relevance_gain": "+30%"}
     ]))
]
for rel in relevancy_records:
    cursor.execute("""
        INSERT INTO role_relevancy (role_id, assessed_date, relevancy_score, industry_trend, trend_direction, upskill_suggestions) 
        VALUES (?, ?, ?, ?, ?, ?)
    """, rel)

print("8. Seeding Supportive Event-Driven Wellbeing Check-ins...")
# Triggered strictly by organizational events: Reorg Split, Manager Musical Chairs, Fast Transition
wellbeing_data = [
    (7, "rapid_promotion_transition", "2023-02-01", 3, 1, "2023-02-05", 2, "Adjusting well to Tech Lead scope; grateful for executive sponsorship."),
    (22, "reorg_platform_split", "2023-08-01", 2, 1, "2023-08-04", 3, "New reporting line is clear. Adapting to expanded Terraform responsibilities."),
    (17, "tech_trend_role_shift", "2023-11-01", 2, 0, None, None, "Check-in pending response on test automation transition."),
    (27, "stagnant_tenure_checkin", "2024-01-15", 1, 1, "2024-01-20", 4, "Expressing desire for new challenge or transfer to Platform team."),
    (5, "manager_change", "2023-09-01", 2, 1, "2023-09-03", 2, "Smooth transition with new Tech Lead."),
    (24, "reorg_platform_split", "2023-08-01", 2, 1, "2023-08-06", 2, "Excited about dedicated SRE budget.")
]
for w in wellbeing_data:
    cursor.execute("""
        INSERT INTO wellbeing_checkins (employee_id, triggered_by, trigger_date, org_changes_count, responded, response_date, stress_level, notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, w)

conn.commit()
conn.close()
print("[SUCCESS] OrgLens Setel Database Seeded Successfully with 28 Rich Personas & Scenarios!")
