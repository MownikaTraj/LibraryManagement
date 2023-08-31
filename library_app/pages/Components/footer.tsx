import React from 'react';
import '../index';
import styles from './components.module.css';


const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>Copyright &copy; LibraryManagementSystem.com</p>
    </footer>
  );
}

export default Footer;
