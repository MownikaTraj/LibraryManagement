import React from 'react';
import Link from 'next/link';
import styles from './components.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
      <li className={styles.navItem}>
          <Link href="/">Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="../MainPages/allbooks">All Books</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="../MainPages/allocationtab">Allocation Tab</Link>
        </li>
        {/* <li className={styles.navItem}>
          <Link href="../MainPages/users">Users</Link>
        </li> */}
      </ul>
    </nav>
  );
}

export default Navbar;
