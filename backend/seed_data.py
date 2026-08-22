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
    
    (12, "DAT-LEAD-001", "Lead Data Engineer", 3, 1, "Lead",
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
    
    (15, "QA-MGR-001", "QA Manager", 4, 1, "Lead",
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
    
    (20, "PLT-MGR-001", "Head of Platform Engineering", 5, 1, "Director",
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
    (8, "Raj Kumar", "Male", "Indian", "Lead", ["React", "TypeScript", "Tailwind CSS", "Next.js"], "Exceeds Expectations", "2021-03-01", None),
    (9, "Faizal bin Mohd Nor", "Male", "Malay", "Director", ["Product Vision", "Fintech Strategy", "UX Discovery"], "Exceeds Expectations", "2021-01-01", None),
    (10, "Aisha binti Zainal", "Female", "Malay", "L4", ["Product Roadmapping", "User Stories", "A/B Testing"], "High Potential", "2021-01-01", None),
    (11, "Lee Mei Ling", "Female", "Chinese", "L4", ["Figma", "Design Systems", "Mobile UI/UX", "User Research"], "Exceeds Expectations", "2021-06-01", None),
    (12, "Nurul Izzah binti Kamal", "Female", "Malay", "Lead", ["Apache Spark", "Snowflake", "dbt", "Airflow", "Python"], "High Potential", "2021-06-01", None),
    (13, "Arjun Nair", "Male", "Indian", "L3", ["Python", "SQL", "Airflow", "ETL", "Kafka"], "Meets Expectations", "2021-06-01", None),
    (14, "Wong Jia Hui", "Female", "Chinese", "L3", ["SQL", "Tableau", "Data Modeling", "Metabase"], "Meets Expectations", "2021-09-01", None),
    (15, "Muhammad Hafiz", "Male", "Malay", "Lead", ["QA Strategy", "Release Management", "Selenium", "Postman"], "Meets Expectations", "2021-01-01", None),
    (16, "Kavitha Devi", "Female", "Indian", "L4", ["Playwright", "Cypress", "CI/CD Automation", "TypeScript"], "High Potential", "2021-01-01", None),
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
    (6, 7, '2021-01-01', '2021-09-01', 'hired', 'Joined as Software Engineer on core backend services'),
    (5, 7, '2021-09-01', '2022-06-01', 'promoted', 'Promoted to Senior Software Engineer after strong delivery'),
    (5, 7, '2022-06-01', '2023-01-01', 'scope_increase', 'Expanded scope to lead payments squad technical direction'),
    (4, 7, '2023-01-01', None, 'promoted', 'Fast-tracked to Tech Lead (Payments) in 2 years'),
    
    # Muthu Krishnan (Emp 4) - Senior Backend Engineer with lateral growth
    (6, 4, '2021-01-01', '2022-03-01', 'hired', 'Joined as Software Engineer on transaction processing'),
    (5, 4, '2022-03-01', None, 'promoted', 'Promoted to Senior Software Engineer after leading payment gateway integration'),
    
    # Priya Sharma (Emp 5) - Senior SWE with project rotations
    (6, 5, '2021-01-01', '2021-08-01', 'hired', 'Joined as Software Engineer on core APIs'),
    (5, 5, '2021-08-01', '2023-06-01', 'promoted', 'Promoted to Senior Software Engineer on high-concurrency services'),
    (5, 5, '2023-06-01', None, 'lateral', 'Lateral rotation to wallet microservices squad for breadth exposure'),
    
    # Chong Wei Lin (Emp 6) - Backend SWE with skill expansion
    (7, 6, '2021-03-01', '2022-01-01', 'hired', 'Joined as Junior Engineer on API maintenance'),
    (6, 6, '2022-01-01', None, 'promoted', 'Promoted to Software Engineer after completing Go certification'),
    
    # Stagnant Career Storyline: Ibrahim bin Osman (Emp 27) - 3.5+ years mid level
    (6, 27, '2021-06-01', None, 'hired', 'Software Engineer - no promotion for 3.5+ years despite adequate performance'),
    
    # Junior SWE Vikram (Emp 25) - has shown recent growth
    (7, 25, '2021-01-01', '2023-06-01', 'hired', 'Junior Engineer handling bug fixes and unit tests'),
    (7, 25, '2023-06-01', None, 'scope_increase', 'Expanded responsibilities to include feature development and code reviews'),
    
    # Frontend Lead Raj Kumar (Emp 8) - progression from IC to Lead
    (6, 8, '2021-03-01', '2022-01-01', 'hired', 'Joined as Frontend Developer on merchant portal'),
    (8, 8, '2022-01-01', None, 'promoted', 'Promoted to Frontend Lead after architecting the design system'),
    
    # Frontend Dev Liew Pei San (Emp 26)
    (8, 26, '2022-06-01', None, 'hired', 'Joined as Frontend Developer under Raj Kumar'),
    
    # Head of Product Faizal (Emp 9) - external senior hire
    (9, 9, '2021-01-01', None, 'hired', 'Joined as Head of Product from Grab Financial Group'),
    
    # PM Payments Aisha (Emp 10) - internal growth
    (11, 10, '2021-01-01', '2022-03-01', 'hired', 'Joined as Associate PM supporting UX research'),
    (10, 10, '2022-03-01', None, 'promoted', 'Promoted to Product Manager (Payments) after launching fuel loyalty program'),
    
    # UX Designer Lee Mei Ling (Emp 11) - expanded scope
    (11, 11, '2021-06-01', '2023-01-01', 'hired', 'Joined as UX Designer on consumer mobile app'),
    (11, 11, '2023-01-01', None, 'scope_increase', 'Elevated to Senior UX Designer; now owns end-to-end design system'),
    
    # Lead Data Engineer Nurul Izzah (Emp 12) - progression
    (13, 12, '2021-06-01', '2022-09-01', 'hired', 'Joined as Data Engineer building ETL pipelines'),
    (12, 12, '2022-09-01', None, 'promoted', 'Promoted to Lead Data Engineer after architecting streaming lakehouse'),
    
    # Data Engineer Arjun (Emp 13) - lateral rotation
    (14, 13, '2021-06-01', '2022-06-01', 'hired', 'Joined as Data Analyst on reporting dashboards'),
    (13, 13, '2022-06-01', None, 'lateral', 'Lateral move to Data Engineer role to focus on pipeline development'),
    
    # Data Analyst Wong Jia Hui (Emp 14)
    (14, 14, '2021-09-01', '2023-03-01', 'hired', 'Joined as Junior Data Analyst on telemetry'),
    (14, 14, '2023-03-01', None, 'scope_increase', 'Expanded scope to include predictive analytics and ML model validation'),
    
    # QA Manager Muhammad Hafiz (Emp 15) - evolved from IC
    (16, 15, '2021-01-01', '2022-06-01', 'hired', 'Joined as Senior QA Engineer leading test strategy'),
    (15, 15, '2022-06-01', None, 'promoted', 'Promoted to QA Manager to oversee automation transformation'),
    
    # Senior QA Automation Kavitha Devi (Emp 16) - growth in automation
    (19, 16, '2021-01-01', '2022-01-01', 'hired', 'Joined as QA Automation Engineer on API testing'),
    (16, 16, '2022-01-01', None, 'promoted', 'Promoted to Senior QA Engineer (Automation) after building Playwright framework'),
    
    # Manual QA Tester Lim Zhi Xian (Emp 17) - at risk
    (17, 17, '2021-09-01', None, 'hired', 'Manual QA Tester - role declining due to automation'),
    
    # Manual QA Tester II (Emp 18) - exited
    (18, 18, '2021-01-01', '2023-06-01', 'exited', 'Manual Tester phased out during automation migration'),
    
    # Manual Tester (Emp 19) exit -> replaced by Automation QA (Emp 20)
    (17, 19, '2021-01-01', '2024-03-01', 'exited', 'Manual Tester exit due to automation transition'),
    (19, 20, '2023-10-01', None, 'hired', 'Automation QA Engineer hired to replace manual testing'),
    
    # Deepa Lakshmi (Emp 28) - Playwright specialist
    (16, 28, '2024-03-01', None, 'hired', 'Joined as Playwright Automation Specialist'),
    
    # Platform Engineering Split Storyline (Q3 2023)
    # Aminah (Emp 21) - from Engineering to Platform Head
    (3, 21, '2021-01-01', '2022-06-01', 'hired', 'Joined as Senior DevOps Engineer under Engineering'),
    (3, 21, '2022-06-01', '2023-07-01', 'scope_increase', 'Led cloud infrastructure initiative and FinOps practices'),
    (20, 21, '2023-07-01', None, 'transferred', 'Transferred to Head of Platform Engineering in new department split'),
    
    # Chen Jia Wei (Emp 22) - DevOps growth
    (6, 22, '2022-06-01', '2023-07-01', 'hired', 'Joined as DevOps Engineer under Engineering'),
    (21, 22, '2023-07-01', None, 'transferred', 'Moved to Senior DevOps Engineer under Platform Engineering dept'),
    
    # Mohd Syafiq (Emp 23) - exited
    (21, 23, '2021-01-01', '2024-01-01', 'exited', 'DevOps Engineer - relocated overseas'),
    
    # Nadia binti Ismail (Emp 24) - SRE with transfer
    (6, 24, '2023-01-01', '2023-07-01', 'hired', 'Joined as Backend Engineer with SRE focus'),
    (22, 24, '2023-07-01', None, 'transferred', 'Transferred to Cloud Security & SRE under Platform Engineering'),
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

# AI-generated role relevancy intelligence for all 23 roles
# Scores reflect 2024 SEA fintech market realities. Upskilling recommendations are real industry certifications and courses.

role_relevancy_config = {
    # Role 1: CTO
    1: (0.83, "stable",
        "CTO demand remains strong but the role is evolving from pure technology oversight to AI governance, cybersecurity leadership, and digital P&L ownership. Boards increasingly expect CTOs to drive revenue through technology.",
        [{"course": "MIT Sloan: Artificial Intelligence Implications for Business Strategy", "duration": "6 weeks", "urgency": "Medium", "relevance_gain": "+12%"},
         {"course": "TOGAF Enterprise Architecture Certification", "duration": "8 weeks", "urgency": "Low", "relevance_gain": "+8%"}]),

    # Role 2: VP of Engineering
    2: (0.78, "stable",
        "VP Engineering roles are stable but face growing expectations around developer experience (DevEx) metrics, DORA performance tracking, and AI-augmented delivery. Orgs with strong VPEs ship 2.4x faster.",
        [{"course": "Engineering Leadership: Managing High-Performance Teams (Coursera - Kellogg)", "duration": "5 weeks", "urgency": "Medium", "relevance_gain": "+15%"},
         {"course": "DORA Metrics & Developer Productivity Workshop (LinearB)", "duration": "2 weeks", "urgency": "Medium", "relevance_gain": "+12%"}]),

    # Role 3: Engineering Manager (Core Services)
    3: (0.85, "up",
        "Engineering managers who combine people leadership with hands-on system design capability see +35% higher retention offers. Fintech EMs need deep payments domain knowledge.",
        [{"course": "Gergely Orosz: The Pragmatic Engineer - Engineering Management", "duration": "4 weeks", "urgency": "Medium", "relevance_gain": "+18%"},
         {"course": "AWS Solutions Architect Associate (SAA-C03)", "duration": "6 weeks", "urgency": "Medium", "relevance_gain": "+20%"}]),

    # Role 4: Tech Lead (Payments)
    4: (0.93, "up",
        "Payment system architects are among the highest-demand technical roles in SEA fintech. Real-time payments (DuitNow, FPX), tokenisation, and PCI-DSS v4.0 compliance drive continuous need for senior payment engineers.",
        [{"course": "Designing Data-Intensive Applications (Martin Kleppmann Study Group)", "duration": "8 weeks", "urgency": "Medium", "relevance_gain": "+15%"},
         {"course": "PCI-DSS v4.0 Implementation & Compliance", "duration": "3 weeks", "urgency": "High", "relevance_gain": "+12%"},
         {"course": "gRPC & Protocol Buffers Masterclass (Udemy - Clement Jean)", "duration": "3 weeks", "urgency": "Medium", "relevance_gain": "+10%"}]),

    # Role 5: Senior Software Engineer
    5: (0.88, "up",
        "Senior backend engineers with Go, event-driven architecture, and distributed systems skills are in peak demand across Malaysian fintech (GXBank, Touch'n Go, Setel). Average 18% YoY salary growth.",
        [{"course": "Ardan Labs: Ultimate Go - Advanced Engineering", "duration": "5 weeks", "urgency": "High", "relevance_gain": "+22%"},
         {"course": "Apache Kafka for Event-Driven Architecture (Confluent)", "duration": "4 weeks", "urgency": "High", "relevance_gain": "+20%"}]),

    # Role 6: Software Engineer
    6: (0.74, "stable",
        "Mid-level engineers remain employable but face growing expectations. Employers now require containerisation, observability, and API-first thinking as baseline rather than differentiators.",
        [{"course": "Docker & Kubernetes: The Practical Guide (Udemy - Maximilian)", "duration": "4 weeks", "urgency": "High", "relevance_gain": "+25%"},
         {"course": "Go (Golang): The Complete Developer's Guide (Udemy - Stephen Grider)", "duration": "5 weeks", "urgency": "Medium", "relevance_gain": "+20%"},
         {"course": "PostgreSQL Performance Tuning (Pluralsight)", "duration": "2 weeks", "urgency": "Medium", "relevance_gain": "+15%"}]),

    # Role 7: Junior Software Engineer
    7: (0.58, "down",
        "Junior developer roles face 25-30% demand compression due to AI coding assistants (Copilot, Cursor, Claude Code) handling boilerplate. Entry-level must demonstrate system thinking and testing skills to stay competitive.",
        [{"course": "CS50x: Introduction to Computer Science (Harvard/edX)", "duration": "12 weeks", "urgency": "Medium", "relevance_gain": "+20%"},
         {"course": "AI-Assisted Development: GitHub Copilot & Prompt Engineering for Devs", "duration": "2 weeks", "urgency": "High", "relevance_gain": "+30%"},
         {"course": "Test-Driven Development in Go (Quii - Learn Go with Tests)", "duration": "4 weeks", "urgency": "High", "relevance_gain": "+22%"}]),

    # Role 8: Frontend Lead
    8: (0.90, "up",
        "Frontend leads with React Server Components, Next.js App Router, and design-system-as-code expertise are top-tier hires. Mobile-first fintech UIs demand performance optimisation and accessibility compliance.",
        [{"course": "Epic React (Kent C. Dodds) - Advanced Patterns & Performance", "duration": "6 weeks", "urgency": "High", "relevance_gain": "+20%"},
         {"course": "Web Performance Fundamentals (Todd Gardner - Frontend Masters)", "duration": "2 weeks", "urgency": "Medium", "relevance_gain": "+15%"},
         {"course": "React Native for Cross-Platform Fintech Apps", "duration": "5 weeks", "urgency": "Medium", "relevance_gain": "+18%"}]),

    # Role 9: Head of Product
    9: (0.80, "stable",
        "Product leadership is stable but the role now requires fluency in AI product strategy, growth experimentation, and regulatory fintech compliance (BNM guidelines). Pure feature-factory PMs are declining.",
        [{"course": "Reforge: Product Strategy Program", "duration": "6 weeks", "urgency": "Medium", "relevance_gain": "+18%"},
         {"course": "AI Product Management Specialization (Duke University - Coursera)", "duration": "4 weeks", "urgency": "High", "relevance_gain": "+22%"}]),

    # Role 10: Product Manager (Payments)
    10: (0.86, "up",
        "Payment PMs in SEA are highly valued as DuitNow QR, cross-border remittance, and BNPL products expand. Requires deep understanding of BNM regulatory sandbox and payment network economics.",
        [{"course": "Fintech Product Management (Kellogg Executive Education)", "duration": "4 weeks", "urgency": "Medium", "relevance_gain": "+20%"},
         {"course": "Amplitude Analytics & Experimentation Certification", "duration": "2 weeks", "urgency": "Medium", "relevance_gain": "+15%"},
         {"course": "BNM Regulatory Framework for Payment Systems (AICB)", "duration": "3 weeks", "urgency": "High", "relevance_gain": "+18%"}]),

    # Role 11: Senior UX Designer
    11: (0.84, "up",
        "UX designers who can bridge design-to-code (Figma Dev Mode, design tokens) and leverage AI prototyping tools are 40% more productive. Fintech UX demands WCAG 2.2 compliance and financial literacy design patterns.",
        [{"course": "Figma for Developers: Design Systems & Tokens (Figma Official)", "duration": "3 weeks", "urgency": "High", "relevance_gain": "+20%"},
         {"course": "Google UX Design Professional Certificate (Coursera)", "duration": "6 weeks", "urgency": "Low", "relevance_gain": "+12%"},
         {"course": "Inclusive Financial Services UX (CGAP/World Bank)", "duration": "2 weeks", "urgency": "Medium", "relevance_gain": "+15%"}]),

    # Role 12: Lead Data Engineer
    12: (0.91, "up",
        "Lead data engineers who architect streaming-first lakehouse platforms (Kafka + dbt + Snowflake/Databricks) command top-tier compensation. Real-time fraud detection and transaction analytics are core fintech needs.",
        [{"course": "Databricks Certified Data Engineer Professional", "duration": "6 weeks", "urgency": "High", "relevance_gain": "+18%"},
         {"course": "Apache Kafka & Stream Processing (Confluent Certified Developer)", "duration": "5 weeks", "urgency": "High", "relevance_gain": "+20%"}]),

    # Role 13: Data Engineer
    13: (0.77, "up",
        "Data engineers must transition from batch ETL to streaming architectures. dbt, Airflow 2.x, and real-time feature stores are now standard expectations. Python + SQL foundation remains essential.",
        [{"course": "dbt Fundamentals & Advanced Materialisation (dbt Labs Official)", "duration": "3 weeks", "urgency": "High", "relevance_gain": "+25%"},
         {"course": "Apache Airflow: The Hands-On Guide (Astronomer/Udemy)", "duration": "4 weeks", "urgency": "Medium", "relevance_gain": "+20%"},
         {"course": "Streaming Data with Kafka & Apache Flink (Confluent)", "duration": "5 weeks", "urgency": "Medium", "relevance_gain": "+22%"}]),

    # Role 14: Data Analyst
    14: (0.65, "down",
        "Traditional BI analyst roles face pressure from self-serve analytics (Metabase, Looker) and AI-generated insights. Must evolve toward analytics engineering (dbt), Python scripting, or ML literacy to remain competitive.",
        [{"course": "Google Advanced Data Analytics Certificate (Coursera)", "duration": "6 weeks", "urgency": "High", "relevance_gain": "+28%"},
         {"course": "Analytics Engineering with dbt (dbt Labs)", "duration": "3 weeks", "urgency": "High", "relevance_gain": "+25%"},
         {"course": "Python for Data Science & Machine Learning Bootcamp (Udemy - Jose Portilla)", "duration": "5 weeks", "urgency": "Medium", "relevance_gain": "+22%"}]),

    # Role 15: QA Manager
    15: (0.55, "down",
        "QA manager role is transforming from manual test oversight to quality engineering leadership. Must drive shift-left testing culture, own automation ROI metrics, and embed quality gates into CI/CD. Traditional QA management declining -30%.",
        [{"course": "ISTQB Advanced Test Manager Certification", "duration": "6 weeks", "urgency": "High", "relevance_gain": "+25%"},
         {"course": "Quality Engineering Leadership: Building Automation Centres of Excellence", "duration": "4 weeks", "urgency": "High", "relevance_gain": "+30%"},
         {"course": "Playwright Test Automation Framework Design (Test Automation University)", "duration": "3 weeks", "urgency": "Medium", "relevance_gain": "+20%"}]),

    # Role 16: Senior QA Engineer (Automation)
    16: (0.94, "up",
        "Senior QA automation engineers with Playwright, TypeScript, and AI-powered test generation skills are among the fastest-growing roles. Companies report 60% reduction in regression cycles with mature automation.",
        [{"course": "Playwright with TypeScript: Complete E2E Testing (Udemy - Kaniel Outis)", "duration": "4 weeks", "urgency": "Low", "relevance_gain": "+10%"},
         {"course": "Performance Testing with k6 & Grafana Cloud", "duration": "3 weeks", "urgency": "Medium", "relevance_gain": "+15%"},
         {"course": "AI-Powered Test Generation with Codium/Testim", "duration": "2 weeks", "urgency": "Medium", "relevance_gain": "+12%"}]),

    # Role 17: Manual QA Tester (retired)
    17: (0.28, "down",
        "Manual QA tester demand has dropped -45% since 2022. Automated CI/CD pipelines with Playwright and Cypress now cover 90%+ of regression scenarios. Role is being retired across most fintech organisations.",
        [{"course": "Playwright Complete Guide: E2E Testing (Test Automation University)", "duration": "5 weeks", "urgency": "Critical", "relevance_gain": "+45%"},
         {"course": "Python for Test Automation (Udemy - Andrew Knight)", "duration": "4 weeks", "urgency": "Critical", "relevance_gain": "+35%"},
         {"course": "ISTQB Certified Tester - Test Automation Engineer", "duration": "6 weeks", "urgency": "High", "relevance_gain": "+30%"}]),

    # Role 18: Manual QA Tester II (retired)
    18: (0.22, "down",
        "Role fully eliminated. Hardware POS testing consolidated into automated device farms. Former occupants must retrain into automation engineering or adjacent quality roles to remain in tech industry.",
        [{"course": "Career Transition: QA Manual to Automation Engineer Pathway (Ministry of Testing)", "duration": "10 weeks", "urgency": "Critical", "relevance_gain": "+55%"},
         {"course": "JavaScript/TypeScript Fundamentals for Testers", "duration": "4 weeks", "urgency": "Critical", "relevance_gain": "+35%"},
         {"course": "Appium Mobile Test Automation (LambdaTest University)", "duration": "4 weeks", "urgency": "High", "relevance_gain": "+30%"}]),

    # Role 19: Automation QA Engineer
    19: (0.79, "up",
        "Mid-level automation QA engineers are well-positioned as organisations scale test suites. Growing demand for contract testing (Pact), visual regression (Percy), and API schema validation skills.",
        [{"course": "Contract Testing with Pact (PactFlow Official Training)", "duration": "2 weeks", "urgency": "High", "relevance_gain": "+22%"},
         {"course": "Advanced API Testing: REST Assured & Postman Newman CI/CD", "duration": "3 weeks", "urgency": "Medium", "relevance_gain": "+18%"},
         {"course": "Visual Regression Testing with Percy & Chromatic", "duration": "2 weeks", "urgency": "Medium", "relevance_gain": "+15%"}]),

    # Role 20: Head of Platform Engineering
    20: (0.97, "up",
        "Platform Engineering is the #1 emerging discipline in Gartner's 2024 Hype Cycle. Heads of Platform who build Internal Developer Platforms (IDPs) with golden paths, self-serve infra, and FinOps governance are top-1% hires.",
        [{"course": "Certified Kubernetes Administrator (CKA) - Linux Foundation", "duration": "8 weeks", "urgency": "Low", "relevance_gain": "+8%"},
         {"course": "Platform Engineering on Kubernetes (Manning LiveProject)", "duration": "4 weeks", "urgency": "Low", "relevance_gain": "+10%"}]),

    # Role 21: Senior DevOps Engineer
    21: (0.92, "up",
        "Senior DevOps engineers with Kubernetes, GitOps (ArgoCD/Flux), and infrastructure-as-code (Terraform/OpenTofu) skills remain top 5% market demand. Fintech requires SOC2/ISO27001 compliance automation.",
        [{"course": "Certified Kubernetes Administrator (CKA) - Linux Foundation", "duration": "8 weeks", "urgency": "Medium", "relevance_gain": "+15%"},
         {"course": "HashiCorp Certified: Terraform Associate (003)", "duration": "4 weeks", "urgency": "Medium", "relevance_gain": "+12%"},
         {"course": "GitOps with ArgoCD: Deploying to Kubernetes (Udemy)", "duration": "3 weeks", "urgency": "Medium", "relevance_gain": "+10%"}]),

    # Role 22: Cloud Security & SRE
    22: (0.91, "up",
        "Cloud SRE demand surging as fintech uptime SLAs tighten to 99.99%. BNM mandates operational resilience for payment service providers. Observability (OpenTelemetry) and incident response frameworks are critical.",
        [{"course": "AWS Certified Security - Specialty (SCS-C02)", "duration": "6 weeks", "urgency": "High", "relevance_gain": "+20%"},
         {"course": "OpenTelemetry & Distributed Tracing (Grafana Labs)", "duration": "3 weeks", "urgency": "High", "relevance_gain": "+18%"},
         {"course": "Site Reliability Engineering: Google SRE Book Study Group", "duration": "4 weeks", "urgency": "Medium", "relevance_gain": "+12%"}]),

    # Role 23: Head of People & Culture
    23: (0.72, "stable",
        "HR leadership evolving toward data-driven people analytics, AI-powered workforce planning, and organisational network analysis. Traditional HR admin declining but strategic people ops remains essential.",
        [{"course": "People Analytics Specialization (Wharton - Coursera)", "duration": "5 weeks", "urgency": "High", "relevance_gain": "+25%"},
         {"course": "SHRM Senior Certified Professional (SHRM-SCP)", "duration": "8 weeks", "urgency": "Medium", "relevance_gain": "+15%"},
         {"course": "Organisational Network Analysis with Microsoft Viva Insights", "duration": "2 weeks", "urgency": "Medium", "relevance_gain": "+18%"}]),
}

# Generate relevancy records with varied assessment dates for realism
assessment_dates = ["2023-01-15", "2023-04-01", "2023-07-01", "2023-10-01", "2024-01-15", "2024-04-01"]

relevancy_records = []
for role_id, (score, direction, trend_text, suggestions) in role_relevancy_config.items():
    # Each role gets 2-3 historical assessments showing score evolution
    num_assessments = random.randint(2, 3)
    selected_dates = sorted(random.sample(assessment_dates, num_assessments))
    
    for i, assess_date in enumerate(selected_dates):
        # Earlier assessments have slightly different scores (simulate progression)
        if i == len(selected_dates) - 1:
            # Most recent = final score
            adj_score = score
        else:
            # Earlier scores: drift slightly from final
            drift = random.uniform(-0.08, 0.05)
            adj_score = max(0.15, min(0.99, round(score + drift, 2)))
        
        relevancy_records.append((
            role_id,
            assess_date,
            adj_score,
            trend_text,
            direction,
            json.dumps(suggestions)
        ))

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
