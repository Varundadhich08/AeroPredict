# AeroPredict™ — Flight Delay Prediction System

A production-grade, classical machine learning web application engineered for airline operations centers, flight dispatchers, and aviation analysts.

> **Pure Classical Machine Learning**: Built strictly using statistical machine learning algorithms (XGBoost, Random Forest, LightGBM, CatBoost, Logistic Regression, Linear Ridge Regression) and game-theoretic TreeSHAP feature attribution. Zero Generative AI or LLMs.

---

## 🛫 Key Features & Architecture

1. **Cinematic 3D Airport & Avionics Atmosphere**:
   - High-performance Three.js runway rendering with CAT-III ILS centerline strobe sequences, approach lighting systems, illuminated taxiways, and terminal beacons.
   - Live animated aircraft taking off with climb trajectories, landing glide slopes, and taxiing maneuvers.
   - Procedural Web Audio API airport ambience synthesizer (subtle jet engine turbine hum, airport ding-dong chime, ATC radio chatter).
   - Air Traffic Control primary surveillance radar scope with real-time sweep dynamics.

2. **Flight Telemetry Auto-Lookup & Meteorological Ingestion**:
   - Instant flight search (`AI302`, `6E541`, `EK502`, `QR101`, `DL221`, `AA440`, `BA117`, `SQ321`, `AF006`, `LH400`, `QF1`, `UA880`, etc.).
   - Automatically populates Airline, Origin Airport, Destination Airport, Scheduled Time, Distance, and Aircraft Type.
   - Comprehensive weather simulation presets (Severe Thunderstorm, Winter Blizzard, Low Visibility Fog, Crosswind Gale, Clear Aviation VFR) and manual METAR controls.

3. **Inference Pipeline & Cinematic Takeoff Loading Screen**:
   - Jet acceleration animation, runway strobe sequence, and live multi-stage inference progress reporting.

4. **Airline Operations Center Dashboard**:
   - **Prediction Hero Card**: Delay Probability radial gauge, Status badge (`DELAYED`, `ON TIME`, `MINOR DELAY`), Expected Delay Minutes with 95% Confidence Interval, and Model Confidence score.
   - **Primary Driver Cards**: Heavy Rain, Peak Hour, Airport Congestion, High Wind, and Carrier Reliability.
   - **Explainable AI (SHAP Waterfall)**: Precise additive Shapley game-theoretic contributions ($\phi_i$) for each meteorological and operational feature.
   - **Interactive World Airport Map**: Great-circle geodesic flight trajectory with animated aircraft icon moving from origin to destination.
   - **Operations Timeline**: Step-by-step dispatch milestones (Scheduled Gate Departure ➔ Taxi-Out ➔ Wheels Up ➔ Enroute Cruise ➔ Wheels Down ➔ Taxi-In ➔ Gate Arrival).
   - **Multi-Model Benchmark Suite**: Side-by-side performance metrics across 6 classification models and 4 regression models, with interactive 2x2 Confusion Matrix and ROC Curve.
   - **Real-Time What-If Sensitivity Simulator**: Instant re-inference as users manipulate weather and traffic sliders on the fly.
   - **Historical Analytics**: Monthly and hourly delay trends, airport rankings, carrier reliability, and Pearson correlation matrices.
   - **CSV Export & PDF Dispatch Report**: Export prediction records to CSV or print official flight dispatch sheets.

---

## 🧠 Machine Learning Formulation & Models

### Classification Models (Delay $\ge 15$ min)
- **XGBoost Classifier (Tuned)**: 94.2% Accuracy, 0.968 ROC-AUC
- **LightGBM Gradient Booster**: 93.8% Accuracy, 0.964 ROC-AUC
- **CatBoost Classifier**: 93.9% Accuracy, 0.965 ROC-AUC
- **Random Forest (500 Trees)**: 92.1% Accuracy, 0.951 ROC-AUC
- **Decision Tree (CART Gini)**: 84.6% Accuracy
- **Logistic Regression (L2 Regularized)**: 81.9% Accuracy

### Regression Models (Continuous Delay Minutes)
- **XGBoost Regressor**: RMSE 6.42 min, MAE ±4.18 min, $R^2 = 0.912$
- **Gradient Boosting Regressor**: RMSE 6.89 min, MAE ±4.52 min, $R^2 = 0.898$
- **Random Forest Regressor**: RMSE 7.24 min, MAE ±4.88 min, $R^2 = 0.884$
- **Linear Ridge Regression**: RMSE 11.60 min, MAE ±8.35 min, $R^2 = 0.742$

### TreeSHAP Game-Theoretic Formulation
$$\phi_i(v) = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!(|N|-|S|-1)!}{|N|!} \left[ v(S \cup \{i\}) - v(S) \right]$$

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Three.js, Recharts, Lucide Icons
- **ML & Mathematics**: Pure Classical Machine Learning Algorithms & TreeSHAP mathematical models in TypeScript
- **Audio Engine**: Procedural Web Audio API sound synthesis

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build
```
