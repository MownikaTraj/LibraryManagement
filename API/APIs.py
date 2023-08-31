import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy import func

app = Flask(__name__)
CORS(app)

# Define your MySQL database connection URL
DATABASE_URL = "mysql+pymysql://yourRDSInfo"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Book(Base):
    __tablename__ = "mon_books"

    book_id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    no_of_available_copies = Column(Integer)
    total_copies = Column(Integer)

class User(Base):
    __tablename__ = "mon_users"

    user_id = Column(Integer, primary_key=True, index=True)
    Name = Column(String)

class BookAllocation(Base):
    __tablename__ = "mon_book_alloc"

    allocated_id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey('mon_books.book_id'))
    user_id = Column(Integer, ForeignKey('mon_users.user_id'))
    allocationdate = Column(DateTime, default=datetime.now)

    book = relationship("Book")
    user = relationship("User")

@app.route("/books", methods=["GET"])
def get_books():
    db = SessionLocal()
    books = db.query(Book).all()
    db.close()
    book_list = [{"book_id": book.book_id, "title": book.title, "author": book.author, "no_of_available_copies": book.no_of_available_copies, "total_copies": book.total_copies} for book in books]
    return jsonify(book_list)

def get_book(book_id):
    db = SessionLocal()
    book = db.query(Book).filter(Book.book_id == book_id).first()
    db.close()

    if book:
        book_data = {
            "book_id": book.book_id,
            "title": book.title,
            "author": book.author,
            "no_of_available_copies": book.no_of_available_copies,
            "total_copies": book.total_copies
        }
        return jsonify(book_data)
    else:
        return jsonify({"message": "Book not found"}), 404

