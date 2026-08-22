# Lab 2: Mapping How Roles and People Evolve Over Time (Powered by Setel)
## Technical Difficulty & Feasibility Assessment Report

---

### 1. Executive Summary & Difficulty Rating

* **Challenge Track:** People-Centric Tech & Collaboration
* **Official Sponsor:** Setel (Petronas Group)
* **Core Mission:** Reconstructing two intertwined temporal trajectories (the evolution of organizational roles vs. the career journey of individuals) from scattered, incomplete HR records, and visualizing their intersections across time.
* **Overall Difficulty Score:** **7.8 / 10** (Moderate-High Difficulty)
* **Primary Technical Bottleneck:** Temporal graph modeling, entity resolution across title renames/mergers/splits, and intuitive multi-dimensional timeline visualization.

---

### 2. Multi-Dimensional Difficulty Scoring

| Evaluation Dimension | Score (1-10) | Rating | Key Technical Drivers |
| :--- | :---: | :---: | :--- |
| **Data Modeling & Graph Architecture** | **8.5 / 10** | High | Modeling bi-temporal graphs: valid time (when events happened in reality) vs. transaction time (when recorded). Handling 1-to-many role splits, many-to-1 mergers, and concurrent reporting lines. |
| **Messy Data & Entity Resolution** | **8.0 / 10** | High | Reconciling fragmented records: title variations (e.g. "Frontend Lead" vs "Lead UI Engineer"), missing dates, out-of-order promotions, and department re-organizations without breaking graph integrity. |
| **Algorithmic Logic (Traversal)** | **7.5 / 10** | Moderate-High | Bi-directional state reconstruction: querying "What was the org hierarchy on 2024-03-15?" vs "Trace Person X's full career trajectory relative to role redesignations". |
| **UI/UX & Interactive Visualization** | **9.0 / 10** | Very High | Building an intuitive interactive timeline/scrubber, interactive dynamic org-chart playback, and side-by-side synchronized Role-Person dual view. |
| **AI / NLP Integration** | **6.0 / 10** | Moderate | Using NLP/LLMs primarily for unstructured HR text extraction (offer letters, promotion emails) and fuzzy role similarity clustering. |
| **Hackathon Velocity / Build Risk** | **7.0 / 10** | Moderate | Highly visual; high risk of sinking excessive time into complex D3.js / React Flow rendering instead of solid temporal data structures. |

---

### 3. Deceptive Traps & Hard Failure Modes

1. **The Static Snapshot Trap:** Building a standard hierarchical org chart that only represents one point in time, failing to capture continuous structural evolution.
2. **The Disconnected View Failure:** Creating two separate siloed tables (a role log and a person log) without interactive bi-directional cross-linking.
3. **Graph Breakage on Missing Data:** Crashing or showing orphaned nodes when historical promotion records have missing intermediary managers or unrecorded dates.
4. **Visual Clutter / Spaghetti Graph:** Overwhelming the user with dense node-link diagrams when zooming out over 3-5 years of company-wide reorganizations.

---

### 4. Competitive Tier Matrix (What Separates Good from Winning)

* **Tier 1 (Average Submission - 5.0/10):** Basic static timeline or relational table showing employee job history. No dynamic role evolution or reporting line shift visualization.
* **Tier 2 (Strong Submission - 7.5/10):** Interactive timeline with React Flow / Cytoscape graph, time-scrubber slider showing org chart changes year-by-year, basic fuzzy search.
* **Tier 3 (Setel Winning Tier - 9.5/10):**
  * **Unified Dual-Lens Temporal Engine:** Seamless 1-click toggle between "Role Evolution View" (title changes, reporting line shifts, occupant history) and "Person Journey View" (career milestones, department moves, manager transitions).
  * **Dynamic Time-Travel Org Map:** Smooth animated time-scrubber allowing HR leaders to replay department restructuring across any specific calendar date.
  * **Graceful Gap Detection & Inference:** Automatically flags missing records, dangling reporting lines, and unresolved historical gaps with visual confidence indicators.
  * **Promotion Velocity & Retention Analytics:** Surfaces career stagnation alerts, manager turnover impact, and structural bottleneck insights.

---

### 5. Summary Verdict
Lab 2 is deeply people-centric and visually impactful. The winners will be determined by graph modeling elegance, data gap resilience, and extraordinary frontend UX polish (e.g., interactive temporal scrubbing).