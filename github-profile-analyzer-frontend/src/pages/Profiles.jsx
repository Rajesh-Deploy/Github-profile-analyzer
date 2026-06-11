import React, { useEffect, useState } from 'react';
import { useProfiles } from '../context/ProfileContext';
import ProfileCard from '../components/ProfileCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FaSortAmountDown, FaSortAmountUp, FaSearch, FaSlidersH } from 'react-icons/fa';

const Profiles = () => {
  const { profiles, pagination, fetchProfiles, loading, error } = useProfiles();
  
  // Filter & Query States
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('developer_score');
  const [order, setOrder] = useState('DESC');
  const [page, setPage] = useState(1);

  // Trigger fetch when parameters modify
  useEffect(() => {
    const params = {
      page,
      limit: 9, // Fit 3x3 grid nicely
      sortBy,
      order,
    };
    if (searchTerm.trim()) {
      params.username = searchTerm.trim();
    }
    fetchProfiles(params);
  }, [fetchProfiles, page, sortBy, order]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset page to 1 on search
    const params = {
      page: 1,
      limit: 9,
      sortBy,
      order,
    };
    if (searchTerm.trim()) {
      params.username = searchTerm.trim();
    }
    fetchProfiles(params);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const toggleOrder = () => {
    setOrder((prev) => (prev === 'DESC' ? 'ASC' : 'DESC'));
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-white">Analyzed Profiles</h1>
          <p className="text-xs text-brandDark-400 mt-1">Browse and filter verified developer sync databases.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="glass-card p-4 rounded-2xl border border-brandDark-800 flex flex-col md:flex-row items-center gap-4 shadow-md">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brandDark-950 text-white placeholder-brandDark-500 pl-10 pr-4 py-2.5 rounded-xl border border-brandDark-800 focus:outline-none focus:border-primary text-xs"
          />
          <FaSearch className="absolute left-3.5 top-3.5 text-brandDark-500 text-xs" />
        </div>

        {/* Sort Selectors */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <FaSlidersH className="text-brandDark-500 text-xs" />
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="bg-brandDark-950 text-white border border-brandDark-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary w-full md:w-auto"
            >
              <option value="developer_score">Sort by Score</option>
              <option value="followers">Sort by Followers</option>
              <option value="public_repos">Sort by Repositories</option>
              <option value="created_at">Sort by Created Date</option>
            </select>
          </div>

          {/* Toggle Order Button */}
          <button
            type="button"
            onClick={toggleOrder}
            className="p-3 bg-brandDark-950 hover:bg-brandDark-800 border border-brandDark-800 text-brandDark-300 hover:text-white rounded-xl transition-all"
            title={order === 'DESC' ? 'Sort Ascending' : 'Sort Descending'}
          >
            {order === 'DESC' ? <FaSortAmountDown className="text-xs" /> : <FaSortAmountUp className="text-xs" />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white animated-gradient-btn"
        >
          Apply Filters
        </button>
      </form>

      {/* Main Grid */}
      {loading ? (
        <LoadingSpinner message="Searching developer database..." fullPage />
      ) : error ? (
        <ErrorMessage message={error} retryAction={() => fetchProfiles()} />
      ) : profiles.length === 0 ? (
        <div className="glass-card text-center p-12 rounded-2xl border border-brandDark-800 max-w-lg mx-auto">
          <p className="text-brandDark-400 font-medium">No verified developer profiles found matching criteria.</p>
          <p className="text-xs text-brandDark-500 mt-1">Try relaxing filters or search/analyze new profiles on Home page.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default Profiles;
