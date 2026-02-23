# INTEGRATED DROUGHT WARNING & SMART TANKER MANAGEMENT SYSTEM
## Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** February 2026  
**Prepared by:** Water Governance & Digital Solutions Team  
**Target Users:** District Water Authority, State Water Department, Village Authorities  
**Geographic Scope:** Pilot District (Maharashtra - e.g., Jiwati Block); Scalable to Multi-District  

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Vision
Transform water governance from crisis-reactive tanker management to data-driven, predictive water resource planning. Enable district authorities to anticipate drought stress 1-6 months in advance, pre-position water supplies, and optimize tanker allocation based on village-level vulnerability—reducing emergency response costs and improving rural water security.

### 1.2 Problem Statement
**Current State (Before):**
- Water crises are managed reactively when villages run dry, causing humanitarian pressure and ad-hoc tanker deployment.
- Tanker allocation is manual, based on complaints rather than data, leading to inequitable distribution and high operational costs.
- No early warning system for emerging water stress; decisions lack scientific basis.
- Duplicate tanker trips waste fuel (~₹2-5L annually per district) and increase delays.

**Target State (After):**
- Drought stress is predicted 1-6 months ahead using rainfall and groundwater trends.
- Village-level Water Stress Index guides fair, priority-based tanker allocation.
- Route optimization reduces trips and costs by 20-30%.
- SMS alerts warn populations early for conservation action.

### 1.3 Key Success Metrics
| Metric | Target | Timeline |
|--------|--------|----------|
| Prediction Lead Time | 1-6 months ahead | Month 6 |
| Tanker Allocation Efficiency | +20-30% trip reduction | Month 8 |
| Alert Coverage | 95% of vulnerable villages | Month 4 |
| False Alarm Rate | <15% | Month 12 |
| User Adoption (Authorities) | >80% active use | Month 10 |
| Cost Savings (Annual) | ₹1.5-2.5L per district | Year 1 |

---

## 2. PRODUCT OVERVIEW

### 2.1 Product Name & Tagline
**Jal Suraksha**: *Predict. Allocate. Deliver. Secure Water for All.*

### 2.2 Product Scope

#### In Scope:
- Rainfall anomaly detection and groundwater trend analysis (village-level).
- Predictive Water Stress Index (VWSI) generation with 1-6 month forecasts.
- Tanker demand forecasting based on population and severity.
- Priority-based tanker allocation algorithm.
- Route optimization for tanker dispatch.
- Real-time monitoring dashboard for authorities.
- SMS alert system for drought early warning.
- Mobile app for tanker drivers (delivery status, GPS tracking).
- Integration with CGWB, IMD, Census, and Jal Jeevan Mission data.

#### Out of Scope (Future Phases):
- Groundwater recharge interventions (planning tools).
- Water pricing or subsidy management.
- Village-level water treatment or quality monitoring.
- Integration with national disaster alert systems (NDMA SACHET) - Phase 2.
- Multi-district federative deployment beyond pilot.
- Renewable energy cost optimization for water extraction.

### 2.3 Product Positioning
**Tier:** Enterprise SaaS for government district/state water authorities.  
**Comparative:** Similar to India Meteorological Department (IMD) drought alerts but automated, village-granular, and action-integrated (tanker dispatch).  
**Differentiator:** Combines prediction + optimization + execution; reduces manual overhead by 60%.

---

## 3. USER PERSONAS & USE CASES

### 3.1 Primary Users

#### Persona 1: District Water Officer (DWO)
- **Role:** Oversees district water supply, emergency tanker allocation.
- **Goals:** 
  - Early warning of water stress to plan preventive measures.
  - Equitable tanker allocation based on severity.
  - Real-time visibility into tanker fleet operations.
- **Pain Points:** Manual consolidation of rainfall/groundwater data; reactive decisions; tanker overuse.
- **Frequency:** Daily dashboard check, weekly alert reviews.

#### Persona 2: Block Water Authority Manager
- **Role:** Manages village-level water delivery within block.
- **Goals:**
  - Receive prioritized village lists for tanker dispatch.
  - Optimize routes to reduce trip count and fuel cost.
  - Acknowledge alerts and update status.
- **Pain Points:** No scientific prioritization; route wastage; no feedback loop.
- **Frequency:** Daily tanker scheduling, real-time GPS tracking.

#### Persona 3: Tanker Driver
- **Role:** Executes water delivery.
- **Goals:**
  - Know assigned routes, delivery locations, capacity.
  - Confirm delivery completion.
  - Reduce idle/waiting time.
- **Pain Points:** Manual route instructions; confusion on priorities; fuel inefficiency.
- **Frequency:** Daily app check before/after shift.

#### Persona 4: Village Gram Panchayat Leader
- **Role:** Alerts community, manages local water needs.
- **Goals:**
  - Know when tanker arrives and water conservation actions.
  - Report local water status to block authority.
- **Pain Points:** Late/no warning; unclear priorities; no feedback channel.
- **Frequency:** SMS alerts + weekly calls to block authority.

#### Persona 5: State Water Department Policy Maker
- **Role:** Oversees multiple districts, funding, policy.
- **Goals:**
  - Strategic view of drought risk across state.
  - Evidence-based investment in water infrastructure.
  - Benchmarking district performance.
- **Pain Points:** Siloed data; delayed crisis reports; no predictive input.
- **Frequency:** Monthly/quarterly reports.

### 3.2 Key Use Cases

**UC-1: Drought Stress Prediction**
- **Actor:** System (automated daily run).
- **Trigger:** 6 AM daily, or manual trigger by DWO.
- **Flow:** Fetch IMD rainfall + CGWB groundwater data → Calculate VWSI → Compare thresholds → Generate alert list.
- **Outcome:** Village-level VWSI scores, forecast for 1/3/6 months, alert-trigger villages identified.
- **Success Criteria:** Prediction <1 hour, 95% data completeness.

**UC-2: Tanker Demand Estimation**
- **Actor:** System (automated upon VWSI generation).
- **Trigger:** After VWSI calculation.
- **Flow:** For each VWSI>0.4 village: demand = population × VWSI × projected shortfall (days) → Aggregate district demand.
- **Outcome:** Ranked demand list by priority score; tanker requirement forecast.
- **Success Criteria:** Demand estimate ±10% of actual (calibrated quarterly).

**UC-3: Priority-Based Tanker Allocation**
- **Actor:** Block Manager, System.
- **Trigger:** Block Manager selects allocation period (e.g., next week).
- **Flow:** System lists villages by priority (VWSI × population) → Manager inputs available tanker capacity → System optimizes allocation (max coverage) → Manager reviews/approves → System generates dispatch plan.
- **Outcome:** Allocation plan with village list, tanker count, delivery timeline.
- **Success Criteria:** Allocation in <30 min; 90%+ villages prioritized by need.

**UC-4: Route Optimization**
- **Actor:** System, Block Manager.
- **Trigger:** Allocation plan finalized.
- **Flow:** System inputs prioritized villages, depot locations, tanker capacity, distance matrix (OSRM) → VRP solver (VROOM) → Optimal routes by fuel efficiency → System assigns tankers & drivers.
- **Outcome:** Optimized routes, driver assignments, ETA for each village.
- **Success Criteria:** 20-30% trip reduction vs. baseline; routes generated in <10 min.

**UC-5: Real-Time Monitoring & Alert Response**
- **Actor:** DWO, Block Manager, Drivers.
- **Trigger:** Continuous during dispatch window.
- **Flow:** GPS from tanker app → Dashboard shows live location, status (en-route/delivered) → DWO sees coverage % → Block Manager updates delays → SMS sent to Gram Panchayat on ETA.
- **Outcome:** Live fleet view, status updates, delivery confirmation.
- **Success Criteria:** GPS accuracy ±50m; status updates <2 min latency.

**UC-6: SMS Alert to Villagers**
- **Actor:** System (automated).
- **Trigger:** VWSI>0.4 for village, or tanker dispatch confirmed.
- **Flow:** System generates message (e.g., "Drought alert: Conserve water. Tanker arriving [date] at [time]. Call [block_contact]") → Bulk SMS gateway (MSG91/BulkSMSGateway) → Delivered to village contacts (Gram Panchayat, water committee).
- **Outcome:** SMS delivered to 95%+ population within 1 hour of alert.
- **Success Criteria:** <3% SMS delivery failure; message clarity (pre-tested locally).

**UC-7: Feedback & Calibration**
- **Actor:** Block Manager, DWO.
- **Trigger:** Monthly (after allocation/delivery cycle).
- **Flow:** Block Manager inputs actual vs. predicted tanker usage, population feedback → System recalibrates VWSI weights, demand model → Metrics dashboard updated.
- **Outcome:** Improved prediction accuracy; refined allocation algorithm.
- **Success Criteria:** Feedback loop closes within 30 days; RMSE of demand model <10%.

---

## 4. FUNCTIONAL REQUIREMENTS

### 4.1 Data Ingestion & Integration

