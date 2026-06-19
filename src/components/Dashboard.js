'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import NewsCard from './NewsCard';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';
import AddUniversityModal from './AddUniversityModal';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [universities, setUniversities] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedUniversityId, setSelectedUniversityId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch universities
  useEffect(() => {
    fetch('/api/universities')
      .then((res) => res.json())
      .then((data) => setUniversities(data.universities || []))
      .catch(() => setUniversities([]));
  }, []);

  // Fetch news based on filters
  const fetchNews = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (category !== 'all') params.set('category', category);
    if (selectedUniversityId) params.set('university_id', selectedUniversityId);

    fetch(`/api/news?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data.news || []);
        setLoading(false);
      })
      .catch(() => {
        setNews([]);
        setLoading(false);
      });
  }, [debouncedSearch, category, selectedUniversityId]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleAddUniversity = async (uni) => {
    try {
      const res = await fetch('/api/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uni),
      });
      if (res.ok) {
        const data = await res.json();
        setUniversities((prev) => [...prev, data.university]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.dashboard}>
      <button
        className={styles.mobileToggle}
        onClick={() => setSidebarOpen((s) => !s)}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      <Sidebar
        universities={universities}
        selectedId={selectedUniversityId}
        onSelect={(id) => {
          setSelectedUniversityId(id);
          setSidebarOpen(false);
        }}
        onAddClick={() => setIsModalOpen(true)}
        isOpen={sidebarOpen}
      />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
          <p>Latest entrance exam news from Pakistani universities</p>
        </div>

        <SearchBar value={search} onChange={setSearch} />
        <FilterBar activeCategory={category} onSelect={setCategory} />

        <div className={styles.refreshBar}>
          <span className={styles.count}>
            {loading ? 'Loading...' : `${news.length} result${news.length !== 1 ? 's' : ''}`}
          </span>
          <button className={styles.refreshButton} onClick={fetchNews}>
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        <div className={styles.newsList}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : news.length === 0 ? (
            <EmptyState />
          ) : (
            news.map((item) => <NewsCard key={item.id} item={item} />)
          )}
        </div>
      </main>

      <AddUniversityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddUniversity}
      />
    </div>
  );
}
