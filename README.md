# Hackathon2025

## Backend setup

1. Copy `.env.example` to `.env` (already prefilled with local defaults) and update the database credentials/port as needed.
2. Ensure PostgreSQL is running and accessible via the values in `.env`.
3. Apply the database schema:
   ```bash
   npm run db:schema
   ```
4. (Optional, but recommended) Seed the database with sample users/items/exchange requests so the profile + notification UI has data to display:
   ```bash
   npm run db:seed
   ```
5. Start the API server:
   ```bash
   npm run server
   ```
6. Test the API:
   - Profile overview: `GET http://localhost:4000/api/profiles/:id`
   - Notifications feed: `GET http://localhost:4000/api/profiles/:id/notifications`
   - Accept a notification (owner only): `POST http://localhost:4000/api/profiles/:id/notifications/:notificationId/accept`
   - Reject a notification: `POST http://localhost:4000/api/profiles/:id/notifications/:notificationId/reject`
   - Confirm completion (requester w/ code): `POST http://localhost:4000/api/profiles/:id/notifications/:notificationId/complete` with `{ "code": "XC-123456" }`
   - Create a new exchange request + email alert: `POST http://localhost:4000/api/profiles/:id/notifications` with
     ```json
     {
       "requesterId": 2,
       "itemId": 1,
       "message": "text",
       "offer": {
         "title": "My Item",
         "category": "books",
         "condition": "good"
       }
     }
     ```

The server responds with the updated notification payload so the frontend can refresh state without extra queries.

### SMTP configuration

To send real email alerts via Nodemailer, set the following variables in `.env`:

```
SMTP_HOST=smtp.mail.cmu.ac.th
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_username
SMTP_PASS=your_password
SMTP_FROM_EMAIL="CMU ShareCycle <noreply@cmu.ac.th>"
```

If these values are missing, the server will log a warning and skip email delivery (useful for local development).

## Frontend setup

1. Install deps (first time only):
   ```bash
   cd frontend
   npm install
   ```
2. (Optional) create `frontend/.env` and set:
   ```
   VITE_API_URL=http://localhost:4000/api
   VITE_ACTIVE_PROFILE_ID=1
   ```
   Adjust the profile ID if you want to load a different user.
3. Run the Vite dev server:
   ```bash
   npm run dev
   ```
4. Log in via the mock UI and open the Profile/Notifications dropdown to see live data coming from PostgreSQL.

Adjust the port by editing `PORT` in `.env`. Use `DB_SSL=true` for managed Postgres services that require TLS.
