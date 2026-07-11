from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Setup SQLite connection arguments if sqlite is used
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL, connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def sync_database_schema():
    """
    Checks if columns (mobile_number, profile_image, country, occupation) 
    exist in the SQLite 'users' table, and adds them safely if not.
    Preserves all existing data.
    """
    from sqlalchemy import text
    try:
        with engine.begin() as conn:
            # Check existing columns in 'users' table
            result = conn.execute(text("PRAGMA table_info(users)"))
            columns = [row[1] for row in result.fetchall()]
            
            columns_to_add = {
                "mobile_number": "VARCHAR",
                "profile_image": "VARCHAR",
                "country": "VARCHAR",
                "occupation": "VARCHAR",
                "is_mobile_verified": "BOOLEAN DEFAULT 0"
            }
            
            for col_name, col_type in columns_to_add.items():
                if col_name not in columns:
                    print(f"Adding column {col_name} to users table...")
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
    except Exception as e:
        print(f"Error during schema sync: {e}")

