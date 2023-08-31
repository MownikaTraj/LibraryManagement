import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Components/layout';
import styles from '../MainPages/mainpages.module.css';
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import AddNewAllocation from '../Components/cpmp_allocatebook'; 
import Moment from 'moment'; 


interface Allocation {
  allocation_id: number;
  user_id: number;
  user_name: string;
  book_id: number;
  title: string;
  allocationdate: string; 
}

const AllocationTab: React.FC = () => {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [allocating, setAllocating] = useState(false);

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/allocations_info'); 
      console.log(response.data);
      setAllocations(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAllocateBook = () => {
    setAllocating(true);
  };

  const handleCancelAllocate = () => {
    setAllocating(false);
  };

  const handleConfirmAllocateBook = async (formData: any) => {
    try {
      await axios.post('http://127.0.0.1:5000/allocate_book', formData); 
      setAllocating(false); 
      fetchAllocations();
    } catch (error) {
      console.error('Error allocating book:', error);
    }
  };
  

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.align}>
          <h2>Allocation Details</h2>
          <button onClick={handleAllocateBook}>Allocate Book</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>AllocationID</th>
              <th>User ID</th>
              <th>UserName</th>
              <th>Book ID</th>
              <th>BookName</th>
              <th>Allocation Date</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map(allocation => (
              <tr key={allocation.allocation_id}>
                <td>{allocation.allocation_id}</td>
                <td>{allocation.user_id}</td>
                <td>{allocation.user_name}</td>
                <td>{allocation.book_id}</td>
                <td>{allocation.title}</td>
                <td>{Moment(allocation.allocationdate).format('DD-MM-YYYY')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {allocating && (
          <AddNewAllocation closeModal={handleCancelAllocate} onSubmit={handleConfirmAllocateBook} />
        )}
      </div>
    </Layout>
  );
};

export default AllocationTab;
