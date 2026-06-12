import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

const SearchBar = ({ onSearch, isLoading, placeholder = "Enter GitHub username (e.g. torvalds)..." }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const validateUsername = (value) => {
    if (!value) {
      return 'Username is required';
    }
    if (value.length > 39) {
      return 'GitHub usernames have a maximum of 39 characters';
    }
    // GitHub rules: alphanumeric and hyphens, no consecutive hyphens, no start/end with hyphen
    const regex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!regex.test(value)) {
      return 'Invalid GitHub username format';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    const validationError = validateUsername(cleanUsername);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    onSearch(cleanUsername);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) setError('');
          }}
          disabled={isLoading}
          placeholder={placeholder}
          className={`w-full bg-brandDark-900/90 text-white placeholder-brandDark-400 pl-5 pr-32 py-4 rounded-2xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
            error
              ? 'border-danger/50 focus:ring-danger/20'
              : 'border-brandDark-800 focus:border-primary focus:ring-primary/20'
          } shadow-lg text-sm md:text-base`}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white animated-gradient-btn flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <ImSpinner8 className="animate-spin text-sm" />
              <span>Analyzing</span>
            </>
          ) : (
            <>
              <FaSearch className="text-xs sm:text-sm" />
              <span>Analyze</span>
            </>
          )}
        </button>
      </form>
      {error && (
        <p className="text-xs text-danger font-medium pl-3 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default SearchBar;
