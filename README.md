# RuralCare - AI-Assisted Rural Healthcare Platform

RuralCare connects rural patients with healthcare providers, featuring automated triage, appointments, prescriptions, and remote consultations.

---

## Prerequisites

- **Node.js**: v18+ or v20+
- **Python**: 3.10+ (Python 3.13 tested)
- **MongoDB**: Atlas or local MongoDB instance (configured in `backend/.env`)

---

## Quick Start (How to Run)

The application consists of two services: the **FastAPI Backend** and the **Next.js Frontend**. You need to run both in separate terminal windows.

### 1. Start the Backend (FastAPI)

Open a terminal at the project root (`RuralCare`) and run:

```bash
# Install dependencies (first time only)
pip install -r backend/requirements.txt

# Start the backend server on port 8000
python -m uvicorn backend.main:app --reload --port 8000
```

- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### 2. Start the Frontend (Next.js)

Open a second terminal at the project root (`RuralCare`) and run:

```bash
# Install dependencies (first time only)
npm install

# Start the frontend dev server on port 3000
npm run dev
```

- **Web Application**: [http://localhost:3000](http://localhost:3000)

---

## Environment Configuration

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=980357609469-4vepi1a50lab2fqe9ltc7gb1v57jos6f.apps.googleusercontent.com
```

### Backend (`backend/.env`)
```env
PROJECT_NAME=RuralCare API
API_V1_STR=/api/v1
FRONTEND_URL=http://localhost:3000

MONGODB_URI=mongodb+srv://...
DATABASE_NAME=ruralcare

SECRET_KEY=change_this_to_a_secure_random_string
ACCESS_TOKEN_EXPIRE_MINUTES=60
```