#### FR-4.1.1: IMD Rainfall Data Ingestion
- **Description:** Daily fetch of district/village-level actual rainfall and normal (historical average) from IMD APIs.
- **Data Source:** India Meteorological Department (irapindia.org, mausam.imd.gov.in API).
- **Update Frequency:** Daily at 6 PM IST (post-observation cutoff).
- **Fields Required:** District code, village code, date, actual_rainfall_mm, normal_rainfall_mm, SPI (Standardized Precipitation Index).
- **Error Handling:** If API fails, use cached IMD data (max 3 days old); alert DWO.
- **Acceptance Criteria:**
  - 99% uptime for data fetch.
  - Data lag <24 hours.
  - Missing values imputed via district average (log).

#### FR-4.1.2: CGWB Groundwater Data Ingestion
- **Description:** Weekly fetch of groundwater levels (depth below surface, water table trends) from Central Ground Water Board.
- **Data Source:** CGWB IN-GRES (Integrated Groundwater Resource Estimation System), WRIS (Water Resources Information System).
- **Update Frequency:** Weekly (typically Thursdays, as per CGWB monitoring).
- **Fields Required:** Well code, location (lat/long), groundwater_depth_m, trend (rising/stable/declining), classification (safe/semi-critical/critical/overexploited).
- **Spatial Resolution:** Village-level aggregation from available well monitoring points (inverse distance weighting).
- **Error Handling:** If <50% well data available for village, flag as "low confidence" in VWSI; alert DWO.
- **Acceptance Criteria:**
  - 95% village coverage by interpolation.
  - Trend accuracy validated vs. CGWB reports (quarterly).

#### FR-4.1.3: Census & Demographic Data Ingestion
- **Description:** One-time ingestion of village population, caste composition, literacy rate from Census 2021.
- **Data Source:** Census of India portal (censusindia.gov.in), Jal Jeevan Mission database.
- **Frequency:** One-time at project start; annual refresh.
- **Fields Required:** Village code, village_name, population, population_per_household, vulnerable_groups (SC/ST %), rural_urban_status.
- **Acceptance Criteria:**
  - 100% village coverage for pilot district.
  - Data validated against state water department records.

#### FR-4.1.4: Water Source & Supply Data
- **Description:** Ingestion of village water sources (wells, bore wells, surface water), availability, and current supply status from Jal Jeevan Mission.
- **Data Source:** Jal Jeevan Mission portal (jaljeevanmission.gov.in), state water department.
- **Frequency:** Monthly refresh.
- **Fields Required:** Village code, source_type, capacity_liters_per_day, current_availability_status (functional/non-functional), supply_hours_per_day, treatment_facility (yes/no).
- **Acceptance Criteria:**
  - 90% village coverage.
  - Cross-validation with state records.

#### FR-4.1.5: Historical Weather & Hydrological Data
- **Description:** Ingestion of 10-year historical rainfall, temperature, groundwater levels for model training.
- **Data Source:** IMD archives, CGWB historical reports, state water department records.
- **Frequency:** One-time (initial training); quarterly appends for ongoing learning.
- **Acceptance Criteria:**
  - Complete daily rainfall series for 10 years (80% minimum threshold).
  - Groundwater data with 50%+ monthly coverage.

#### FR-4.1.6: Data Quality Monitoring
- **Description:** Automated flagging of data anomalies (e.g., impossible values, sudden jumps, missing sequences).
- **Mechanism:** 
  - Validate rainfall: 0-300mm range; flag if >3σ deviation from district mean.
  - Validate groundwater: depth 0-400m; flag if >2m change in 1 week.
  - Validate population: cross-check against Census ±5%.
- **Action:** Log anomaly with severity level; trigger alert to DWO if critical.
- **Acceptance Criteria:**
  - 100% of flagged anomalies logged.
  - False positive rate <5%.

---

### 4.2 Drought Prediction & Water Stress Index Generation

#### FR-4.2.1: Rainfall Deviation Calculation
- **Description:** Compute standardized rainfall deviation for each village.
- **Formula:** 
  ```
  Rainfall_Deviation = (Actual_Rainfall - Normal_Rainfall) / Normal_Rainfall
  Standardized = Rainfall_Deviation / std_dev(historical_deviations)
  ```
- **Temporal Window:** 4-week rolling average to smooth noise.
- **Update Frequency:** Daily after IMD data ingestion.
- **Output:** Deviation score (-3 to +3 scale, standardized).
- **Acceptance Criteria:**
  - Calculation <1 minute for 1000 villages.
  - Deviation scores validated against IMD SPI (correlation >0.9).

#### FR-4.2.2: Groundwater Decline Rate
- **Description:** Estimate groundwater depletion rate from weekly trend data.
- **Formula:**
  ```
  Decline_Rate = (Depth_Week_N - Depth_Week_N-4) / 4 weeks
  Critical_Threshold = 0.5m/month decline
  ```
- **Temporal Window:** 8-week moving average for trend stability.
- **Update Frequency:** Weekly after CGWB data ingestion.
- **Output:** Decline rate (m/month), classification (stable/slow/rapid decline).
- **Acceptance Criteria:**
  - Trend estimate within ±0.1m/month of ground truth (validated by CGWB).
  - Detection of critical decline within 2 weeks of onset.

#### FR-4.2.3: Water Withdrawal vs. Runoff Ratio
- **Description:** Estimate sustainable extraction as ratio of withdrawal to local runoff.
- **Formula:**
  ```
  Withdrawal_Ratio = (Population × Daily_Per_Capita_Demand) / (Runoff + Recharge)
  Runoff ≈ Rainfall × Runoff_Coefficient (0.3 for semi-arid)
  Recharge ≈ Rainfall × Recharge_Coefficient (0.15 for village soil)
  ```
- **Data Source:** Census population, rainfall (FR-4.1.1), soil database (state records).
- **Update Frequency:** Quarterly.
- **Output:** Sustainability ratio (0-2 scale; >1 = unsustainable).
- **Acceptance Criteria:**
  - Ratio validated against state sustainability assessments.

#### FR-4.2.4: Village-Level Water Stress Index (VWSI) Generation
- **Description:** Composite index combining rainfall, groundwater, and withdrawal factors.
- **Formula:**
  ```
  VWSI = 0.4 × (Rainfall_Deviation_Normalized) 
        + 0.4 × (Groundwater_Decline_Normalized) 
        + 0.2 × (Withdrawal_Ratio_Normalized)
  
  Normalized_Component = (Component_Value - Min) / (Max - Min)
  VWSI_Final = Clamp(VWSI, 0, 1)
  ```
- **Thresholds:**
  - Green (Low Stress): VWSI < 0.2
  - Yellow (Moderate Stress): 0.2 ≤ VWSI ≤ 0.4
  - Orange (High Stress): 0.4 < VWSI ≤ 0.6
  - Red (Severe Stress): VWSI > 0.6
- **Update Frequency:** Daily.
- **Output:** VWSI score, stress level (color), contributing factors breakdown.
- **Acceptance Criteria:**
  - VWSI computed for 100% of villages daily.
  - Calculation <1 minute for 1000 villages.
  - Index validated against historical drought declarations (confusion matrix: precision >85%, recall >90%).

#### FR-4.2.5: Predictive VWSI Forecasting (1, 3, 6-month)
- **Description:** Generate future VWSI projections using ML models trained on historical data.
- **Model Architecture:**
  - **Short-term (1-month):** LSTM (Long Short-Term Memory) neural network on 24-month rolling rainfall/groundwater history.
  - **Medium-term (3-month):** CANFIS (Coactive Neuro-Fuzzy Inference System) integrating seasonal patterns + climate indices (e.g., Southwest Monsoon forecast).
  - **Long-term (6-month):** Ensemble (LSTM + Seasonal Decomposition + Expert Rules) with seasonal monsoon anomaly.
- **Training Data:** 10-year historical rainfall, groundwater, drought declarations (from state records).
- **Model Validation:**
  - 80/20 train-test split; cross-validation (5-fold).
  - Metrics: RMSE, MAE, AUC-ROC (for alert threshold).
  - Acceptable RMSE: <0.15 for VWSI (0-1 scale).
