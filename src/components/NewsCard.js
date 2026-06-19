import styles from './NewsCard.module.css';

const CATEGORY_STYLES = {
  test_updates: styles.badgeTestUpdates,
  admissions: styles.badgeAdmissions,
  scholarships: styles.badgeScholarships,
  results: styles.badgeResults,
  fee_changes: styles.badgeFeeChanges,
  general: styles.badgeGeneral,
};

const CATEGORY_LABELS = {
  test_updates: 'Test Updates',
  admissions: 'Admissions',
  scholarships: 'Scholarships',
  results: 'Results',
  fee_changes: 'Fee Changes',
  general: 'General',
};

export default function NewsCard({ item }) {
  const badgeClass = CATEGORY_STYLES[item.category] || styles.badgeGeneral;
  const badgeLabel = CATEGORY_LABELS[item.category] || 'General';

  return (
    <article className={styles.card}>
      <div className={styles.logo}>
        {item.university_abbreviation?.slice(0, 2)}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          <a href={item.source_url} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </h3>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.meta}>
          <span className={`${styles.badge} ${badgeClass}`}>{badgeLabel}</span>
          <span>{item.university_name}</span>
          <span>&#8226;</span>
          <span>{new Date(item.published_at).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
}
