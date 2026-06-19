'use client';

import { Plus, GraduationCap } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar({ universities, selectedId, onSelect, onAddClick, isOpen }) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>UniAnalysis</div>
        <button className={styles.addButton} onClick={onAddClick}>
          <Plus size={16} />
          Add University
        </button>
      </div>

      <div className={`${styles.list} ${styles.scrollbar}`}>
        <div
          className={`${styles.item} ${selectedId === null ? styles.active : ''}`}
          onClick={() => onSelect(null)}
        >
          <div className={styles.itemIcon}>
            <GraduationCap size={16} />
          </div>
          <span>All Universities</span>
        </div>

        {universities.map((uni) => (
          <div
            key={uni.id}
            className={`${styles.item} ${selectedId === uni.id ? styles.active : ''}`}
            onClick={() => onSelect(uni.id)}
          >
            <div className={styles.itemIcon}>
              {uni.abbreviation?.slice(0, 2)}
            </div>
            <span>{uni.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
