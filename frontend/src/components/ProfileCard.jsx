import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronRight, FaGithub, FaStar, FaUsers, FaFolder } from 'react-icons/fa';
import DeveloperBadge from './DeveloperBadge';

const ProfileCard = ({ profile }) => {
  const {
    username,
    name,
    avatar_url,
    developer_score,
    tier,
    followers,
    public_repos,
    top_language
  } = profile;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-6 flex flex-col justify-between shadow-glass hover:shadow-glass-hover transition-all duration-300 relative overflow-hidden group"
    >
      {/* Background radial highlight */}
      <div className="absolute -right-10 -top-10 w-28 h-28 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
      
      <div className="space-y-4">
        {/* Header: Avatar, Name, Username */}
        <div className="flex items-center space-x-4">
          <img
            src={avatar_url || 'https://img.icons8.com/color/96/github--v1.png'}
            alt={`${username}'s avatar`}
            className="w-14 h-14 rounded-2xl border border-brandDark-800 object-cover bg-brandDark-950"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white truncate font-heading group-hover:text-primary-light transition-colors">
              {name || username}
            </h3>
            <p className="text-xs text-brandDark-400 truncate flex items-center space-x-1">
              <FaGithub className="text-[10px]" />
              <span>@{username}</span>
            </p>
          </div>
        </div>

        {/* Badges: Tier & Language */}
        <div className="flex flex-wrap gap-2 items-center">
          <DeveloperBadge tier={tier} />
          {top_language && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-brandDark-800 text-brandDark-300 border border-brandDark-700">
              {top_language}
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-brandDark-900 text-center">
          <div className="space-y-0.5">
            <span className="text-[10px] text-brandDark-500 font-semibold tracking-wider uppercase block">Score</span>
            <span className="text-sm font-extrabold text-white flex items-center justify-center space-x-0.5">
              <FaStar className="text-warning text-xs" />
              <span>{developer_score.toLocaleString()}</span>
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-brandDark-500 font-semibold tracking-wider uppercase block">Followers</span>
            <span className="text-sm font-extrabold text-brandDark-200 flex items-center justify-center space-x-0.5">
              <FaUsers className="text-secondary-light text-xs" />
              <span>{followers.toLocaleString()}</span>
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-brandDark-500 font-semibold tracking-wider uppercase block">Repos</span>
            <span className="text-sm font-extrabold text-brandDark-200 flex items-center justify-center space-x-0.5">
              <FaFolder className="text-primary-light text-xs" />
              <span>{public_repos.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action button linking to details */}
      <div className="mt-5">
        <Link
          to={`/profiles/${username}`}
          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brandDark-900 border border-brandDark-800 text-white hover:bg-primary hover:border-primary transition-all duration-300"
        >
          <span>View Insights</span>
          <FaChevronRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