@app.route("/books/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    db = SessionLocal()
    book = db.query(Book).filter(Book.book_id == book_id).first()
    
    if not book:
        db.close()
        return jsonify({"message": "Book not found"}), 404
    
    data = request.get_json()
    for attr, value in data.items():
        setattr(book, attr, value)
    
    db.commit()
    db.close()
    return jsonify({"message": "Book updated successfully"})

@app.route("/books/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    db = SessionLocal()
    book = db.query(Book).filter(Book.book_id == book_id).first()
    
    if not book:
        db.close()
        return jsonify({"message": "Book not found"}), 404
    
    db.delete(book)
    db.commit()
    db.close()
    return jsonify({"message": "Book deleted successfully"})

@app.route("/book_counts", methods=["GET"])
def get_book_counts():
    db = SessionLocal()
    
    available_books = db.query(func.sum(Book.no_of_available_copies)).scalar()
    allocated_books = db.query(BookAllocation).count()
    total_books = db.query(func.sum(Book.total_copies)).scalar()

    db.close()

    counts = {
        "available_books": available_books,
        "allocated_books": allocated_books,
        "total_books": total_books
    }
    
    return jsonify(counts)

@app.route("/books", methods=["POST"])
def create_book():
    data = request.get_json()
    new_book = Book(
        title=data["title"],
        author=data["author"],
        no_of_available_copies=data["no_of_available_copies"],
        total_copies=data["total_copies"]
    )
    db = SessionLocal()
    db.add(new_book)
    db.commit()
    db.close()
    return jsonify({"message": "Book created successfully"})

@app.route("/allocations_info/<int:allocation_id>", methods=["GET"])
def get_allocation(allocation_id):
    db = SessionLocal()
    allocation = db.query(BookAllocation).filter(BookAllocation.allocated_id == allocation_id).first()
    db.close()

    if allocation:
        allocation_data = {
            "allocation_id": allocation.allocated_id,
            "allocationdate": allocation.allocationdate,
            "user_id": allocation.user_id,
            "user_name": allocation.user.Name,
            "book_id": allocation.book_id,
            "title": allocation.book.title
        }
        return jsonify(allocation_data)
    else:
        return jsonify({"message": "Allocation not found"}), 404


@app.route("/allocations_info", methods=["GET"])
def get_allocations_info():
    db = SessionLocal()
    allocations_info = db.query(BookAllocation.allocated_id, BookAllocation.allocationdate, User.user_id, User.Name, Book.book_id, Book.title).join(User).join(Book).all()
    db.close()
    allocation_info_list = [{"allocation_id": info.allocated_id,"allocationdate": info.allocationdate , "user_id": info.user_id, "user_name": info.Name, "book_id": info.book_id, "title": info.title} for info in allocations_info]
    return jsonify(allocation_info_list)

@app.route("/allocate_book", methods=["POST"])
def allocate_book():
    data = request.get_json()

    # Extract data from the request
    user_id = data.get("user_id")
    book_id = data.get("book_id")

    # Check if the user and book exist
    db = SessionLocal()
    user = db.query(User).filter(User.user_id == user_id).first()
    book = db.query(Book).filter(Book.book_id == book_id).first()

    if not user:
        db.close()
        return jsonify({"message": "User not found"}), 404

    if not book:
        db.close()
        return jsonify({"message": "Book not found"}), 404
    
    if book.no_of_available_copies <= 0:
        db.close()
        return jsonify({"message": "No available copies of the book"}), 400

    # Decrement the no_of_available_copies by 1
    book.no_of_available_copies -= 1

    # Create a new book allocation
    new_allocation = BookAllocation(book_id=book_id, user_id=user_id)
    db.add(new_allocation)
    db.commit()
    db.close()

    return jsonify({"message": "Book allocated successfully"})


@app.route("/allocations_info/<int:allocation_id>", methods=["PUT"])
def update_allocation(allocation_id):
    data = request.get_json()
    db = SessionLocal()
    allocation = db.query(BookAllocation).filter(BookAllocation.allocated_id == allocation_id).first()
    if allocation:
        setattr(allocation, "book_id", data["book_id"])
        setattr(allocation, "user_id", data["user_id"])
        db.commit()
        db.close()
        return jsonify({"message": "Allocation updated successfully"})
    else:
        return jsonify({"message": "Allocation not found"}), 404
    
@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    db = SessionLocal()
    user = db.query(User).filter(User.user_id == user_id).first()
    db.close()

    if user:
        user_data = {
            "user_id": user.user_id,
            "user_name": user.Name
        }
        return jsonify(user_data)
    else:
        return jsonify({"message": "User not found"}), 404

# AWS Lambda handler
def lambda_handler(event, context):
    try:
        # Routing
        if event['httpMethod'] == 'OPTIONS':
            # Handle CORS preflight
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                },
                'body': json.dumps({}),
            }
        elif event['httpMethod'] == 'GET':
            # Call the appropriate route function
            if event['path'] == '/books':
                return get_books()
            elif event['path'].startswith('/books/'):
                book_id = int(event['path'].split('/')[-1])
                return get_book(book_id)
            elif event['path'] == '/book_counts':
                return get_book_counts()
            elif event['path'].startswith('/allocations_info/'):
                allocation_id = int(event['path'].split('/')[-1])
                return get_allocation(allocation_id)
            elif event['path'].startswith('/users/'):
                user_id = int(event['path'].split('/')[-1])
                return get_user(user_id)
            # ... Add more route checks for other GET requests
        elif event['httpMethod'] == 'POST':
            if event['path'] == '/books':
                return create_book()
            elif event['path'] == '/allocate_book':
                return allocate_book()
            # ... Add more route checks for other POST requests
        elif event['httpMethod'] == 'PUT':
            if event['path'].startswith('/books/'):
                book_id = int(event['path'].split('/')[-1])
                return update_book(book_id)
            elif event['path'].startswith('/allocations_info/'):
                allocation_id = int(event['path'].split('/')[-1])
                return update_allocation(allocation_id)
            # ... Add more route checks for other PUT requests
        elif event['httpMethod'] == 'DELETE':
            if event['path'].startswith('/books/'):
                book_id = int(event['path'].split('/')[-1])
                return delete_book(book_id)
            # ... Add more route checks for other DELETE requests
        
        # Handle unsupported methods
        return {
            'statusCode': 405,
            'body': json.dumps({'message': 'Method not allowed'}),
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'}),
        }

if __name__ == "__main__":
    app.run(debug=True)
