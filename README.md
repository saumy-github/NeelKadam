# PS-25038: Blockchain-Based Blue Carbon Registry and MRV System

This README provides an overview of the project, including team details, relevant links, tasks completed, tech stack, key features, and steps to run the project locally.

## Team Details

**Team Name:** NEELKADAM

**Team Leader:** @saumy-github

**Team Members:**

- Saumy - 2024UCA1877 - @saumy-github
- Ridhima - 2024UEE4055 - @ridhimagoel67-hue
- Somil - 2024UEE4076 - @somil09-arc
- Tanuj - 2024UCA1850 - @tanuj403719
- Vibhash - 2024UEE4075 - @vibhash2006
- Yukti - 2024UCA1827 - @yukti19

## Project Links

- **SIH Presentation:** https://github.com/saumy-github/SIH_2025/blob/main/file/Internal_PPT_NeelKadam.pdf
- **Video Demonstration:** https://youtu.be/kpIlNnXLj7k
- **Live Deployment:** https://sih-2025-lyart.vercel.app
- **Source Code:** https://github.com/saumy-github/SIH_2025
- **Additional Resources:** NA

## Local Installation Guide 

### Required Software
1. **Node.js** (v16 or higher)
2. **PostgreSQL** (v12 or higher)
3. **Git**
4. **MetaMask Browser Extension** (for blockchain features)
5. **pgAdmin 4** (for database management)

## Initial Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/saumy-github/SIH_2025.git
```

---
## Database Configuration

### Step 1: Create PostgreSQL Database

Open your PostgreSQL command line interface (psql):

```sql
-- Connect as postgres user
psql -U postgres

-- Create the database
CREATE DATABASE sih_db;

-- Create a user for the application
use defauly user 'postgres'  WITH PASSWORD 'root';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE sih_db TO postgres;

-- Exit psql
\q
```

### Step 2: Import Database Schema

```bash
# Navigate to backend directory
cd backend

# Import the database schema
psql -U sih_user -d sih_db -f database_schema/database_schema_1.sql
```

If you encounter permission issues, try:

```bash
psql -U postgres -d sih_db -f database_schema/database_schema_1.sql
```
#### Optional: Run the schema from VS Code

You can run the same SQL file directly from VS Code in two ways:

Option A — Integrated terminal (requires psql in PATH)
1. Open VS Code in the project root.
2. Open Terminal → New Terminal.
3. Run the same psql command:

```bash
# from project root
cd backend
psql -U sih_user -d sih_db -f database_schema/database_schema_1.sql
```

Option B — Use a VS Code SQL extension (recommended for GUI)
1. Install an extension such as "SQLTools" + "SQLTools PostgreSQL/Redshift Driver" or "PostgreSQL" extension.
2. Create a new connection with:
   - Host: localhost
   - Port: 5432
   - User: (your postgres user, eg. postgres)
   - Password: (your postgres password, eg. root)
   - Database: sih_db
3. Open `backend/database_schema/database_schema_1.sql` in the editor.
4. Use the extension's "Run Query" / "Execute" command to run the file (or select the SQL and run).

Notes:
- Ensure PostgreSQL server is running and your user has permission to create/modify tables.
- If using the `postgres` superuser, run the schema import as `postgres` or grant privileges to the app user first.
---

## Backend Setup

### Step 1: Install Backend Dependencies

```bash
# Make sure you're in the backend directory
cd backend

# Install dependencies
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Create .env file
touch .env
```

copy and paste the content from `backend/.env.xample`:
use the values in paranthesis() if using same names

### Step 3: Start Backend Server

```bash
# Start the backend server
npm start
```

You should see:

```
Server is running on http://localhost:3000
✅ Connected to PostgreSQL database: sih_db
✅ Database connection test successful
```

**Keep this terminal open** - the backend server needs to run continuously.

---

## Frontend Setup

### Step 1: Install Frontend Dependencies

Open a **new terminal window** and navigate to the frontend directory:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Step 2: Start Frontend Development Server

```bash
# Start the frontend server
npm run dev
```

You should see:

```
VITE v4.x.x ready

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Keep this terminal open** - the frontend server needs to run continuously.