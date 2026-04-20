import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <span>YT</span> Clone
      </div>
    </nav>
  );
};

export default Navbar;
