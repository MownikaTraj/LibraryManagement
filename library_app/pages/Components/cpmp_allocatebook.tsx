import React, { useState, useEffect } from "react";
import styles from "./components.module.css";
import axios from "axios";

interface AllocationFormProps {
  closeModal: () => void;
  onSubmit: (formData: any) => void;
}

const AddNewAllocation: React.FC<AllocationFormProps> = ({ closeModal, onSubmit }) => {
  const [formState, setFormState] = useState({
    user_id: 0,
    user_name: "",
    book_id: 0,
    title: "",
  });

  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  const handleUserChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const user_id = parseInt(e.target.value);

    try {
      const response = await axios.get(`http://127.0.0.1:5000/users/${user_id}`);
      console.log("User response data:", response.data);

      setFormState(prevState => ({
        ...prevState,
        user_id,
        user_name: response.data.user_name,
      }));
      clearValidationMessages();
    } catch (error) {
      console.error("Error fetching user data:", error);
      setValidationMessages(["User not found"]);
    }
  };
  
  
  const handleBookChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const book_id = parseInt(e.target.value);

    try {
      const response = await axios.get(`http://127.0.0.1:5000/books/${book_id}`);
      if (response.data.book_id && response.data.title) {
        setFormState({
          ...formState,
          book_id,
          title: response.data.title,
        });
        clearValidationMessages();
        if (response.data.no_of_available_copies <= 0) {
          setValidationMessages(["No available copies of the book"]);
        }
      } else {
        setFormState({
          ...formState,
          book_id,
          title: "Book not found",
        });
        setValidationMessages(["Book not found"]);
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
      setValidationMessages(["Book not found"]);
    }
  };

  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validationMessages.length === 0) {
      onSubmit(formState);
      closeModal();
    }
  };

  const handleCancel = () => {
    closeModal();
  };
  const clearValidationMessages = () => {
    setValidationMessages([]);
  };

  

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <form onSubmit={(e)=>handleSubmit(e)}>
          <div className={styles.formGroup}>
            <label htmlFor="user_id">User ID</label>
            <input
              type="number"
              name="user_id"
              onChange={(e)=>handleUserChange(e)}
              value={formState.user_id}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="user_name">User Name</label>
            <input
              type="text"
              name="user_name"
              readOnly
              value={formState.user_name}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="book_id">Book ID</label>
            <input
              type="number"
              name="book_id"
              onChange={(e)=>handleBookChange(e)}
              value={formState.book_id}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="title">Book Title</label>
            <input
              type="text"
              name="title"
              readOnly
              value={formState.title}
            />
          </div>
          {validationMessages.length > 0 && (
            <div className={styles.validationMessages}>
              {validationMessages.map((message, index) => (
                <p key={index} className={styles.validationMessage}>
                  {message}
                </p>
              ))}
            </div>
          )}
          <input type="submit" className={styles.btn} />
          <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewAllocation;
