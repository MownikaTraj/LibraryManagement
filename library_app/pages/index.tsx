import React, { useState, useEffect } from 'react';
import Footer from './Components/footer';
import Navbar from './Components/navbar';
import Header from './Components/header';
import axios from 'axios';

const HomePage: React.FC = () => {
  const [availableBooksCount, setAvailableBooksCount] = useState(0);
  const [allocatedBooksCount, setAllocatedBooksCount] = useState(0);
  const [totalBooksCount, setTotalBooksCount] = useState(0);

  useEffect(() => {
    fetchBookCounts();
  }, []);

  const fetchBookCounts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/book_counts');
      setAvailableBooksCount(response.data.available_books);
      setAllocatedBooksCount(response.data.allocated_books);
      setTotalBooksCount(response.data.total_books);
    } catch (error) {
      console.error('Error fetching book counts:', error);
    }
  };

  return (
    <div>
      <Header />  
      <Navbar />
      <div className="image-container">
        <div className="stat-card">
          <h2>Available Books</h2>
          <p className="count">{availableBooksCount}</p>
        </div>
        <div className="stat-card">
          <h2>Allocated Books</h2>
          <p className="count">{allocatedBooksCount}</p>
        </div>
        <div className="stat-card">
          <h2>Total Books</h2>
          <p className="count">{totalBooksCount}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
