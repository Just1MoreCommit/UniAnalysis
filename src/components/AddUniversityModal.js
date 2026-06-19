'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './AddUniversityModal.module.css';

export default function AddUniversityModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    abbreviation: '',
    website_url: '',
    logo_url: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.abbreviation.trim()) return;
    onAdd({ ...form });
    setForm({ name: '', abbreviation: '', website_url: '', logo_url: '' });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add University</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. National University of Sciences & Technology"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Abbreviation</label>
            <input
              className={styles.input}
              value={form.abbreviation}
              onChange={(e) => setForm((f) => ({ ...f, abbreviation: e.target.value }))}
              placeholder="e.g. NUST"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Website URL</label>
            <input
              className={styles.input}
              value={form.website_url}
              onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
              placeholder="https://example.edu.pk"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Logo URL</label>
            <input
              className={styles.input}
              value={form.logo_url}
              onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
              placeholder="https://example.edu.pk/logo.png"
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
              Add University
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
