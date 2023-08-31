import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Components/layout';
import styles from '../MainPages/mainpages.module.css';
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import AddNewBook from '../Components/AddNewBook';


interface Book {
  author: string;
  book_id: number;
  no_of_available_copies: number;
  title: string;
  total_copies: number;
}

const AllBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    no_of_available_copies: 0,
    total_copies: 0,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      no_of_available_copies: book.no_of_available_copies,
      total_copies: book.total_copies,
    });
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (selectedBook) {
      try {
        await axios.put(`http://127.0.0.1:5000/books/${selectedBook.book_id}`, formData);
        setEditing(false);
        setSelectedBook(null);
        setFormData({
          title: '',
          author: '',
          no_of_available_copies: 0,
          total_copies: 0,
        });
        fetchBooks();
      } catch (error) {
        console.error('Error updating book:', error);
      }
    }
  };

  const handleDelete = async (bookId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    
    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:5000/books/${bookId}`);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };
  
  const handleCloseEdit = () => {
    setEditing(false);
    setSelectedBook(null);
    setFormData({
      title: '',
      author: '',
      no_of_available_copies: 0,
      total_copies: 0,
    });
  };

  const handleConfirmAddBook = async (formState: any) => {
    console.log(formState)
    try {
      await axios.post('http://127.0.0.1:5000/books', formState).then((res)=>{
        console.log(res)
      })
      setFormData({
        title: '',
        author: '',
        no_of_available_copies: 0,
        total_copies: 0,
      });
      fetchBooks();
      setAdding(false); 
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleCancelAddBook = () => {
    setAdding(false); 
  };

  const handleAddBook = () => {
    setAdding(true); 
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.align}>
          <h2>Books Details</h2>
          <button onClick={handleAddBook}>Add book</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>BookID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Available Copies</th>
              <th>Total Copies</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.book_id}>
                <td>{book.book_id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.no_of_available_copies}</td>
                <td>{book.total_copies}</td>
                <td className={styles.fit}>
                  <span className={styles.actions}>
                    <BsFillPencilFill onClick={() => handleEdit(book)}/>
                    <BsFillTrashFill onClick={() => handleDelete(book.book_id)}/>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {adding && (
          <AddNewBook closeModal={() => setAdding(false)} onSubmit={handleConfirmAddBook} />
        )}
        {editing && (
          <div className={styles.modalContainer}>
            <div className={styles.modal}>
              <h2>Edit Book</h2>
              <form>
                <div className={styles.formGroup}>
                  <label htmlFor="user_id">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Title"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="user_id">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="user_id">Available Copies</label>
                  <input
                    type="number"
                    name="no_of_available_copies"
                    value={formData.no_of_available_copies}
                    onChange={(e) =>
                      setFormData({ ...formData, no_of_available_copies: +e.target.value })
                    }
                    placeholder="No. of Available Copies"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="user_id">Total Copies</label>
                  <input
                    type="number"
                    name="total_copies"
                    value={formData.total_copies}
                    onChange={(e) => setFormData({ ...formData, total_copies: +e.target.value })}
                    placeholder="Total Copies"
                  />
                </div>
                <div className="actions">
                  <button className={styles.btn} onClick={handleSaveEdit}>Save changes</button>
                  <button className={styles.cancelBtn} onClick={handleCloseEdit}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllBooks;
