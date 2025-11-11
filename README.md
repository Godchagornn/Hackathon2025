# Hackathon2025

## Backend setup

1. Copy `.env.example` to `.env` (already prefilled with local defaults) and update the database credentials/port as needed.
2. Ensure PostgreSQL is running and accessible via the values in `.env`.
3. Apply the database schema:
   ```bash
   npm run db:schema
   ```
4. Start the API server:
   ```bash
   npm run server
   ```
5. Test the profile endpoint at `GET http://localhost:4000/api/profiles/:id`.

Adjust the port by editing `PORT` in `.env`. Use `DB_SSL=true` for managed Postgres services that require TLS.
