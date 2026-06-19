'use client';

import styles from './FilterBar.module.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'test_updates', label: 'Test Updates' },
  { key: 'admissions', label: 'Admissions' },
  { key: 'scholarships', label: 'Scholarships' },
  { key: 'results', label: 'Results' },
  { key: 'fee_changes', label: 'Fee Changes' },
  { key: 'general', label: 'General' },
];

export default function FilterBar({ activeCategory, onSelect }) {
  return (
    <div className={styles.container}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          className={`${styles.pill} ${activeCategory === cat.key ? styles.active : ''}`}
          onClick={() => onSelect(cat.key)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
