# AI-LOG.md

> **Transparency Declaration for Hackathon 2026 Submission**

## 🤖 Role of AI

This project was developed with the assistance of Large Language Models (LLMs) to accelerate development, optimize code quality, and ensure best practices. The AI acted as a "Pair Programmer" and "DevOps Engineer," operating under strict human supervision and architectural guidance.

## 🛠️ How AI Was Used

### 1. Architecture & Design

- **Prompt**: "Design a scalable architecture for a FastAPI + React app handling NASA API data."
- **AI Contribution**: Suggested the separation of concerns (Service Layer pattern), Pydantic schemas for validation, and the multi-stage Docker build strategy.
- **Human Role**: Defined the specific requirements (Space theme, Socket.io integration) and validated the architectural choices against hackathon constraints.

### 2. Frontend Development (React + Three.js)

- **Prompt**: "Create a 3D orbit visualization using React Three Fiber."
- **AI Contribution**: Generated the boilerplate for the 3D scene, including the `TubeGeometry` for orbits and the auto-rotation logic. Helped implement the "starfield" background.
- **Human Role**: Refined the visual aesthetics (colors, sizing algorithms), integrated real asteroid data props, and ensured responsive performance.

### 3. Backend Implementation (FastAPI)

- **Prompt**: "Create a robust asteroid feed endpoint with filtering and sorting."
- **AI Contribution**: Wrote the SQLAlchemy complex queries for filtering by date, hazard status, and diameter.
- **Human Role**: Implemented the NASA API sync logic, error handling, and business logic for risk assessment scoring.

### 4. DevOps (Docker & Deployment)

- **Prompt**: "Create a Docker Compose setup for free tier deployment."
- **AI Contribution**: Authored the initial `Dockerfile` and `docker-compose.yml`, simplified the Nginx configuration to a lightweight Node server (`serve`) for the frontend.
- **Human Role**: Debugged dependency conflicts (e.g., `pytest` versions), verified connecting ports, and wrote the final `DEPLOY.md` guide.

---

## 🚫 What AI Did NOT Do

- AI did **not** define the core problem statement or the creative direction.
- AI did **not** blindly copy-paste code without review; all logic was verified for correctness and security.
- AI did **not** deploy the application; all deployment steps were manually executed and verified by the team.

## ✅ Conclusion

AI was used as a productivity multiplier, allowing the team to focus on high-level feature implementation, UI/UX polish, and solving complex integration challenges within the hackathon timeframe. It ensured code cleanliness and adherence to modern standards (PEP 8, ESLint).
