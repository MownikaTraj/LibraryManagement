import React, { useState } from "react";
import styles from "./components.module.css";

interface NewBookFormProps {
  closeModal: () => void;
  onSubmit: (formData: any) => void;
}

const AddNewBook: React.FC<NewBookFormProps> = ({ closeModal, onSubmit }) => {
  const [formState, setFormState] = useState({
    title: "",
    author: "",
    no_of_available_copies: 0,
    total_copies: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formState);
    closeModal();
  };
  const handleCancel = () => {
    closeModal();
  };

  return (
    <div
      className={styles.modalContainer}
    >
      <div className={styles.modal}>
        <form onSubmit={(e)=>handleSubmit(e)}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              name="title"
              onChange={(e) => handleChange(e)}
              value={formState.title}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="author">Author</label>
            <input
              name="author"
              onChange={(e) => handleChange(e)}
              value={formState.author}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="no_of_available_copies">Available Copies</label>
            <input
              type="number"
              name="no_of_available_copies"
              onChange={(e) => handleChange(e)}
              value={formState.no_of_available_copies}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="total_copies">Total Copies</label>
            <input
              type="number"
              name="total_copies"
              onChange={(e) => handleChange(e)}
              value={formState.total_copies}
            />
          </div>
            <input type="submit" className={styles.btn} />
            <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddNewBook;
