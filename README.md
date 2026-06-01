# Inventory & Order Management System

A full-stack application for managing products, customers, and orders.

## Technologies
- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Axios, Lucide React
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose

## Features
- **Product Management:** Create, Read, Update, Delete products with unique SKUs and stock tracking.
- **Customer Management:** Manage customers with unique email validation.
- **Order Management:** Place orders, preventing creation if stock is insufficient. Automatically reduces product stock.
- **Transactions:** Ensures data consistency when placing orders.

## Getting Started

### Using Docker Compose (Recommended)

1. Ensure Docker and Docker Compose are installed on your machine.
2. Clone or open this repository.
3. In the root directory (where `docker-compose.yml` is located), run:

```bash
docker-compose up --build
```

4. The application will be available at:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
   - Database: PostgreSQL on port `5432`


### Running Locally (Without Docker)

You will need an active PostgreSQL instance.

#### 1. Backend
```bash
cd backend
python -m venv venv
# Activate the venv (e.g. `.\venv\Scripts\activate` on Windows, `source venv/bin/activate` on Mac/Linux)
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory and add your `DATABASE_URL`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```

#### 2. Frontend
```bash
cd frontend
npm install
npm install tailwindcss postcss autoprefixer react-router-dom axios lucide-react
npm run dev
```
The frontend will start on `http://localhost:5173`. Make sure the `VITE_API_URL` points to `http://localhost:8000`.

## Deployment Ready

- **Frontend:** Can be deployed to Vercel/Netlify. Configure `VITE_API_URL` to point to the remote backend URL.
- **Backend:** Can be deployed to Render/Railway. Set the `DATABASE_URL` appropriately. Uses a Python Slim Docker image for minimal footprint.
