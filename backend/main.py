from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import uvicorn

from models import WardData, CityMetrics, InfrastructureIncident, AIRecommendation
from algorithms.simulation_engine import IndianCitySimulationEngine

app = FastAPI(
    title="CITYOS — Indian City Digital Twin Municipal Simulation API",
    description="Deterministic infrastructure simulation service for 3D City Digital Twin telemetry, traffic routing, power grid, water distribution, and emergency dispatch.",
    version="1.0.0"
)

# Enable CORS for local Vite dev server and production deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engine instance
engine = IndianCitySimulationEngine()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "CITYOS Digital Twin API",
        "author": "Karthikeya Sharma",
        "version": "1.0.0",
        "wards_count": len(engine.wards)
    }

@app.get("/api/city/metrics", response_model=CityMetrics)
def get_city_metrics():
    """Retrieve current aggregate city metrics."""
    return engine.step_simulation(delta_time_min=0.0)

@app.get("/api/city/wards", response_model=List[WardData])
def get_wards():
    """Retrieve detailed telemetry across all 6 city wards."""
    return list(engine.wards.values())

@app.get("/api/city/incidents", response_model=List[InfrastructureIncident])
def get_incidents():
    """Retrieve active emergency incidents across infrastructure."""
    return engine.incidents

@app.get("/api/ai/recommendations", response_model=List[AIRecommendation])
def get_recommendations():
    """Retrieve AI-driven municipal planning recommendations."""
    return engine.recommendations

@app.post("/api/simulate/step")
def simulate_step(delta_time_min: float = 15.0):
    """Step forward simulation time."""
    metrics = engine.step_simulation(delta_time_min)
    return {
        "metrics": metrics,
        "wards": list(engine.wards.values()),
        "incidents": engine.incidents
    }

@app.post("/api/simulate/emergency/dispatch")
def dispatch_emergency(incident_id: str, unit_name: str):
    """Dispatch emergency services to an active incident."""
    for inc in engine.incidents:
        if inc.id == incident_id:
            inc.status = "RESPONDING"
            inc.dispatched_unit = unit_name
            inc.response_eta_min = 4.5
            return {"success": True, "incident": inc}
    raise HTTPException(status_code=404, detail="Incident not found")

@app.post("/api/interventions/apply")
def apply_intervention(rec_id: str):
    """Simulate applying an AI municipal intervention."""
    result = engine.apply_intervention(rec_id)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
