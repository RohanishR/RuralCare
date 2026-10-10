# RuralCare - AI-Assisted Rural Healthcare Platform

## Project Overview

RuralCare is an advanced, AI-assisted healthcare platform designed to connect rural patients with healthcare providers. The platform bridges the gap in rural healthcare access by providing automated triage, symptom checking, digital prescriptions, and remote teleconsultations (WebRTC), along with intuitive dashboards for both patients and doctors.

## Architecture

The system utilizes a modern decoupled architecture:
- **Frontend (Client):** A responsive Next.js web application utilizing Tailwind CSS for styling and React Context for state management. It communicates with the backend via RESTful APIs.
- **Backend (Server):** A high-performance FastAPI service that handles business logic, database operations, and authentication.
- **Database:** MongoDB Atlas is used for flexible, document-oriented data storage (NoSQL).
- **External Services:** 
  - Google OAuth for seamless authentication.
  - Generative AI for the symptom assistant.
  - WebRTC (via PeerJS) for live video teleconsultations.

## Technology Stack

- **Frontend:** Next.js, React, Tailwind CSS, TypeScript, PeerJS
- **Backend:** Python, FastAPI, Motor (Async MongoDB Driver), PyJWT
- **Database:** MongoDB Atlas

## Prerequisites

- **Node.js**: v18+ or v20+
- **Python**: 3.10+ (Python 3.13 tested)
- **MongoDB**: Atlas account or local MongoDB instance

## Environment Variables

### Frontend (`.env.local`)
Create this file in the project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend (`backend/.env`)
Create this file in the `backend/` directory:
```env
PROJECT_NAME=RuralCare API
API_V1_STR=/api/v1
FRONTEND_URL=http://localhost:3000

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=ruralcare

SECRET_KEY=change_this_to_a_secure_random_string
ACCESS_TOKEN_EXPIRE_MINUTES=60
GOOGLE_CLIENT_ID=your_google_client_id
```
*(Ensure to keep your `.env` files secure and never commit them to version control).*

## Database Setup (MongoDB Atlas)

1. Create a free cluster on MongoDB Atlas.
2. In **Database Access**, create a user and securely store the password.
3. In **Network Access**, whitelist your IP (or `0.0.0.0/0` if deploying).
4. Get your connection string and add it to `backend/.env` as `MONGODB_URI`.
5. Run the backend once; it will automatically create the necessary collections and indexes on startup (e.g., `users.email`, `doctors.specialization`, `appointments.date`, etc.).

## Local Setup & Running the Application

### 1. Backend Setup

Open a terminal at the project root (`RuralCare`) and run:

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Start the backend server on port 8000
python -m uvicorn backend.main:app --reload --port 8000
```
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Frontend Setup

Open a second terminal at the project root (`RuralCare`) and run:

```bash
# Install dependencies
npm install

# Start the frontend dev server on port 3000
npm run dev
```
- **Web Application**: [http://localhost:3000](http://localhost:3000)

## Testing

**Backend Tests:**
Ensure the backend is running locally, then run the tests via `pytest`:
```bash
pytest backend/tests/
```

**Frontend Build Test:**
To verify the frontend can build successfully:
```bash
npm run build
```

## Deployment

### Current combined Vercel deployment

This repository now uses the Services configuration in vercel.json to deploy Next.js and FastAPI together. Use the repository root, select the **Services** framework, configure the backend environment variables in Vercel, and set NEXT_PUBLIC_API_URL=/api/v1. See [Registration deployment diagnosis](REGISTRATION_DEPLOYMENT_FIX.md) for the exact production origin, entry point, safe diagnostics, and tested registration procedure.

### Alternative: deploying the frontend with a separately hosted backend
1. Push your code to a GitHub repository.
2. Go to Vercel and import your repository.
3. Set the Framework Preset to **Next.js**.
4. In the Environment Variables section, add:
   - `NEXT_PUBLIC_API_URL` (pointing to your deployed FastAPI backend URL, e.g., `https://api.ruralcare.com/api/v1`)
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
5. Click **Deploy**. Vercel will automatically handle HTTPS, CDN caching, and builds.

### Deploying the Backend (Render / Heroku / AWS)
1. Deploy the `backend/` directory using a Python ASGI server like `uvicorn` or `gunicorn`. 
   - Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
2. Configure the following environment variables in your cloud provider:
   - `FRONTEND_URL` (your deployed Vercel URL, e.g., `https://ruralcare.vercel.app`) - required for CORS!
   - `MONGODB_URI` (your production database URI)
   - `SECRET_KEY` (a strong, randomly generated string)
3. Ensure HTTPS is enforced by the cloud provider.
4. Update Google Cloud Console with the new OAuth redirect URLs and allowed origins to match your deployed domains.
