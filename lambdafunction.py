from sqlalchemy import create_engine, Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship, Session
from sqlalchemy.ext.declarative import declarative_base

# Define the database connection parameters for Amazon RDS PostgreSQL
DB_CONFIG = {
    "drivername": "postgresql",
    "username": "masterusername",
    "password": "master123",
    "host": "newdatabase.c4tkhrudtu8f.us-east-1.rds.amazonaws.com",
    "port": "5432",
    "database": "newnamedb",
}

# Create an SQLAlchemy engine
engine = create_engine(f"{DB_CONFIG['drivername']}://{DB_CONFIG['username']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}")

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for declarative models
Base = declarative_base()

# Define the AllBooks model
class AllBooks(Base):
    __tablename__ = "allbooks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    no_of_copies = Column(Integer)
    status = Column(Enum("available", "allocated", "blocked"))
    allocated_to_user_id = Column(Integer, ForeignKey("allbooks.id"), nullable=True)

    # Define the relationship for allocated user
    allocated_user = relationship("AllBooks", remote_side=[id])

# CRUD operations...
def create_book(db: Session, book: AllBooks):
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

def get_book(db: Session, book_id: int):
    return db.query(AllBooks).filter(AllBooks.id == book_id).first()

def get_books(db: Session, skip: int = 0, limit: int = 10):
    return db.query(AllBooks).offset(skip).limit(limit).all()

def update_book(db: Session, book_id: int, book: AllBooks):
    db_book = db.query(AllBooks).filter(AllBooks.id == book_id).first()
    for attr, value in book.__dict__.items():
        if attr != "_sa_instance_state":
            setattr(db_book, attr, value)
    db.commit()
    db.refresh(db_book)
    return db_book

def delete_book(db: Session, book_id: int):
    book = db.query(AllBooks).filter(AllBooks.id == book_id).first()
    if book:
        db.delete(book)
        db.commit()
        return True
    return False