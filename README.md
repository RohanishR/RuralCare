# RuralCare — Telemedicine for Rural Healthcare

**RuralCare** is a telemedicine platform designed to improve access to healthcare for people in rural and underserved communities. It aims to connect patients with doctors through online consultations, appointment scheduling, multilingual communication, and digital medical records.

The project uses a web-based frontend and a Python backend, with AI-assisted symptom collection and summarization intended to support the consultation process.

> **Project status:** Features described in this README may be implemented, in development, or planned. Update the feature checklist to reflect the current state of your codebase.

## Table of Contents

- [Overview](#overview)
- [Objectives](#objectives)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Security and Privacy](#security-and-privacy)
- [Medical Safety Disclaimer](#medical-safety-disclaimer)
- [Future Enhancements](#future-enhancements)

## Overview

Access to qualified healthcare professionals can be difficult in rural areas because of distance, transportation challenges, limited medical facilities, and language barriers.

RuralCare aims to reduce these barriers by providing an online platform where patients can find doctors, request appointments, participate in remote consultations, and access their medical information.

The platform is designed around three primary user roles:

- **Patient:** Manage a profile, find doctors, request appointments, and access consultation-related information.
- **Doctor:** Manage a professional profile, review appointments, consult patients, and maintain relevant medical documentation.
- **Administrator:** Manage users, review doctor verification requests, and oversee platform activity.

## Objectives

- Improve access to healthcare through remote consultations.
- Support appointment scheduling between patients and doctors.
- Reduce language barriers through multilingual communication.
- Organize medical records and digital prescriptions.
- Provide AI-assisted symptom collection and summarization.
- Support users with limited or unreliable internet connectivity.
- Protect sensitive information through appropriate authentication and access controls.

## Features

Feature availability depends on the current implementation.

| Feature | Description |
|---|---|
| User authentication | Account registration, login, and session/token management |
| Role-based access | Separate patient, doctor, and administrator permissions |
| Doctor discovery | Search and view doctor profiles |
| Appointment management | Request, view, and manage appointments |
| Video consultations | Remote consultations using WebRTC |
| AI symptom assistant | Collect and summarize patient-reported symptoms |
| Language support | Translate selected text to supported languages |
| Medical records | Organize consultation-related documents and records |
| Digital prescriptions | Store and access prescriptions issued by authorized doctors |
| Notifications | Communicate appointment and consultation updates |
| Doctor verification | Review professional credentials through an administrative workflow |
| Low-bandwidth experience | Optimize the interface and provide appropriate fallback states |

## System Architecture

RuralCare uses a client-server architecture.

```text
                 PATIENT / DOCTOR / ADMIN
                           |
                           v
                 Next.js Web Application
                  TypeScript + Tailwind
                           |
                     HTTPS / REST
                           |
                           v
                    FastAPI Backend
                     Python Services
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
    MongoDB Atlas      AI Services     Translation API
          |
          v
   Persistent Application Data


       Patient Device <---- WebRTC ----> Doctor Device
                       Video / Audio
```

The backend is responsible for authentication, authorization, business logic, data access, and communication with external services.

WebRTC handles peer-to-peer audio/video communication when connectivity permits. Depending on the implementation, a signaling service and STUN/TURN infrastructure may also be required.

### Main application components

**Frontend**
- Renders the user interface.
- Provides patient, doctor, and administrator workflows.
- Sends API requests to the backend.
- Handles loading, validation, and error states.

**Backend**
- Exposes REST API endpoints.
- Validates requests and enforces access permissions.
- Processes appointment and medical-record operations.
- Connects to MongoDB and configured external services.

**Database**
- Stores application data such as user profiles, appointments, and consultation records.
- Uses MongoDB Atlas for managed cloud database hosting.

**AI and translation services**
- Assist with symptom organization, summarization, and supported language translation.
- Must be configured with the required credentials and service integrations.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js |
| Programming language | TypeScript |
| Styling | Tailwind CSS |
| Backend | FastAPI |
| Backend language | Python |
| Database | MongoDB Atlas |
| Authentication | JWT; Google OAuth where configured |
| Video consultation | WebRTC |
| AI processing | Python and configured AI services |
| Translation | Configured translation API or multilingual model |
| Frontend deployment | Vercel |
| Backend deployment | Vercel Python Functions or another compatible Python host |
| Design | Figma |

## Prerequisites

Install the following tools before running the project locally:

- Node.js and npm
- Python 3.10 or a compatible version supported by your dependencies
- Git
- A MongoDB Atlas account or another configured MongoDB instance
- A code editor such as Visual Studio Code

You may also need credentials for Google OAuth, an AI provider, a translation service, and video signaling infrastructure, depending on the features enabled in your application.

## Getting Started

### 1. Clone the repository

Replace the placeholder URL with your actual GitHub repository URL.

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

If the frontend and backend are stored in separate repositories, clone each repository separately.

### 2. Configure the frontend

Navigate to the directory containing the frontend's `package.json`.

```bash
cd <FRONTEND_DIRECTORY>
npm install
```

Create a `.env.local` file in the frontend directory.

Example:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Use the variable name expected by your existing API client. If your project uses a different name, configure that name instead.

### 3. Configure the backend

Open a second terminal and navigate to the directory containing the FastAPI application.

Create a virtual environment:

**Windows**

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**Linux/macOS**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the project's backend dependencies:

```bash
pip install -r requirements.txt
```

If `requirements.txt` does not exist, create one containing the actual packages required by your backend.

Create a backend `.env` file using the environment variables required by your application. See [Environment Variables](#environment-variables).

### 4. Configure MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user with an appropriately restricted password.
3. Configure network access to permit connections from your backend host.
4. Copy the connection string from Atlas.
5. Add it to the backend's environment configuration.
6. Confirm that the backend can connect to the database.

Do not expose the MongoDB connection string in frontend code.

## Environment Variables

The following are illustrative variable names. Your application must read the same names that you configure in the deployment environment.

### Frontend

Example `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

For production, replace the local URL with the deployed backend's HTTPS origin.

Example:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.vercel.app
```

Use your actual deployed domain, not the placeholder above.

**Important:** Variables prefixed with `NEXT_PUBLIC_` can be exposed to browser code. Never put passwords, JWT signing secrets, database credentials, or private API keys in these variables.

### Backend

Example `.env`:

```env
MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>
DATABASE_NAME=<YOUR_DATABASE_NAME>
JWT_SECRET=<YOUR_LONG_RANDOM_SECRET>
FRONTEND_ORIGIN=http://localhost:3000
```

Additional variables may be necessary for Google OAuth, AI services, translation services, email notifications, and WebRTC signaling.

The backend must be configured to read these values using its actual configuration code. Do not assume these example names are already supported.

Add `.env`, `.env.local`, and other files containing secrets to `.gitignore`. Commit an `.env.example` file containing only placeholder values instead.

## Running the Application

### Start the backend

Activate the backend virtual environment and run the command appropriate for your FastAPI entry point.

For example, if the application instance is named `app` in `main.py`:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

If your entry point is located elsewhere, update the command accordingly.

The API should then be available at:

```text
http://127.0.0.1:8000
```

### Start the frontend

In a separate terminal:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The frontend should use the configured API base URL when making backend requests.

## API Documentation

FastAPI provides interactive API documentation by default when its documentation endpoints are enabled.

Once the backend is running, open:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
- OpenAPI schema: `http://127.0.0.1:8000/openapi.json`

The actual routes depend on the backend configuration.

### Planned or example API groups

| API group | Purpose |
|---|---|
| `/api/auth` | Registration, login, and authentication |
| `/api/users` | User profile management |
| `/api/patients` | Patient-related operations |
| `/api/doctors` | Doctor profiles and discovery |
| `/api/appointments` | Appointment management |
| `/api/consultations` | Consultation-related operations |
| `/api/medical-records` | Medical record management |
| `/api/prescriptions` | Digital prescriptions |
| `/api/ai` | Symptom collection and summarization |
| `/api/translation` | Translation services |
| `/api/admin` | Administrative workflows |

These are suggested route groups, not a guarantee that every endpoint exists. Verify the available endpoints in the generated API documentation.

## Deployment

### Frontend deployment on Vercel

1. Push the frontend code to GitHub.
2. Open the Vercel dashboard.
3. Import the repository or select the existing project.
4. Set the correct root directory if using a monorepo.
5. Configure the production environment variable for the backend API URL.
6. Deploy the project.
7. Test registration, login, and other frontend workflows.

When environment variables change, redeploy the frontend so the updated values are applied to the build.

### Backend deployment

The FastAPI backend can be deployed to Vercel when compatible with its Python Functions runtime and application requirements.

1. Create or select the backend deployment project.
2. Configure its root directory and Python dependencies.
3. Set the required backend environment variables.
4. Deploy the backend.
5. Open the backend domain's `/docs` endpoint to verify that the API responds.
6. Test a suitable health endpoint if the application implements one.
7. Inspect runtime logs for database or configuration errors.

If the frontend and backend are separate projects, the frontend must use the **backend's** domain as its API base URL, not the frontend's own domain.

Vercel serverless functions have runtime and execution constraints. Evaluate your hosting choice carefully for persistent signaling connections, background tasks, and other long-running services.

### MongoDB Atlas

Keep the database credentials in backend environment variables. Configure network access securely and use a database user with only the permissions the application requires.

### WebRTC deployment considerations

Video consultations may require:
- A signaling mechanism to exchange session information.
- STUN servers for network discovery.
- TURN servers when direct peer-to-peer connections fail.
- Appropriate permissions for camera and microphone access.

HTTPS is generally required for browser camera and microphone access outside localhost.

## Troubleshooting

### Registration displays “The service is temporarily unavailable”

This usually indicates that the registration request failed or the application could not complete it. The message alone does not identify the exact cause.

Follow these checks in order.

**1. Verify the backend URL**

In the frontend's Vercel project:

1. Open **Settings → Environment Variables**.
2. Find the API URL variable used by the frontend.
3. Confirm that its production value points to the deployed backend.
4. Save any necessary changes and redeploy.

**2. Test the backend**

Open these URLs, replacing the example domain with your actual backend domain:

```text
https://YOUR-BACKEND-DOMAIN/docs
https://YOUR-BACKEND-DOMAIN/health
```

The `/docs` route should load if FastAPI documentation is enabled. The `/health` route will work only if you have implemented it.

If the backend is hosted in the same Vercel project as the frontend, determine the correct API route and deployment architecture before assuming a separate domain exists.

**3. Inspect backend logs**

In Vercel, open the backend project and inspect the latest deployment's runtime or function logs. Attempt registration again and check for errors.

Common causes include:

- Incorrect backend URL or API path.
- Missing MongoDB connection string.
- Database authentication or network-access problems.
- Missing JWT configuration.
- CORS rejecting the frontend origin.
- Request-body validation errors.
- A mismatch between frontend and backend registration schemas.
- An exception during password hashing or account creation.

**4. Check the browser's Network panel**

Open the browser's developer tools, select **Network**, submit the registration form, and inspect the failing request.

Useful status codes include:

| Status | What to investigate |
|---|---|
| `404` | Incorrect API path or missing route |
| `422` | Request validation or schema mismatch |
| `401` / `403` | Authentication or permission issue |
| `500` | Backend exception |
| `502` / `503` | Backend availability or deployment problem |
| CORS error | Backend CORS configuration and allowed origin |

The status code is a diagnostic clue, not a definitive explanation.

### CORS configuration

Configure the backend to allow the exact frontend origin used in development and production. For example, the production origin may resemble:

```text
https://your-frontend-domain.vercel.app
```

Use the real domain and the CORS configuration supported by your application. Avoid opening access indiscriminately, especially for an application handling medical information.

### Changes are not reflected after deployment

- Verify that the correct Vercel project and Git branch were deployed.
- Confirm the project's root directory.
- Check the environment variables for the correct deployment environment.
- Redeploy after changing build-time frontend variables.
- Inspect build and runtime logs.

## Security and Privacy

RuralCare is intended to handle sensitive personal and medical information. Before production use:

- Hash passwords using an established password-hashing library.
- Validate user input on the backend.
- Enforce authorization on every protected operation.
- Restrict patients and doctors to records they are authorized to access.
- Protect JWT signing secrets and third-party API credentials.
- Use HTTPS in production.
- Configure CORS for trusted origins.
- Avoid logging passwords, access tokens, or sensitive medical information.
- Use secure session/token handling and appropriate expiration policies.
- Obtain appropriate consent for storing or processing health information.
- Review applicable privacy, security, and healthcare regulations.
- Test authorization boundaries, input validation, and common web vulnerabilities.

A frontend role selector is not an authorization mechanism. The backend must verify a user's permissions independently.

## Medical Safety Disclaimer

RuralCare is a telemedicine software project. AI-assisted symptom collection or summarization must not be presented as a confirmed diagnosis or a substitute for qualified medical advice.

Treatment decisions and prescriptions must remain under the responsibility of appropriately qualified healthcare professionals. The platform should direct users to urgent or emergency care when appropriate and must not delay emergency treatment.

## Future Enhancements

Potential future improvements include:

- More regional languages and accessibility options.
- Better performance on slow internet connections.
- Improved appointment reminders.
- Secure document sharing.
- Enhanced doctor verification workflows.
- Consultation summaries for clinicians.
- Audit logs and additional security testing.
- Automated deployment checks and end-to-end testing.

## Contributing

If you are developing RuralCare with a team:

1. Create a feature branch.
2. Make focused changes.
3. Test the frontend and backend.
4. Keep secrets out of source control.
5. Submit a pull request with a clear description of the changes.

## License

Choose and add an appropriate open-source license before distributing the project publicly. Until a license is added, do not assume that others have permission to reuse or redistribute the source code.

---

**RuralCare — Connecting rural communities with accessible digital healthcare.**
