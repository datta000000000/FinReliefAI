# FinRelief AI Backend Foundation

**AI-Powered Debt Relief & Financial Recovery Platform**

This is the modular, clean, and scalable backend foundation for FinRelief AI, built with FastAPI, SQLAlchemy, and SQLite. It implements standard security protocols, JWT-based authentication, and full CRUD API operations for Users, Loans, and Financial Profiles, structured according to Clean Architecture principles.

---

## Technical Stack

- **Framework**: FastAPI
- **Database Engine**: SQLAlchemy ORM with SQLite
- **Authentication**: JWT (JSON Web Tokens), Passlib (bcrypt hashing)
- **Data Validation**: Pydantic v2
- **Server**: Uvicorn

---

## Directory Structure

```text
backend/
│
├── app/
│   ├── api/             # API routes (Users, Loans, Profiles CRUD)
│   ├── auth/            # JWT authentication, security functions & dependencies
│   ├── core/            # Configuration management (Pydantic Settings)
│   ├── database/        # Database session and connection setup
│   ├── models/          # SQLAlchemy database models
│   ├── schemas/         # Pydantic data serialization & validation schemas
│   ├── services/        # Business logic & database operations layers
│   ├── utils/           # Utilities and helpers (empty placeholder)
│   ├── calculations/    # Financial calculation engine (empty placeholder)
│   ├── ai/              # AI/Gemini integration modules (empty placeholder)
│   └── main.py          # Application entrypoint & global configuration
│
├── .env.example         # Template for environment settings
├── requirements.txt     # Backend python dependencies
└── README.md            # Technical documentation
```

---

## Installation & Setup

### 1. Prerequisites
- Python 3.11 or higher installed on your system.

### 2. Configure Environment Variables
Copy `.env.example` to create a real `.env` file inside the `backend/` directory:
```bash
cp .env.example .env
```
Open the `.env` file and adjust the keys if necessary:
- `DATABASE_URL`: Path to SQLite database file (defaults to `sqlite:///./finrelief.db`).
- `JWT_SECRET`: Random long string for encryption signing.
- `JWT_ALGORITHM`: Algorithmic protocol used to sign token (defaults to `HS256`).
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Expiry duration for authentication token (defaults to `30`).

### 3. Install Dependencies
Run the command below inside the `backend/` directory to download all package dependencies:
```bash
pip install -r requirements.txt
```

### 4. Run the Server
Launch the development server using Uvicorn:
```bash
uvicorn app.main:app --reload
```
Once initialized, the app runs at `http://127.0.0.1:8000`.

---

## API Documentation & Testing

### Swagger Interactive Documentation
FastAPI automatically serves interactive API docs. You can access them at:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

> [!NOTE]
> To test protected API routes in Swagger UI, register a user first, click on the **Authorize** lock button, input your username (email) and password under the `/auth/swagger-login` flow, click authorize, and proceed to execute endpoints.

---

## Response Envelope Format

All responses follow the consistent format specified below.

### Successful Response
```json
{
    "success": true,
    "message": "Resource details fetched successfully",
    "data": {
        "user_id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com"
    }
}
```

### Validation or Request Errors
```json
{
    "success": false,
    "message": "Validation Error",
    "errors": [
        "body.email: value is not a valid email address",
        "body.password: Password must be at least 8 characters long"
    ]
}
```

---

## Key Core Modules

1. **Authentication (`app/auth/`)**: Handles secure registration, passwords hashed with `bcrypt`, JWT access token issuance, and current user validation dependencies.
2. **Database Models (`app/models/`)**: Structured schemas representing the database entities `User`, `Loan`, `FinancialProfile`, `SettlementRecord`, and `AIHistory`.
3. **Pydantic Validation (`app/schemas/`)**: Strict schemas to validate emails, minimum password lengths, and enforce positive numbers for all financial amounts (EMI, income, expenses).
4. **Thin Controllers & Services (`app/api/` & `app/services/`)**: Routes only handle API parameter extraction and envelope responses. All database transactions and calculations reside in Services.
