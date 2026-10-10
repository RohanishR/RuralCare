# Registration deployment diagnosis — 10 October 2026

## What failed

The registration form calls POST /api/v1/auth/register with JSON (name, email, password, role), then POST /api/v1/auth/login with form-encoded username/password.

The deployed origin is https://ruralcare-cyan.vercel.app. GET probes and POST with an empty body returned a Vercel plain-text 500 rather than FastAPI's expected 405/422 JSON. This locates the failure at backend initialization or the deployment runtime, before ordinary registration validation. The pasted Google popup failure is a separate browser/OAuth problem.

Confirmed source defects:

- backend/requirements.txt omitted requests. Both Google auth's requests transport and the imported translation service need it; google-auth without its requests extra does not install it.
- Vercel starts the Python service from backend/. From that directory, the backend package was not importable even though main.py imports backend.*. Added an explicit entrypoint:app shim that supplies the repository parent to Python's import path.
- Local .env loading depended on the working directory. It now resolves backend/.env from the config file location. Vercel still needs its own dashboard variables; ignored local files are not deployed.
- Browser code ignored NEXT_PUBLIC_API_URL, and login duplicated URL selection. Registration and login now use the same configurable client.
- Database startup silently attempted localhost after Atlas failed; this is invalid on Vercel and could mask the actual destination locally. Removed the fallback. Database errors now produce safe 503 responses; configuration errors identify variable names without values.

No Vercel runtime logs or authenticated Vercel configuration were available locally. These reproducible source defects are fixed, but the exact exception in the current deployment cannot be confirmed until the new deployment or its runtime logs can be inspected.

## Required Vercel settings

Use repository root as the project Root Directory. The existing multi-service vercel.json is retained. Select **Services** as the project framework; current Vercel guidance requires Services plus the services key. Backend root remains backend and entry point is entrypoint:app. The /api/* rewrite preserves /api/v1/... paths.

Configure the following variables in Vercel for Production, and separately for any Preview deployment you want to test:

| Variable | Required value |
| --- | --- |
| MONGODB_URI | Full MongoDB Atlas connection string, including database credentials. Backend only; never NEXT_PUBLIC. |
| DATABASE_NAME | Existing application's database name; use the same name as the intended deployed database. |
| SECRET_KEY | Existing strong JWT signing secret. Backend only. |
| FRONTEND_URL | https://ruralcare-cyan.vercel.app (exact origin, without a path). |
| ACCESS_TOKEN_EXPIRE_MINUTES | Existing desired token lifetime; default 60. |
| NEXT_PUBLIC_API_URL | /api/v1 for this single-domain Services deployment. An explicit separate-backend URL must include /api/v1. Rebuild after changes. |
| NEXT_PUBLIC_GOOGLE_CLIENT_ID | Google web OAuth client ID. |
| GOOGLE_CLIENT_ID | Same client ID, on the backend, used for audience verification. |

BACKEND_URL is supplied by the existing Vercel service binding. Do not manually put its internal URL in a NEXT_PUBLIC variable. MONGODB_USERNAME and MONGODB_PASSWORD alone are not consumed: the complete MONGODB_URI is required.

MongoDB Atlas must authorize the database user and the deployment's network route. Use the appropriate approved network configuration for that deployment; TLS validation remains enabled.

Redeploy after updating variables and applying this commit. Confirm /api/v1/auth/register returns 422 for an empty JSON object and OPTIONS returns Access-Control-Allow-Origin matching FRONTEND_URL. Then run the live registration check against the deployed origin with its matching database configuration.

Official deployment references:

- https://vercel.com/docs/services
- https://vercel.com/docs/frameworks/backend/fastapi
- https://vercel.com/kb/guide/vercel-services

## Verification completed

- Entry point successfully imported from backend/ without relying on a repository-root working directory.
- 18 backend tests passed: registration schema/role checks, duplicate race, password hashing, JWT signing, database 503, safe 500/logging, CORS and existing authorization tests. A separate process imports the Vercel entry point from the service directory and confirms preflight allows the exact production frontend origin.
- Explicit live test used the actual configured MongoDB (no mocked storage): registration 200, inserted user found by its generated email/id, password hash verified, login 200, signed JWT verified.
- One synthetic account was retained: ruralcare-registration-qa-131fb35ce8824708beba76ba3b85dca6@example.com. Its generated password and JWT were never printed or saved in documentation.
- Targeted frontend lint passed with two existing image optimization warnings. TypeScript passed.
- Production Next.js build passed. Four API-client tests passed for URL selection, form login, 404/422/503 messaging, non-JSON 500 and network failures.

Run isolated tests:

    python -B -m unittest discover -s backend/tests -v
    node --test tests/api-client.test.cjs
    npm run build

Run explicit live Mongo verification (creates a synthetic account, retains it, and prints no credentials):

    python -B -m backend.tests.verify_registration_live

To test the deployed API and verify its database record, configure the matching database/signing environment securely and run:

    python -B -m backend.tests.verify_registration_live --base-url https://ruralcare-cyan.vercel.app

The live deployed registration remains unverified because the current remote deployment still returns 500 and cannot be redeployed from this workspace without authenticated Vercel access.

## Error handling

404 explains that the endpoint was not found. 422 identifies invalid registration fields without echoing input values. Platform 500 (including non-JSON errors), network failures, timeouts and database 503 have safe messages. Registration that succeeds but whose automatic login fails explicitly tells the user the account exists.

Registration logs contain only request reference, processing stage and exception class. They never include request bodies, email addresses, passwords, hashes, JWTs, database URIs or medical data.

For Google sign-in, add the production origin as an authorized JavaScript origin in the Google web OAuth client and allow the account popup in the browser. The pasted popup error does not establish the cause of the separate email-registration 500.
