'use client';

import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, placeholder = 'Search news...' }) {
  return (
    <div className={styles.container}>
      <Search size={18} className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