- **Update Frequency:** Weekly for 3/6-month forecasts; daily for 1-month.
- **Output:** Probability distribution of VWSI at T+1month, T+3month, T+6month; confidence intervals (90%).
- **Uncertainty Handling:** Flag forecast if model confidence <70%; defer to expert review.
- **Acceptance Criteria:**
  - Forecast RMSE <0.15 (validated on holdout test set).
  - False alarm rate (predicting drought that doesn't occur) <15%.
  - Detection rate (predicting drought that occurs) >90%.

#### FR-4.2.6: Drought Alert Threshold Configuration
- **Description:** Configurable thresholds for triggering alerts; default = VWSI >0.4.
- **Flexibility:** DWO can adjust thresholds by district, season (monsoon/non-monsoon).
- **Alert Triggers:**
  - **Immediate Alert:** VWSI crosses 0.4 within 7 days (forecast).
  - **Planning Alert:** VWSI forecast >0.4 for 1/3/6 months.
  - **Escalation Alert:** VWSI >0.6 + 2+ consecutive weeks.
- **Alert History:** Log all alerts with VWSI values, triggered actions (tanker dispatch, SMS).
- **Acceptance Criteria:**
  - Threshold configuration UI operational in <5 minutes.
  - Historical alert audit trail 100% complete.

---

### 4.3 Tanker Demand Forecasting

#### FR-4.3.1: Tanker Demand Calculation
- **Description:** Estimate water volume tankers must deliver to each village based on stress and population.
- **Formula:**
  ```
  Daily_Demand = Population × Per_Capita_Demand_Liters
  Shortfall = max(0, Daily_Demand - Local_Supply)
  Days_to_Critical = 3 (assumption: village can sustain 3 days on stored water)
  Tanker_Volume_Needed = Shortfall × Days_to_Critical / 1000 (convert to thousand liters)
  ```
- **Inputs:**
  - Population (FR-4.1.3): Census data.
  - Per_Capita_Demand: Configurable; default = 45 liters/person/day (drinking + cooking + hygiene, per MOHUA guidelines).
  - Local_Supply: From FR-4.1.4 (village water source capacity).
  - VWSI: From FR-4.2.4; acts as severity multiplier.
- **Priority Score:**
  ```
  Priority_Score = Population × VWSI × (1 + Vulnerability_Index)
  Vulnerability_Index = 0.1 if SC/ST % > 40%, else 0
  ```
- **Aggregation:** Sum demand across all VWSI>0.4 villages for district total.
- **Update Frequency:** Daily after VWSI generation.
- **Output:** 
  - Per-village: tanker_liters_needed, priority_rank (1-N), estimated_delivery_days.
  - District: total_demand_liters, count_of_critical_villages.
- **Acceptance Criteria:**
  - Demand calculation <1 minute for 1000 villages.
  - Demand estimates ±10% of actual usage (calibrated quarterly against tanker dispatch logs).

#### FR-4.3.2: Multi-Week Demand Projection
- **Description:** Rolling 8-week demand forecast to plan tanker fleet sizing.
- **Methodology:** Combine 1/3-month VWSI forecasts (FR-4.2.5) with demand model to project weekly tanker requirement.
- **Output:** Week-by-week demand curve; peak demand estimation.
- **Use Case:** Allows DWO to pre-position tankers, alert state for emergency funding.
- **Acceptance Criteria:**
  - Projection prepared weekly; communicated to DWO by Monday 9 AM.

---

### 4.4 Tanker Allocation & Priority Ranking

#### FR-4.4.1: Fair Allocation Algorithm
- **Description:** Distribute available tanker capacity among villages based on need, not ad-hoc requests.
- **Algorithm:**
  ```
  Input: 
    - List of villages with VWSI>0.4 (from FR-4.3.1)
    - Available tanker capacity (liters) this week
    - Max tanker trips available
  
  Process:
    1. Rank villages by Priority_Score (descending)
    2. Allocate tankers greedily by rank until capacity exhausted
    3. For partial allocation: allocate min(3-day demand, remaining capacity)
    4. Track allocation_efficiency = allocated_volume / total_demand
  
  Output: 
    - Allocation list: village, tanker_count, priority_rank, coverage_%
    - Unmet demand list (for escalation to state)
  ```
- **Constraints:**
  - Max tankers per village per week: 3 (prevents over-allocation).
  - Min coverage: 70% of demand for villages with VWSI>0.5 (mandatory).
- **Adjustment Mechanism:** DWO can manually override priority (e.g., for equity, local politics) with audit log.
- **Acceptance Criteria:**
  - Allocation algorithm completes <5 minutes.
  - Coverage ≥70% for high-stress villages (VWSI>0.5).
  - Audit log 100% complete for manual overrides.

#### FR-4.4.2: Equitable Distribution Rules
- **Description:** Enforce equity across demographic groups, prevent repeated neglect of specific villages.
- **Rules:**
  - SC/ST-majority villages (>40% population) get +10% allocation priority boost.
  - Villages not receiving tanker for 4+ weeks get priority escalation.
  - Geographic diversity: if 2 adjacent villages competing, allocate both if possible (to reduce tanker transit time).
- **Audit Trail:** Log all allocations with reasoning (priority score, equity rule applied).
- **Acceptance Criteria:**
  - Equity rules enforced in 100% of allocations.
  - Audit trail queryable by DWO (e.g., "show all villages with <3 weeks service").

#### FR-4.4.3: Allocation Approval Workflow
- **Description:** Multi-step approval to ensure transparency and accountability.
- **Workflow:**
  ```
  Step 1: System generates weekly allocation plan (FR-4.4.1)
  Step 2: Block Manager reviews on dashboard, sees villages, demand, priority ranking
  Step 3: Manager approves or adjusts (can increase/decrease tankers per village within total capacity)
  Step 4: Manager confirms final allocation → System locks plan
  Step 5: Route optimization triggered (FR-4.5)
  ```
- **Deadline:** Plan must be approved by Sunday 6 PM for Monday-Sunday execution.
- **Alerts:** If not approved by deadline, system auto-approves default allocation.
- **Acceptance Criteria:**
  - Workflow operational; audit trail of approvals 100% captured.

---

### 4.5 Route Optimization & Dispatch Planning

#### FR-4.5.1: Vehicle Routing Problem (VRP) Setup
- **Description:** Formulate optimized routes for tanker dispatch to minimize trips, distance, and fuel.
- **Inputs:**
  - Allocation list (villages, tanker counts) from FR-4.4.
  - Depot location(s) (district water supply office/tank farm).
  - Tanker fleet: count, capacity (10,000 or 15,000 liters typical), fuel efficiency.
  - Road network: distance matrix from OSRM (Open Source Routing Machine).
  - Village coordinates: GPS (lat/long).
- **Constraints:**
  - Tanker capacity: cannot exceed tank volume.
  - Time windows: villages prefer delivery in 7am-5pm window (adjustable).
  - Max route duration: 8 hours/tanker/day (includes loading, delivery, return).
  - Mandatory breaks: 30 min after 4 hours drive (labor rules).
- **Objective Function:**
  ```
  Minimize: Total_Distance + Fuel_Cost + Delivery_Time_Penalty
  
  Where:
    Total_Distance = sum of all route segments (km)
    Fuel_Cost = Total_Distance × ₹8/km (configurable)
    Delivery_Time_Penalty = sum of (Delivery_Hour - Preferred_Hour)^2 
                            (to cluster deliveries in preferred times)
  ```
- **Solver:** VROOM (Vehicle Routing Open-source Optimization Machine) or Google OR-Tools.
- **Acceptance Criteria:**
  - Route optimization completes <10 minutes for 100 villages, 20 tankers.
  - Solution quality: 20-30% trip reduction vs. baseline (no optimization).

#### FR-4.5.2: Route Generation & Assignment
- **Description:** Create optimized routes, assign tankers/drivers, generate dispatch instructions.
- **Process:**
  1. VRP solver generates N optimized routes (one per tanker).
  2. Each route: depot → village_1 → village_2 → ... → depot (sequence).
  3. Assign driver + tanker to each route.
  4. Generate dispatch card: route, villages, delivery volumes, ETA, contact info.
- **Output:**
  - Dispatch Plan: PDF/interactive list of routes.
  - Driver App Assignment: Each driver sees their route on mobile.
  - Fleet Dashboard: Live view of all tanker locations (GPS).
- **Acceptance Criteria:**
  - All allocated villages covered in optimized routes.
  - Dispatch plan generated and assigned <15 minutes after approval (FR-4.4.3).
  - No route exceeds 8-hour duration.

#### FR-4.5.3: Multi-Day Dispatch Planning
- **Description:** For weekly allocation, plan tanker dispatch across 6-7 days to spread demand and allow fleet reuse.
- **Algorithm:**
  - Day 1-2: High-priority villages (VWSI>0.5).
  - Day 3-5: Moderate priority (0.4<VWSI≤0.5).
  - Day 6-7: Reserve for urgent updates or backfill of unmet demand.
- **Tanker Reuse:** Each tanker can make 1-2 trips/day (depending on routes).
- **Output:** 7-day dispatch calendar with daily delivery targets.
- **Flexibility:** If new urgent village emerges mid-week (VWSI jumps to 0.6), can insert into next available route slot.
- **Acceptance Criteria:**
  - Multi-day plan prevents fleet idle time.
  - Urgent insertions accommodated within 24 hours.

#### FR-4.5.4: Dynamic Route Adjustment
- **Description:** Real-time re-optimization if route conditions change (e.g., tanker breakdown, new urgent village).
- **Trigger:** Driver reports breakdown, OR new VWSI>0.6 alert arrives mid-route.
- **Process:**
  - System removes broken tanker's villages from remaining route.
  - Re-optimizes remaining tankers' routes to cover those villages.
  - Notifies affected drivers of new route.
- **SLA:** Route adjustment <10 minutes; drivers notified <2 minutes.
- **Acceptance Criteria:**
  - Adjustment tested with mock breakdowns.

---

### 4.6 Real-Time Monitoring & Tracking

#### FR-4.6.1: GPS Tracking Integration (Driver App)
- **Description:** Mobile app for tanker drivers to receive routes and send real-time GPS location.
- **Features:**
  - Route map display (turn-by-turn navigation).
  - Arrival confirmation at village (check-in button).
  - Delivery volume input (actual liters delivered).
  - Photo proof of delivery (optional, configurable).
  - Status: En-route, Arrived, Delivering, Completed, Return to Depot.
- **Platform:** Hybrid app (React Native or Flutter) for iOS + Android.
- **GPS Update Frequency:** Every 30 seconds (when vehicle moving); every 5 minutes (stationary).
- **Offline Capability:** App caches route and last known location; syncs when connectivity restored.
- **Battery Optimization:** GPS updates pause if device stationary for >2 minutes.
- **Acceptance Criteria:**
  - GPS accuracy ±50m; uptime 98% during delivery window.
  - Offline syncing tested; no data loss.
  - Battery drain <5% per hour.

#### FR-4.6.2: Live Fleet Dashboard
- **Description:** Real-time operational dashboard for DWO, Block Manager to monitor all active tankers.
- **Display Elements:**
  - **Map View:** Live tanker icons on district map; color-coded by status (green=delivering, orange=en-route, red=issue).
  - **Fleet Status Panel:** 
    - Total tankers active: X/Y
    - Villages covered today: A/B (%)
    - Delivery volume to date: Z liters
    - Average delivery time: M minutes
  - **Alert Indicators:**
    - Tanker breakdown (red flag).
    - Route delay >30 min (orange).
    - Missed check-in (yellow).
  - **Village-Level View:** Click village → see scheduled tanker(s), ETA, delivery status.
- **Refresh Rate:** Live updates every 30 seconds.
- **Drill-Down:** Manager can click tanker → see driver name, route, delivery history for day.
- **Acceptance Criteria:**
  - Dashboard loads <3 seconds.
  - Live update latency <2 minutes.
  - 95%+ tanker coverage (GPS signal quality).

#### FR-4.6.3: Delivery Confirmation & Audit
- **Description:** Log all delivery events with driver confirmation, photos, recipient details.
- **Data Captured:**
  - Village, date, time, tanker ID, driver name.
  - Actual volume delivered (liters), receipt signed/photographed.
  - GPS location at delivery (to verify correct village).
  - Any issues (e.g., access denied, village unavailable, equipment failure).
- **Audit Trail:** All delivery records immutable; searchable by village, date, driver.
- **Discrepancy Handling:** If actual volume <planned volume by >10%, flag for manager review.
- **Acceptance Criteria:**
  - 100% of deliveries logged within 1 hour of completion.
  - Photo upload optional; if chosen, image compressed to <1MB.

#### FR-4.6.4: Performance Metrics & SLA Monitoring
- **Description:** Real-time dashboards tracking operational KPIs.
- **Metrics Tracked:**
  - **Efficiency:** Trips completed / total tankers / day.
  - **Coverage:** Villages served / villages planned (%).
  - **Timeliness:** Avg delivery time - Planned ETA (target: ±30 min).
  - **Cost:** Total fuel cost vs. budget for week.
  - **Downtime:** Tanker breakdowns / tanker-days (target: <5%).
- **Alerts:** If metric falls below SLA, notify manager.
- **Weekly Report:** Auto-generated for DWO, state water department.
- **Acceptance Criteria:**
  - Metrics calculated daily; reports auto-sent every Monday 8 AM.

---

### 4.7 SMS Alert System

#### FR-4.7.1: Alert Trigger Configuration
- **Description:** Define when SMS alerts are sent to villages.
- **Triggers:**
  - **Threshold Breach:** VWSI ≥ 0.4 (drought alert).
  - **Escalation Alert:** VWSI ≥ 0.6 (severe drought; conservation measures).
  - **Tanker Confirmation:** Tanker dispatch confirmed for village; ETA calculated.
  - **Water Advisory:** (Future) Weekly conservation tips if stress detected.
- **Frequency Cap:** Max 2 SMS per village per week (avoid fatigue).
- **Opt-Out:** Gram Panchayat can disable alerts (with audit log).
- **Acceptance Criteria:**
  - Alert configuration UI operational; DWO can set thresholds.
  - Frequency cap enforced; audit log complete.

#### FR-4.7.2: Message Template & Personalization
- **Description:** Pre-tested, culturally-sensitive SMS templates.
- **Templates:**
  - **Drought Alert:** "⚠️ Jal Suraksha: Drought warning for [Village]. Water stress high. Conserve water—use 30L/person/day. Tanker arriving [Date] at [Time]. Contact: [Block_Phone]."
  - **Tanker Confirmation:** "✅ Water tanker arriving at [Village] on [Date] at [Time]. Please arrange collection point. [Block_Contact]."
  - **Conservation Tip:** "💧 Jal Suraksha Tip: Reuse greywater for plants. Every liter saved helps! [Block_Phone]."
- **Localization:** Templates translated to regional languages (Marathi, Hindi, etc.); tested with focus groups.
- **Recipient Customization:**
  - Primary: Gram Panchayat President, Water Committee Leader.
  - Secondary: Village Health Worker, ASHA worker (for community dissemination).
- **Acceptance Criteria:**
  - Templates reviewed by state water department + Gram Panchayat representatives.
  - Clarity score >80% in focus group testing.

#### FR-4.7.3: SMS Gateway Integration
- **Description:** Integration with bulk SMS provider for large-scale message delivery.
- **Provider Options:**
  - MSG91 (Indian CGSM vendor, supports Hindi/regional languages).
  - BulkSMSGateway.
  - NTSMS (National Telecom SMS Service, if government preferred).
- **Integration:**
  - API call to send SMS batch: Phone numbers (array), Message, Sender ID, Schedule time.
  - Response: Message ID (for tracking), Delivery status (sent/queued/failed).
  - Retry Logic: If failed, retry up to 3 times within 1 hour.
- **Rate Limiting:** Max 1000 SMS/minute (provider SLA).
- **Cost:** ₹0.5-1 per SMS (configurable contract).
- **Acceptance Criteria:**
  - SMS delivery rate >95% within 3 minutes.
  - Cost tracking integrated into system dashboard.
  - Provider SLA monitored; failures escalated to DWO.

#### FR-4.7.4: SMS Delivery Audit & Analytics
- **Description:** Log all SMS sent, delivered, failed; analytics on reach.
- **Data Logged:**
  - Recipient phone number (hashed for privacy).
  - Message template used, send time, delivery status, delivery time.
  - Cost per SMS, cumulative cost.
- **Analytics:**
  - % SMSs delivered (target: >95%).
  - Avg delivery time (target: <3 min).
  - Cost per village alerted (tracking spend).
  - Response rate (if SMS includes click-through or reply option, future).
- **Searchable Report:** DWO can query "all SMSs sent to Village X in Feb" → see delivery status.
- **Privacy:** Phone numbers not visible in UI; only recipient group name (e.g., "Gram Panchayat Leaders").
- **Acceptance Criteria:**
  - 100% of SMS logged; searchable reports generated <1 minute.
  - Delivery audit validated against provider reports (monthly reconciliation).

---

### 4.8 Dashboard & Visualization

#### FR-4.8.1: Authority Dashboard (District Water Officer)
- **Description:** Comprehensive single-screen overview for DWO to manage drought response and tanker operations.
- **Layout:**
  - **Top Row (KPIs):**
    - Current district VWSI (with color: green/yellow/orange/red).
    - Villages under stress (count + %), trend (↑/↓/→).
    - Tankers active today (X/Y available).
    - Delivery volume to date (Z liters, % of target).
  - **Map Panel (50% of screen):**
    - District boundary.
    - Villages color-coded by VWSI (green/yellow/orange/red).
    - Live tanker icons + routes.
    - Depot locations.
    - Click village → pop-up: name, population, VWSI, allocated tanker(s), ETA.
  - **Alerts Panel (right sidebar):**
    - Critical alerts (VWSI jumped to 0.6+, tanker breakdown, SMS delivery failure).
    - Alert time, action buttons (Acknowledge, Escalate to State).
  - **Forecast Panel (bottom):**
    - VWSI forecast chart (next 6 weeks), with 90% confidence band.
    - Demand projection chart (tankers needed/week).
  - **Quick Actions (buttons):**
    - "Approve Weekly Allocation," "View Delivery Report," "Download Dispatch Plan," "Send SMS to Gram Panchayats."
- **Refresh:** Auto-refresh every 30 seconds; manual refresh button.
- **Filters:** By sub-district, VWSI threshold, tanker status.
- **Export:** Download dashboard as PDF/Excel (weekly snapshot).
- **Acceptance Criteria:**
  - Dashboard loads <3 seconds.
  - All elements update live; no stale data.
  - Mobile-responsive (tablet view tested).

#### FR-4.8.2: Block Manager Dashboard
- **Description:** Operational dashboard for Block Manager to execute daily tanker dispatch.
- **Layout:**
  - **Top Row (Today's Status):**
    - Villages to service today (count, priority ranking).
    - Tankers assigned today (count, total capacity, utilization %).
    - Deliveries completed (X/Y), target completion time.
  - **Village Queue (main panel):**
    - Table: Village name, population, VWSI, demand, assigned tanker #, ETA, status (pending/in-route/delivered).
    - Sort by: priority, status, or ETA.
    - Click row → see tanker GPS location live on small map.
  - **Tanker Status (right panel):**
    - List of all tankers: status (idle/loading/en-route/delivering), current location, ETA to next village, fuel level.
  - **Action Buttons:**
    - "Approve Dispatch Plan," "Re-optimize Routes," "Update Delivery Status," "Report Tanker Issue," "Send SMS to Gram Panchayat" (for specific village).
- **Real-Time Updates:** Dashboard updates every 30 seconds as tankers move.
- **Mobile App:** Manager can view dashboard on mobile (simplified version) while in field.
- **Acceptance Criteria:**
  - Dashboard loads <2 seconds; responsive design for tablet.
  - Real-time updates validated with GPS mock data.

#### FR-4.8.3: State/Regional Dashboard
- **Description:** High-level dashboard for state water department to monitor multi-district drought risk.
- **Layout:**
  - **State Map:** Districts color-coded by average VWSI (green/yellow/orange/red).
  - **District Cards:** For each district: VWSI trend, villages under stress, tanker allocation status, % coverage.
  - **Comparative Metrics:** District benchmarking (e.g., highest VWSI, lowest coverage, highest cost/tanker).
  - **Forecast Summary:** State-wide 6-month VWSI outlook; resource requirement projection.
  - **Alerts:** Districts needing state intervention (e.g., running out of tankers, demand >50% capacity).
- **Drill-Down:** Click district → see DWO dashboard.
- **Reports:** Monthly state-level drought risk report; auto-generated.
- **Acceptance Criteria:**
  - Multi-district data aggregation <2 minutes.
  - Comparative charts generated <10 seconds.

#### FR-4.8.4: Gram Panchayat/Village View (Mobile/SMS-Friendly)
- **Description:** Simple view for Gram Panchayat leaders to see village status and tanker ETA.
- **Access:** Web link (SMS-sent) or mobile app.
- **Content:**
  - Village name, population.
  - Current VWSI + interpretation ("Water Stress: Medium - Conserve Water").
  - Allocated tanker(s) for this week: tanker ID, driver name, ETA.
  - Water conservation tips (rotated weekly).
  - Contact info for block water authority.
- **SMS-Friendly:** Optimized for low-bandwidth areas; no heavy graphics.
- **Acceptance Criteria:**
  - Page loads <5 seconds on 2G/3G network.
  - All critical info visible in first screen.

---

### 4.9 System Administration & Configuration

#### FR-4.9.1: User Management
- **Description:** Role-based access control (RBAC) for different user types.
- **Roles:**
  - **Admin:** Can configure thresholds, SMS templates, allocations, view all data. Access: All modules.
  - **District Water Officer:** Can view dashboards, approve allocations, send alerts. Access: District-level only.
  - **Block Manager:** Can view/manage tanker dispatch, update delivery status. Access: Block-level only.
  - **Viewer (State):** Can view state dashboards, reports; no edit access. Access: Read-only, all districts.
  - **Gram Panchayat Representative:** Can view village status, receive alerts. Access: Village-level only.
- **Authentication:** Single Sign-On (SSO) with state/district user directory (LDAP or cloud AD).
- **MFA (Multi-Factor Authentication):** Optional; SMS OTP for critical actions (e.g., SMS campaign approval).
- **Audit Log:** All logins, data access, edits logged with timestamp + user ID.
- **Acceptance Criteria:**
  - RBAC enforced; unauthorized access blocked.
  - Audit log 100% complete; queryable by date/user/action.

#### FR-4.9.2: Configuration Management
- **Description:** Allow admins to customize system parameters without code changes.
- **Configurable Parameters:**
  - **VWSI Thresholds:** Green/yellow/orange/red boundaries (default: 0.2/0.4/0.6).
  - **Alert Triggers:** Which events trigger SMS, frequency caps.
  - **Tanker Specs:** Capacity, fuel efficiency, max route duration, preferred delivery window.
  - **Demand Model:** Per-capita water requirement (default 45L/person/day), vulnerable group boost (+10%).
  - **Allocation Rules:** Min coverage %, equity rules, max tankers/village.
  - **SMS Templates:** Text, recipient groups, schedule.
  - **Depot Info:** Location, contact, operating hours.
- **UI:** Configuration forms grouped by module (drought prediction, allocation, dispatch, SMS).
- **Change Log:** Every config change logged with old/new values, changed-by, timestamp.
- **Acceptance Criteria:**
  - Config changes take effect within 1 hour (no code deployment).
  - Config UI tested; non-technical admin can configure.

#### FR-4.9.3: Data Backup & Disaster Recovery
- **Description:** Ensure system resilience and data protection.
- **Backup Strategy:**
  - **Database:** Daily full backup; weekly incremental. Retention: 90 days.
  - **File Storage:** Daily backup of dispatch plans, SMS logs, reports.
  - **Backup Location:** Geographically separate (e.g., secondary AWS region or on-premise backup).
- **Recovery Time Objective (RTO):** 4 hours (system restored within 4 hours of failure).
- **Recovery Point Objective (RPO):** 1 hour (max 1 hour of data loss acceptable).
- **Testing:** Quarterly DR drill (restore from backup, verify completeness).
- **Acceptance Criteria:**
  - Backup jobs complete 100%; verified monthly.
  - DR drill documented; RTO/RPO validated.

---

### 4.10 Integration & API

#### FR-4.10.1: External Data API Integrations
- **Description:** API calls to fetch data from external sources (IMD, CGWB, Census, Jal Jeevan Mission).
- **API Endpoints (to be confirmed with partners):**
  - **IMD Rainfall API:** GET /irapindia/rainfall?district={code}&date={YYYY-MM-DD}
  - **CGWB Groundwater API:** GET /cgwb/groundwater?district={code}&period={week}
  - **Census Data API:** Batch upload CSV or direct API (if available).
  - **Jal Jeevan Mission API:** GET /jjm/villages?district={code} → village data.
- **Error Handling:** If external API fails, use cached data (max age 3 days); alert admin.
- **Rate Limits:** Respect provider rate limits (e.g., IMD: 100 req/min); implement backoff.
- **Data Freshness SLA:** Rainfall within 24 hours; groundwater within 7 days.
- **Acceptance Criteria:**
  - All APIs integrated; error rates logged.
  - SLA compliance monitored; breaches escalated.

#### FR-4.10.2: System-to-System Integration (Future)
- **Description:** APIs to allow third-party systems (e.g., state treasury, disaster management) to consume Jal Suraksha data.
- **Endpoints (Examples):**
  - GET /api/districts/{id}/vwsi → Current VWSI for all villages.
  - GET /api/districts/{id}/forecast?months={1,3,6} → VWSI forecast.
  - GET /api/districts/{id}/allocation/weekly → Weekly tanker allocation plan.
  - POST /api/alerts/sms → External system can trigger custom SMS (with approval).
- **Authentication:** API key + OAuth 2.0.
- **Rate Limit:** 1000 req/hour per client.
- **Documentation:** OpenAPI/Swagger docs for developers.
- **Acceptance Criteria:** (Phase 2) APIs documented, tested with mock clients.

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### 5.1 Performance

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| API Response Time | <500ms (p95) | Ensures responsive UI, good UX. |
| Dashboard Load Time | <3 seconds | Critical for operational urgency. |
| VWSI Calculation | <1 min for 1000 villages | Daily batch run completes before 7 AM. |
| Route Optimization | <10 min for 100 villages | Dispatch plan ready by 8 AM. |
| SMS Delivery | >95% within 3 min | Timely alerts to villages. |
| Concurrent Users | 500 (district + state + block users) | Handle peak load during crisis. |
| Database Query Response | <2 seconds | Analytics queries for DWO. |

### 5.2 Scalability

- **Horizontal Scaling:** Stateless backend (FastAPI) allows load balancing across multiple servers.
- **Database Scaling:** PostgreSQL with read replicas for reporting; partitioning by district.
- **File Storage:** Cloud object storage (AWS S3) for dispatch plans, photos; auto-scaling.
- **Caching:** Redis for frequently accessed data (VWSI, village list); TTL 1 hour.
- **Growth Path:** Designed to scale from 1 pilot district (5,000 villages) to multi-state (50,000+ villages) by 2028.

### 5.3 Availability & Uptime

- **Target Uptime:** 99.5% (system available 23.5 hours/day on average; max 3.6 hours downtime/month).
- **Critical Operations:** Drought prediction, alert dispatch must be 99.9% available (max 1 hour downtime/month).
- **Maintenance Windows:** Monthly patching on 2nd Sunday, 2-4 AM IST (low-usage window).
- **Failover:** Active-passive database failover; DNS failover to secondary server <1 min.
- **Monitoring:** Uptime dashboard; automated alerts to admin if system unreachable.

### 5.4 Security

#### Data Protection
- **Encryption at Rest:** AES-256 for sensitive data (phone numbers, allocation plans) in database.
- **Encryption in Transit:** TLS 1.2+ for all API calls; certificate renewal automated.
- **Data Minimization:** Phone numbers hashed for privacy (SMS delivery partner handles unencrypted numbers on SLA basis).
- **PII Handling:** Gram Panchayat leader names/contacts not stored in system; only referenced by ID to SMS provider API.

#### Access Control
- **RBAC (Role-Based Access Control):** Every user assigned role (admin, DWO, block manager, viewer); system enforces permissions.
- **Principle of Least Privilege:** Users see only data relevant to their role/geography.
- **API Security:** All API calls require authentication (OAuth 2.0 or API key).
- **SQL Injection Prevention:** Parameterized queries throughout; code review for safety.

#### Audit & Compliance
- **Immutable Audit Log:** All critical actions (SMS sent, allocation changed, delivery logged) immutable; timestamped, user-attributed.
- **Right to Audit:** State water department can request audit trail for any action.
- **Compliance:** Aligns with India's Digital Personal Data Protection Bill (DPDP) draft; no data sold to third parties.

#### Incident Response
- **Security Incident SOP:** If breach detected (e.g., unauthorized data access), incident team notified within 1 hour; state authority informed within 24 hours.
- **Logging:** Centralized logs (ELK stack) for security monitoring; alerts on suspicious activity (e.g., repeated failed logins).

### 5.5 Reliability

- **Error Handling:** Graceful degradation. If CGWB data unavailable, system uses cached data; alerts admin.
- **Data Consistency:** Database constraints ensure allocation total never exceeds available capacity.
- **Validation:** Input validation on all forms (e.g., tanker capacity must be >0); error messages clear.
- **Retry Logic:** Failed API calls retried 3x with exponential backoff (1s, 2s, 4s).
- **Testing:** Regression tests on every deploy; integration tests for API calls; load testing quarterly.

### 5.6 Usability & Accessibility

#### Usability
- **Intuitive Navigation:** Dashboard accessible within 2 clicks from any page.
- **Responsive Design:** Optimized for desktop (DWO office), tablet (block manager in field), mobile (Gram Panchayat SMS-web).
- **Offline Mode:** Driver app caches route; works offline; syncs on reconnect.
- **Accessibility (WCAG 2.1 Level AA):**
  - Color-blind friendly: don't rely on red/green alone; use icons/text labels.
  - Font size: minimum 14px; resizable.
  - Contrast: text contrast ratio ≥4.5:1.
  - Keyboard Navigation: all UI elements accessible via Tab.
  - Screen Reader Support: alt text for images, ARIA labels for buttons.

#### Localization
- **Languages Supported:** English (default), Marathi, Hindi.
- **Date Format:** DD-MMM-YYYY (e.g., 23-Feb-2026) to avoid confusion.
- **Number Format:** Indian style (e.g., 1,00,000 instead of 100,000).
- **Regional Calendars:** Option for Hindu/Gregorian calendar in reports.

### 5.7 Maintainability

- **Code Quality:** 80%+ test coverage; documented APIs (Swagger); clear function naming.
- **Dependency Management:** Regular updates for security patches; tested before production deploy.
- **Logging:** Structured logs (JSON format) with timestamps, severity levels, context; queryable in ELK.
- **Documentation:** System architecture doc, API doc, runbook for common issues.

### 5.8 Cost Optimization

- **Cloud Infrastructure Cost:** Target ₹2-3L/month for pilot (500K-1M API calls/month, storage <100GB).
- **SMS Cost:** ₹0.5-1 per SMS; annual budget ₹2-5L depending on alert frequency.
- **Tanker Route Optimization Savings:** Expected ₹1.5-2.5L/year per district (20-30% trip reduction × fuel cost).
- **Cost Tracking:** Dashboard to monitor spend vs. budget; alerts if projected overrun.

---

## 6. USER INTERFACE & EXPERIENCE

### 6.1 Key Screens

#### Screen 1: Authority Dashboard
- **Primary Audience:** DWO.
- **Key Elements:**
  - Large VWSI gauge (circular progress bar, color-coded).
  - District map with villages (heatmap by VWSI).
  - Live tanker tracking (icons on map).
  - Forecast chart (next 6 weeks, 90% confidence band).
  - Quick action buttons (Approve Allocation, Send SMS, View Reports).
- **Data Refresh:** Every 30 seconds auto; manual refresh button.

#### Screen 2: Allocation Approval
- **Primary Audience:** Block Manager.
- **Flow:**
  1. Manager views auto-generated allocation (villages, priority rank, tanker count).
  2. Can adjust individual village tanker counts (within total capacity).
  3. Reviews equity rules compliance (% SC/ST villages covered, geographic diversity).
  4. Approves → Route optimization triggered.
- **Validation:** System prevents allocation >total tanker capacity; alerts if coverage <70% for high-stress villages.

#### Screen 3: Delivery Execution (Driver App)
- **Primary Audience:** Tanker Driver.
- **Key Elements:**
  - Map with assigned route (turn-by-turn navigation).
  - List of villages: arrival → check-in button → delivery volume input → photo upload → mark complete.
  - Real-time GPS breadcrumb trail.
  - Chat/call option to contact block manager if issue.
- **Offline:** App caches route; works without connectivity; syncs when online.

#### Screen 4: Gram Panchayat View
- **Primary Audience:** Village representative.
- **Access:** SMS link (responsive web) or mobile app.
- **Content:**
  - Village name, population, current VWSI ("Water Stress: Medium").
  - Tanker ETA ("Water tanker arriving 23-Feb at 2 PM").
  - Conservation tips.
  - Contact block authority button.
- **Simplicity:** Single page; no menu navigation; optimized for 2G/3G.

### 6.2 Design Language

- **Color Palette:** Green (safe), Yellow (caution), Orange (warning), Red (critical) for VWSI; follows India's standard traffic signal convention.
- **Icons:** Simple, recognizable (water drop, tanker, alert, checkmark).
- **Typography:** Roboto/Inter font family; sans-serif for legibility; minimum 14px.
- **Spacing:** Generous padding/margins for rural user base with lower tech literacy.

---

## 7. DATA MODEL & SCHEMA

### 7.1 Core Tables

#### villages
```
village_id (PK)
district_id (FK)
block_id (FK)
village_name
latitude, longitude
population
sc_st_percentage
water_source_type (well, bore, surface)
jjm_beneficiary (Y/N)
active
created_at, updated_at
```

#### rainfall_data
```
rainfall_id (PK)
village_id (FK)
date
actual_rainfall_mm
normal_rainfall_mm
imd_spi (Standardized Precipitation Index)
source (IMD API)
created_at
```

#### groundwater_data
```
gw_id (PK)
village_id (FK)
date
depth_below_surface_m
trend (rising, stable, declining)
classification (safe, semi-critical, critical, overexploited)
source (CGWB)
created_at
```

#### vwsi_index
```
vwsi_id (PK)
village_id (FK)
date
rainfall_component (0-1)
groundwater_component (0-1)
withdrawal_component (0-1)
vwsi_score (0-1)
stress_level (green, yellow, orange, red)
created_at
```

#### demand_forecast
```
demand_id (PK)
village_id (FK)
forecast_week (start date)
predicted_demand_liters
confidence_level (70-95%)
forecast_1mo, 3mo, 6mo (probabilities of stress)
created_at
```

#### tanker_allocation
```
allocation_id (PK)
district_id (FK)
allocation_week (start date)
village_id (FK)
tanker_count
priority_rank
status (planned, in-progress, completed)
total_volume_liters
approved_by (FK to user)
approved_at
created_at, updated_at
```

#### dispatch_routes
```
route_id (PK)
allocation_id (FK)
tanker_id (FK)
route_sequence (villages visited in order)
total_distance_km
estimated_fuel_cost_rs
status (assigned, in-progress, completed)
driver_id (FK to user)
created_at, updated_at
```

#### deliveries
```
delivery_id (PK)
route_id (FK)
village_id (FK)
scheduled_time
actual_arrival_time
actual_departure_time
volume_delivered_liters
driver_id (FK)
gps_location (lat, long)
photos (S3 URLs)
issues (if any)
completed_by (user)
created_at
```

#### sms_alerts
```
sms_id (PK)
village_id (FK)
trigger_type (threshold_breach, tanker_dispatch, conservation_tip)
recipient_phone_hashed
message_template
sent_at
delivery_status (sent, delivered, failed)
delivery_time_sec
provider_message_id
cost_rs
created_at
```

#### users
```
user_id (PK)
name
email
phone_hashed
role (admin, dwo, block_manager, driver, gram_panchayat, viewer)
district_id (FK, null if state-level)
block_id (FK, null if district-level)
created_at, updated_at
```

#### audit_log
```
log_id (PK)
user_id (FK)
action (login, allocation_approved, sms_sent, delivery_logged, config_changed)
table_name
row_id
old_value, new_value
timestamp
ip_address
```

---

## 8. TECHNOLOGY STACK

| Component | Recommendation | Rationale |
|-----------|-----------------|-----------|
| **Backend API** | Python + FastAPI | Async support; built-in OpenAPI docs; rapid prototyping. |
| **Database** | PostgreSQL + PostGIS | Geospatial queries (village location); ACID compliance; open-source. |
| **Caching** | Redis | Sub-second response for frequently accessed data. |
| **ML/Predictions** | TensorFlow + scikit-learn | Mature libraries; LSTM for time-series; easy model deployment. |
| **Route Optimization** | VROOM (open-source) | Free VRP solver; good performance for 100-500 stops. |
| **Frontend Web** | React + Leaflet (maps) | Reactive updates; Leaflet for lightweight mapping. |
| **Mobile App** | React Native or Flutter | Single codebase for iOS + Android; offline support. |
| **SMS Gateway** | MSG91 or BulkSMSGateway | Indian vendors; regional language support; cost-effective. |
| **Geospatial** | OSRM (Open Source Routing Machine) | Free route calculation; self-hosted option. |
| **Cloud Infrastructure** | AWS or Azure | Managed services (RDS, S3, Lambda); enterprise SLA. |
| **Logging/Monitoring** | ELK Stack (Elasticsearch, Logstash, Kibana) | Centralized logs; real-time dashboards. |
| **Deployment** | Docker + Kubernetes (K8s) | Container orchestration; easy scaling. |
| **CI/CD** | GitHub Actions + ArgoCD | Automated testing; GitOps-style deployment. |

---

## 9. DEVELOPMENT ROADMAP & TIMELINE

### Phase 1: MVP (Months 1-3) - ₹15-20L
**Goal:** Drought prediction + basic allocation + SMS alerts for pilot district.

**Milestones:**
- M1 (Week 4): Data pipelines (IMD, CGWB) live; VWSI calculation working.
- M2 (Week 8): ML models trained; 1-month forecast operational; allocation algorithm working.
- M3 (Week 12): SMS integration; driver app MVP; dashboards (basic).

**Deliverables:**
- DWO dashboard (VWSI + forecast).
- Allocation approval interface.
- SMS alert system (threshold-triggered).
- Driver app (basic: route, check-in, delivery input).
- 50% API coverage; documentation.

**Success Criteria:**
- VWSI prediction <1 hour; false alarm rate <20%.
- SMS delivery >90%.
- Adoption by DWO: 3+ active users.

### Phase 2: Enhanced Optimization (Months 4-6) - ₹12-15L
**Goal:** Route optimization, multi-week planning, advanced dashboards.

**Milestones:**
- M4 (Week 16): Route optimization live; trip reduction 20%+.
- M5 (Week 20): Multi-week dispatch planning; real-time GPS tracking working.
- M6 (Week 24): State-level dashboard; block manager app enhanced.

**Deliverables:**
- Route optimization (VROOM integration).
- Live fleet tracking dashboard.
- Multi-day dispatch planning.
- Performance metrics (SLA, cost, coverage).
- 80% API coverage; Swagger docs.

**Success Criteria:**
- Route optimization <10 min; trip reduction ≥20%.
- GPS tracking latency <2 min; accuracy ±50m.
- Adoption: 10+ active users (across 2-3 blocks).
- Cost savings: ₹50K+ in fuel (pilot validation).

### Phase 3: Scaling & Advanced Features (Months 7-12) - ₹18-22L
**Goal:** Scale to full district + state; add predictive features, third-party integration.

**Milestones:**
- M7 (Week 28): Pilot deployment complete; full district rollout started.
- M8 (Week 32): 3-month and 6-month VWSI forecasts; accuracy benchmarked.
- M9 (Week 36): State dashboard operational; multi-district comparison.
- M10 (Week 40): Gram Panchayat app + SMS integration mature; delivery audit trail.
- M11 (Week 44): Third-party API integration (external systems consume Jal Suraksha data).
- M12 (Week 48): Handover to state; training complete; support SOP established.

**Deliverables:**
- Full production system for 1 district (5,000-10,000 villages).
- 3/6-month forecast models; confidence intervals.
- State-level dashboards + benchmarking.
- Gram Panchayat web app + SMS-based alerts mature.
- 100% API coverage; client SDKs (Python, Node.js).
- Comprehensive runbook, FAQs, video training.

**Success Criteria:**
- System stable; 99.5% uptime in production.
- VWSI prediction ±0.15 RMSE (validated).
- Tanker allocation efficiency ≥25% (trip reduction).
- Adoption ≥80% of DWO, block managers, drivers.
- Cost savings ≥₹1.5L in pilot district (annual projection).
- SMS delivery rate >98%; SMS cost ≤₹1/message.

---

## 10. IMPLEMENTATION CONSIDERATIONS

### 10.1 Pilot Strategy

**Location:** Jiwati Block, Madhya Pradesh (or similar drought-prone district).
- **Rationale:** 
  - High water stress historically (VWSI likely >0.5).
  - 150-200 villages (manageable size for pilot).
  - State water department supportive.
  - Data availability (rainfall, groundwater).

**Duration:** 6 months operational pilot (Months 3-8).
- **Months 1-3:** Development.
- **Months 4-6:** Deploy to Jiwati; run live; calibrate models.
- **Months 7-12:** Scale to full district; refine; then scale state-wide (future).

**Pilot Success Metrics:**
- VWSI prediction accuracy: 90% detection of drought that occurs; <15% false alarms.
- Tanker efficiency: 20-30% trip reduction; cost savings ₹50K+ in 6 months.
- User adoption: 80% of DWO, block managers, 50% of drivers actively using system.
- SMS reach: >90% of Gram Panchayats receive alerts within 1 hour.
- System stability: 99.5% uptime; <1 critical incident/month.

### 10.2 Stakeholder Engagement

**Phase 1 (Month 1):**
- District Collector briefing: Vision, timeline, success metrics.
- Water Department workshop: Technical architecture, data requirements, integrations.
- Gram Panchayat outreach: Explain SMS alerts, data privacy, benefits.

**Phase 2 (Months 4-6):**
- Monthly steering committee (Collector, Chief Secretary, water officer, NGO partners).
- Quarterly community forums (Gram Panchayats + village leaders) to gather feedback.
- Media outreach: Press release on Jal Suraksha launch, early results.

**Phase 3 (Months 7-12):**
- Capacity building: Training for 100+ users (state + district + block staff).
- Peer learning: Exposure visits from neighboring districts.
- Advocacy: Case study documentation for replication.

### 10.3 Change Management

**User Training:**
- DWO: 2-day workshop (system navigation, alerts, decision-making).
- Block Managers: 1-day hands-on (allocation approval, dispatch, tracking).
- Drivers: 30-min mobile app demo (route, delivery input, GPS).
- Gram Panchayats: SMS briefing (alert interpretation, conservation tips).

**Resistance Mitigation:**
- Cost-benefit analysis shared early (time saved per week, fuel savings).
- Involve block managers in allocation algorithm design (buy-in on fairness).
- Early wins highlighted (e.g., first week: 20% fuel savings vs. baseline).

### 10.4 Data Governance & Privacy

**Data Collection Transparency:**
- Village water committee informed of system (SMS alerts, GPS tracking) before launch.
- Opt-out option for Gram Panchayats (with audit log).

**Data Retention Policy:**
- Delivery data: Retain 2 years (audit trail); older data anonymized (GPS location removed).
- SMS logs: Retain 6 months; then delete (cost + privacy).
- Forecasts: Retain permanently (learning).

**Third-Party Data Sharing:**
- No sharing of GPS traces, SMS history, individual consumption data.
- Aggregate metrics (e.g., "district average VWSI") can be shared for research.
- State water department access by default; external researchers with approval + data use agreement.

### 10.5 Financial Sustainability

**Cost Structure (Annual, per district):**

| Item | Cost | Notes |
|------|------|-------|
| Cloud Infrastructure (AWS) | ₹25-30L | Compute, database, storage, bandwidth. |
| SMS Alerts | ₹2-5L | 2000-5000 alerts/year × ₹1 average. |
| Staff (Operation) | ₹15-20L | 2-3 FTE (technical support, data analyst). |
| Vendor Integration (IMD, CGWB) | ₹0 | Government data (no licensing). |
| **Total Annual Cost** | **₹42-55L** | |

**Revenue/Savings Model:**

| Source | Amount | Notes |
|--------|--------|-------|
| Fuel cost savings (20-30% trip reduction) | ₹1.5-2.5L | Baseline: ₹5-8L annual tanker fuel. |
| Staff time saved (allocation, dispatch manual work) | ₹0.5-1L | ~3-4 hours/week manual work eliminated. |
| Reduced emergency response (preventive planning) | ₹0.5-1L | Estimate; soft benefit. |
| **Total Tangible Benefit** | **₹2.5-4.5L/year** | ROI break-even: ~10-15 years (conservative). |

**Funding Strategy:**
- **Year 1-2:** Government grants (state water department, NITI Aayog, World Bank-funded projects).
- **Year 3+:** Operational cost absorbed in state water department budget; proven ROI justifies continuation.
- **Replication:** Once successful in pilot, state funds multi-district rollout.

---

## 11. RISKS & MITIGATION

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **Poor data quality (IMD/CGWB delays/gaps)** | High | Medium | Manual data entry option; cached data fallback; alert admin. |
| **VWSI model inaccuracy (false alarms, missed droughts)** | Medium | High | Quarterly model recalibration using actual drought data; human expert override. |
| **Low user adoption (DWO resistance)** | Medium | High | Early involvement in design; demonstrate ROI; train intensively. |
| **SMS delivery failures (network issues)** | Medium | Medium | Retry logic; fallback to voice call; alternate SMS provider contract. |
| **GPS tracking privacy concerns** | Low | Medium | Privacy by design (data deleted after 1 month); transparency; opt-out. |
| **Tanker fleet insufficient for allocation** | Medium | High | Demand forecast alerts state; escalation SOP to request additional tankers. |
| **System outage during crisis** | Low | Critical | 99.5% uptime SLA; failover; manual backup (phone-based allocation). |
| **Cost overruns (cloud infra, SMS)** | Low | Medium | Cost monitoring dashboard; alerts at 80% budget; negotiate provider discounts. |

---

## 12. SUCCESS METRICS & KPIs

### 12.1 Operational KPIs

| KPI | Target | Measurement |
|-----|--------|-------------|
| VWSI Prediction Accuracy | 90% detection; <15% false alarm | Compare 1-month forecast vs. actual drought (quarterly). |
| Tanker Trip Reduction | 20-30% vs. baseline | Trips in optimized period / baseline period. |
| SMS Delivery Rate | >95% within 3 min | SMS provider reports; no. delivered / sent. |
| Dashboard Uptime | 99.5% | Monitoring tool (Pingdom, DataDog). |
| Mean Time to Resolution (MTTR) | <4 hours for critical issues | Incident tracking log. |
| Village Coverage (% allocated tankers) | ≥70% for VWSI>0.5 villages | Allocation data; audit monthly. |

### 12.2 Impact KPIs

| KPI | Target | Measurement |
|-----|--------|-------------|
| Fuel Cost Savings | ₹1.5-2.5L/year | Fuel spent (optimized) vs. baseline; audit quarterly. |
| Staff Time Saved | 3-4 hours/week | Survey DWO + block managers (monthly). |
| User Adoption | ≥80% of staff active | Login audit trail; active user count. |
| Emergency Response Time | Reduced by 30% | Response time (alert issued → tanker dispatch). |
| Water Security (villages not facing acute shortage due to prediction) | ≥90% of critical villages pre-positioned tankers | Village surveys + delivery logs. |
| Equity (% SC/ST villages receiving equitable allocation) | ≥85% equitable allocation | Allocation audit by demographic group. |

### 12.3 Financial KPIs

| KPI | Target | Measurement |
|-----|--------|-------------|
| Cost per Village per Year | ₹5-7K | Total cost / number of villages. |
| Cost per Alert Issued | ₹50-100 | SMS + system cost / number of alerts. |
| ROI (Year 1) | 5-10% | Tangible benefits / total cost. |
| Cost per Tanker Trip Optimized | ₹200-300 savings | Fuel saved / number of optimized trips. |

---

## 13. GLOSSARY

| Term | Definition |
|------|-----------|
| **VWSI** | Village-Level Water Stress Index (0-1 scale). |
| **CGWB** | Central Ground Water Board (India). |
| **IMD** | India Meteorological Department. |
| **VRP** | Vehicle Routing Problem (optimization). |
| **RTO/RPO** | Recovery Time/Point Objective (disaster recovery metrics). |
| **SLA** | Service Level Agreement. |
| **API** | Application Programming Interface. |
| **GPS** | Global Positioning System. |
| **OSRM** | Open Source Routing Machine. |
| **VROOM** | Vehicle Routing Open-source Optimization Machine. |
| **RBAC** | Role-Based Access Control. |
| **DWO** | District Water Officer. |
| **SOP** | Standard Operating Procedure. |

---

## 14. APPENDICES

### Appendix A: Sample VWSI Calculation (Example Village)

**Village:** Londa, Jiwati Block, Madhya Pradesh

**Inputs (as of 23-Feb-2026):**
- Actual rainfall (past 4 weeks): 15 mm
- Normal rainfall (Feb historical average): 5 mm
- Groundwater depth: 32 m (3 weeks ago: 30 m; declining 0.67 m/week)
- Population: 2,500
- Local water source capacity: 10,000 L/day
- Daily water demand: 2,500 × 45 L = 112,500 L/day

**Calculations:**

1. **Rainfall Component:**
   - Deviation = (15 - 5) / 5 = +2.0 (above normal)
   - Normalize (z-score): If district std_dev = 1.5, z = 2.0 / 1.5 = +1.33
   - Clamp to 0-1: Component = 0 (positive deviation means no water stress from rainfall)

2. **Groundwater Component:**
   - Decline rate: 0.67 m/week; threshold = 0.5 m/week
   - Classification: Rapid decline (critical)
   - Component = min(0.67 / 0.5, 1.0) = 1.0 (maximum stress)

3. **Withdrawal Component:**
   - Runoff = 15 mm × 0.3 = 4.5 mm = 4,500 m³/km² = 450 L/person (for 1 km² supporting 10,000 people)
   - Recharge = 5 mm × 0.15 = 0.75 mm ≈ 10 L/person
   - Sustainable supply = 450 + 10 = 460 L/person
   - Demand = 45 L/person/day
   - Withdrawal ratio = 45 / 460 = 0.098 (very sustainable locally; but aquifer depleting)
   - Component = 0.098 (low stress from withdrawal ratio alone)

4. **VWSI Composite:**
   ```
   VWSI = 0.4 × 0 + 0.4 × 1.0 + 0.2 × 0.098
        = 0 + 0.4 + 0.02
        = 0.42
   ```
   
   **Stress Level:** ORANGE (high stress; 0.4 < 0.42 ≤ 0.6)

**Action:** Tanker allocation for Londa triggered; alert SMS to Gram Panchayat.

### Appendix B: SMS Template Examples

**Template 1: Drought Alert**
```
🚨 Jal Suraksha Alert 🚨

Village: Londa
Water Stress Level: ORANGE (High)

🌊 Water is scarce. Please conserve:
• Use 30L per person per day
• Reuse greywater for plants
• Avoid wastage

🚛 Tanker Relief:
Water tanker will arrive on 25-Feb at 2-4 PM.
Collect at village center.

📞 Questions? Contact Block Office:
Jiwati Block: 07654-XXXXX (9am-5pm)

Jal Suraksha | Predict. Allocate. Deliver.
```

**Template 2: Tanker Confirmation**
```
✅ Water Delivery Confirmed ✅

Village: Londa
Tanker #: WJ-2026-42
Driver: Ramesh Kumar

📍 Delivery Details:
• Date: 25-Feb-2026
• Time: 2:00 PM - 4:00 PM
• Location: Village Center
• Volume: 30,000 Liters

📞 Contact Driver:
+91-9876-XXXXX

Jal Suraksha | Relief on Schedule
```

**Template 3: Conservation Tip (Weekly)**
```
💧 Jal Suraksha Tip 💧

Did you know? Reusing greywater saves 20L/day!

✨ This week's tip:
Collect water after washing vegetables → Use for watering plants or cleaning.

Every liter saved helps your village.
Share with neighbors! 🤝

Jal Suraksha Community
```

### Appendix C: Configuration Parameters (Default Values)

| Parameter | Default | Range | Notes |
|-----------|---------|-------|-------|
| VWSI Threshold (Alert) | 0.4 | 0.3-0.7 | Configurable by DWO. |
| VWSI Severe Threshold | 0.6 | 0.4-0.9 | Triggers escalation. |
| Per Capita Water Demand | 45 L/person/day | 30-60 | Per MOHUA guidelines. |
| Days to Critical Supply | 3 | 2-5 | Days village can sustain before tanker needed. |
| Vulnerable Group Bonus | +10% | 0-20% | For SC/ST majority villages. |
| Min Coverage (VWSI>0.5) | 70% | 60-80% | Mandatory allocation. |
| SMS Frequency Cap | 2/week/village | 1-5 | Avoid alert fatigue. |
| Route Max Duration | 8 hours | 6-10 | Per tanker/day. |
| Forecast Confidence Threshold | 70% | 50-90% | Below this, flag as uncertain. |
| Data Freshness Tolerance | 3 days | 1-7 | Max age for cached data. |

---

## 15. APPROVAL & SIGN-OFF

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Project Lead** | [Name] | _____ | 23-Feb-2026 |
| **Product Manager** | [Name] | _____ | 23-Feb-2026 |
| **District Water Officer** | [Name] | _____ | [Date] |
| **State Water Department** | [Name] | _____ | [Date] |
| **Technical Lead** | [Name] | _____ | 23-Feb-2026 |

---

**End of Document**

---

### Document Control

**Version History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 23-Feb-2026 | Product Team | Initial PRD; comprehensive scope. |

**Document Status:** DRAFT (Ready for Stakeholder Review)  
**Next Review:** 02-Mar-2026 (Stakeholder Feedback Incorporation)  
**Approval Target:** 09-Mar-2026 (Project Kickoff)
