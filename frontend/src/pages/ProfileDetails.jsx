import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaGithub, FaBriefcase, FaMapMarkerAlt, FaLink, FaCalendarAlt, 
  FaSync, FaTrashAlt, FaChevronLeft, FaStar, FaCodeBranch, FaBook,
  FaArrowUp, FaFolderOpen, FaCode, FaAward
} from 'react-icons/fa';
import { useProfiles } from '../context/ProfileContext';
import DeveloperBadge from '../components/DeveloperBadge';
import LanguageChart from '../components/LanguageChart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ProfileDetails = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { 
    selectedProfile, fetchProfile, reanalyze, removeProfile, 
    analyze, loading, actionLoading 
  } = useProfiles();
  
  const [notFoundInDB, setNotFoundInDB] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadData = async () => {
    setNotFoundInDB(false);
    setErrorMessage('');
    try {
      await fetchProfile(username);
    } catch (err) {
      if (err.message.includes('not found')) {
        setNotFoundInDB(true);
      } else {
        setErrorMessage(err.message);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [username]);

  const handleTriggerAnalysis = async () => {
    setNotFoundInDB(false);
    try {
      await analyze(username);
      loadData();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleReanalyze = async () => {
    try {
      await reanalyze(username);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete @${username}'s analysis details?`)) {
      try {
        const deleted = await removeProfile(username);
        if (deleted) {
          navigate('/profiles');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message={`Loading insights for @${username}...`} fullPage />;
  }

  if (notFoundInDB) {
    return (
      <div className="glass-card max-w-lg mx-auto p-8 rounded-2xl border border-brandDark-800 text-center shadow-lg my-12 space-y-6">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-primary/10 text-primary border border-primary/20">
            <FaGithub className="text-4xl text-primary-light animate-pulse" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold font-heading text-white">Not Yet Analyzed</h2>
          <p className="text-xs text-brandDark-400 mt-2 leading-relaxed">
            The profile of <strong>@{username}</strong> is not tracked in the database cache. 
            Would you like to analyze this user now?
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-brandDark-300 hover:text-white bg-brandDark-900 hover:bg-brandDark-800 border border-brandDark-800 transition-colors"
          >
            Back to Search
          </Link>
          <button
            onClick={handleTriggerAnalysis}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white animated-gradient-btn"
          >
            Analyze Profile Now
          </button>
        </div>
      </div>
    );
  }

  if (errorMessage || !selectedProfile) {
    return <ErrorMessage message={errorMessage || 'Could not resolve developer stats.'} retryAction={loadData} />;
  }

  const profile = selectedProfile;

  // Format Helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Upper Navigation Links & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link 
          to="/profiles"
          className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brandDark-400 hover:text-white transition-colors"
        >
          <FaChevronLeft />
          <span>Back to Profiles</span>
        </Link>

        <div className="flex items-center space-x-2">
          {/* Reanalyze Button */}
          <button
            onClick={handleReanalyze}
            disabled={actionLoading}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brandDark-900 border border-brandDark-800 hover:bg-brandDark-800 text-white transition-all disabled:opacity-50"
          >
            <FaSync className={`text-xs ${actionLoading ? 'animate-spin' : ''}`} />
            <span>{actionLoading ? 'Syncing...' : 'Sync Latest'}</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-danger/10 border border-danger/20 hover:bg-danger hover:border-danger hover:text-white text-danger transition-all disabled:opacity-50"
          >
            <FaTrashAlt className="text-xs" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Grid: Left column profile header / Right column charts & stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Basic Profile info card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-brandDark-800 flex flex-col items-center text-center space-y-4">
            <img
              src={profile.avatar_url || 'https://img.icons8.com/color/96/github--v1.png'}
              alt={`${profile.username}'s avatar`}
              className="w-24 h-24 rounded-3xl border border-brandDark-800 bg-brandDark-950 object-cover shadow-lg"
            />
            <div>
              <h2 className="text-xl font-bold text-white font-heading">{profile.name || profile.username}</h2>
              <a
                href={profile.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-light hover:underline inline-flex items-center space-x-1.5 mt-1"
              >
                <FaGithub />
                <span>@{profile.username}</span>
              </a>
            </div>

            <DeveloperBadge tier={profile.tier} />

            {profile.bio && (
              <p className="text-xs text-brandDark-400 italic leading-relaxed pt-2">
                "{profile.bio}"
              </p>
            )}

            {/* Basic Info Metadata */}
            <div className="w-full space-y-3 pt-4 border-t border-brandDark-900 text-left text-xs text-brandDark-300">
              {profile.company && (
                <div className="flex items-center space-x-2">
                  <FaBriefcase className="text-brandDark-500" />
                  <span className="truncate">{profile.company}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-brandDark-500" />
                  <span className="truncate">{profile.location}</span>
                </div>
              )}
              {profile.blog && (
                <div className="flex items-center space-x-2">
                  <FaLink className="text-brandDark-500" />
                  <a href={profile.blog.startsWith('http') ? profile.blog : `http://${profile.blog}`} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline truncate">
                    {profile.blog}
                  </a>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-brandDark-500" />
                <span>Created {formatDate(profile.account_created_at)}</span>
              </div>
            </div>
          </div>

          {/* Activity Analysis Dates */}
          <div className="glass-card p-5 rounded-2xl border border-brandDark-800 space-y-3 text-xs">
            <h3 className="font-bold text-white font-heading uppercase tracking-wider text-[10px] text-brandDark-400">Activity Logs</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-1">
                <span className="text-brandDark-400">Latest Project Creation</span>
                <span className="text-white font-semibold">{formatDate(profile.latest_repo_created)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-brandDark-900">
                <span className="text-brandDark-400">Latest Project Update</span>
                <span className="text-white font-semibold">{formatDate(profile.latest_repo_updated)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Complex stats dashboards */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Custom Rank Evaluation Card */}
          <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute right-0 top-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 text-center md:text-left">
              <div className="text-[10px] font-bold text-primary-light uppercase tracking-widest flex items-center justify-center md:justify-start space-x-1">
                <FaAward />
                <span>Developer Rating Index</span>
              </div>
              <h2 className="text-2xl font-black font-heading text-white tracking-tight">
                Developer Score: <span className="text-primary-light">{profile.developer_score.toLocaleString()}</span>
              </h2>
              <p className="text-xs text-brandDark-400 leading-relaxed max-w-md">
                This rating combines followers, public repositories, and repository stars count to generate a standardized classification tier.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-brandDark-900/80 border border-brandDark-800 text-center min-w-[140px]">
              <span className="text-[10px] font-bold tracking-widest text-brandDark-500 uppercase block mb-1">Rank Level</span>
              <span className={`text-lg font-black uppercase tracking-wider ${
                profile.tier?.toLowerCase() === 'expert' ? 'text-indigo-400' :
                profile.tier?.toLowerCase() === 'advanced' ? 'text-amber-400' :
                profile.tier?.toLowerCase() === 'intermediate' ? 'text-sky-400' : 'text-zinc-400'
              }`}>
                {profile.tier}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl text-center space-y-1.5">
              <span className="text-[10px] text-brandDark-500 font-bold uppercase tracking-wider block">Followers</span>
              <span className="text-xl font-extrabold text-white block">{profile.followers.toLocaleString()}</span>
            </div>
            <div className="glass-card p-4 rounded-xl text-center space-y-1.5">
              <span className="text-[10px] text-brandDark-500 font-bold uppercase tracking-wider block">Following</span>
              <span className="text-xl font-extrabold text-white block">{profile.following.toLocaleString()}</span>
            </div>
            <div className="glass-card p-4 rounded-xl text-center space-y-1.5">
              <span className="text-[10px] text-brandDark-500 font-bold uppercase tracking-wider block">Public Repos</span>
              <span className="text-xl font-extrabold text-white block">{profile.public_repos.toLocaleString()}</span>
            </div>
            <div className="glass-card p-4 rounded-xl text-center space-y-1.5">
              <span className="text-[10px] text-brandDark-500 font-bold uppercase tracking-wider block">Public Gists</span>
              <span className="text-xl font-extrabold text-white block">{profile.public_gists.toLocaleString()}</span>
            </div>
            <div className="glass-card p-4 rounded-xl text-center space-y-1.5">
              <span className="text-[10px] text-brandDark-500 font-bold uppercase tracking-wider block">Total Stars</span>
              <span className="text-xl font-extrabold text-warning block flex items-center justify-center space-x-1">
                <FaStar className="text-sm" />
                <span>{profile.total_stars_received.toLocaleString()}</span>
              </span>
            </div>
            <div className="glass-card p-4 rounded-xl text-center space-y-1.5">
              <span className="text-[10px] text-brandDark-500 font-bold uppercase tracking-wider block">Total Forks</span>
              <span className="text-xl font-extrabold text-secondary-light block flex items-center justify-center space-x-1">
                <FaCodeBranch className="text-sm" />
                <span>{profile.total_forks_received.toLocaleString()}</span>
              </span>
            </div>
          </div>

          {/* Repo Analysis and Language Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Repo Auditing */}
            <div className="glass-card p-5 rounded-2xl border border-brandDark-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider flex items-center space-x-1.5 border-b border-brandDark-900 pb-2">
                <FaFolderOpen className="text-primary-light" />
                <span>Repository Audits</span>
              </h3>
              
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-brandDark-950 rounded-xl">
                    <span className="text-[10px] text-brandDark-500 font-bold uppercase block mb-1">Avg Stars/Repo</span>
                    <span className="text-base font-extrabold text-white">{profile.average_stars_per_repo}</span>
                  </div>
                  <div className="p-3 bg-brandDark-950 rounded-xl">
                    <span className="text-[10px] text-brandDark-500 font-bold uppercase block mb-1">Avg Forks/Repo</span>
                    <span className="text-base font-extrabold text-white">{profile.average_forks_per_repo}</span>
                  </div>
                </div>

                {profile.most_starred_repo && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-brandDark-500 font-bold uppercase block">Highest Starred Repo</span>
                    <div className="p-3 bg-brandDark-950 rounded-xl flex items-center justify-between border border-brandDark-900">
                      <span className="text-white font-bold truncate pr-3">{profile.most_starred_repo}</span>
                      <span className="text-warning font-bold flex items-center flex-shrink-0 text-xs">
                        <FaStar className="mr-1" />
                        {profile.most_starred_repo_stars.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {profile.most_forked_repo && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-brandDark-500 font-bold uppercase block">Highest Forked Repo</span>
                    <div className="p-3 bg-brandDark-950 rounded-xl flex items-center justify-between border border-brandDark-900">
                      <span className="text-white font-bold truncate pr-3">{profile.most_forked_repo}</span>
                      <span className="text-secondary-light font-bold flex items-center flex-shrink-0 text-xs">
                        <FaCodeBranch className="mr-1" />
                        {profile.most_forked_repo_forks.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Languages Graph */}
            <div className="glass-card p-5 rounded-2xl border border-brandDark-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider flex items-center space-x-1.5 border-b border-brandDark-900 pb-2">
                <FaCode className="text-secondary-light" />
                <span>Languages Mix</span>
              </h3>
              <LanguageChart distribution={profile.language_distribution} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
