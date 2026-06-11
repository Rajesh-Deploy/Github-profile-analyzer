import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../context/ProfileContext';
import DeveloperBadge from '../components/DeveloperBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FaTrophy, FaMedal, FaCrown, FaStar, FaChevronRight, FaGithub } from 'react-icons/fa';

const TopDevelopers = () => {
  const { topDevelopers, fetchTopDevelopers, loading, error } = useProfiles();

  useEffect(() => {
    fetchTopDevelopers();
  }, [fetchTopDevelopers]);

  if (loading) {
    return <LoadingSpinner message="Assembling developer leaderboard..." fullPage />;
  }

  if (error) {
    return <ErrorMessage message={error} retryAction={fetchTopDevelopers} />;
  }

  if (!topDevelopers || topDevelopers.length === 0) {
    return (
      <div className="glass-card text-center p-12 rounded-2xl border border-brandDark-800 max-w-lg mx-auto my-12">
        <FaTrophy className="text-4xl text-brandDark-600 mx-auto mb-4" />
        <p className="text-brandDark-400 font-medium">The leaderboard is empty.</p>
        <p className="text-xs text-brandDark-500 mt-1">Analyze some GitHub profiles on the Home page to populate the ranks.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white animated-gradient-btn">
          Analyze Profile
        </Link>
      </div>
    );
  }

  // Split into Top 3 podium and Table listings (ranks 4-10)
  const podiumDevs = topDevelopers.slice(0, 3);
  const tableDevs = topDevelopers.slice(3);

  // Re-order podium as [2nd, 1st, 3rd] for visual presentation from left-to-right
  const orderedPodium = [];
  if (podiumDevs[1]) orderedPodium.push({ dev: podiumDevs[1], rank: 2 });
  if (podiumDevs[0]) orderedPodium.push({ dev: podiumDevs[0], rank: 1 });
  if (podiumDevs[2]) orderedPodium.push({ dev: podiumDevs[2], rank: 3 });

  return (
    <div className="space-y-12">
      {/* Title */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold font-heading text-white flex items-center justify-center gap-2">
          <FaTrophy className="text-warning animate-bounce" />
          <span>Top Developers Leaderboard</span>
        </h1>
        <p className="text-xs text-brandDark-400">
          Rankings are calculated dynamically based on public star ratios, followers, and code volumes.
        </p>
      </div>

      {/* Podium (Top 3 Visuals) */}
      {podiumDevs.length > 0 && (
        <div className="flex flex-col sm:flex-row items-end justify-center gap-6 pt-10 pb-4 max-w-4xl mx-auto">
          {orderedPodium.map(({ dev, rank }) => {
            const isFirst = rank === 1;
            const isSecond = rank === 2;
            const isThird = rank === 3;

            return (
              <div
                key={dev.id}
                className={`w-full sm:w-64 glass-card rounded-2xl border border-brandDark-800 p-5 flex flex-col items-center text-center relative ${
                  isFirst 
                    ? 'order-1 sm:order-2 sm:h-[340px] sm:-translate-y-4 border-warning/30 bg-brandDark-900/60 shadow-lg shadow-warning/5' 
                    : isSecond 
                      ? 'order-2 sm:order-1 sm:h-[300px] border-zinc-400/20' 
                      : 'order-3 sm:order-3 sm:h-[280px] border-amber-600/20'
                }`}
              >
                {/* Crown / Trophy icon indicators */}
                <div className="absolute -top-7">
                  {isFirst ? (
                    <div className="p-3 bg-warning/10 text-warning border border-warning/20 rounded-full">
                      <FaCrown className="text-xl animate-pulse" />
                    </div>
                  ) : isSecond ? (
                    <div className="p-2.5 bg-zinc-400/10 text-zinc-300 border border-zinc-400/20 rounded-full">
                      <FaMedal className="text-lg" />
                    </div>
                  ) : (
                    <div className="p-2 bg-amber-700/10 text-amber-500 border border-amber-700/20 rounded-full">
                      <FaMedal className="text-base" />
                    </div>
                  )}
                </div>

                {/* Avatar & Rank */}
                <div className="relative mt-4">
                  <img
                    src={dev.avatar_url}
                    alt={dev.username}
                    className={`w-16 h-16 rounded-2xl object-cover border-2 bg-brandDark-950 ${
                      isFirst ? 'border-warning w-20 h-20' : isSecond ? 'border-zinc-400' : 'border-amber-600'
                    }`}
                  />
                  <span className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${
                    isFirst ? 'bg-warning' : isSecond ? 'bg-zinc-400' : 'bg-amber-600'
                  }`}>
                    {rank}
                  </span>
                </div>

                <div className="mt-4 space-y-1 w-full min-w-0">
                  <Link to={`/profiles/${dev.username}`} className="text-sm font-bold text-white hover:text-primary-light truncate block font-heading">
                    {dev.name || dev.username}
                  </Link>
                  <p className="text-[10px] text-brandDark-500 truncate">@{dev.username}</p>
                </div>

                {/* Score */}
                <div className="mt-4 flex items-center space-x-1 px-3 py-1 rounded-lg bg-brandDark-950/80 border border-brandDark-800 text-xs">
                  <FaStar className="text-warning text-xs" />
                  <span className="font-extrabold text-white">{dev.developer_score.toLocaleString()}</span>
                </div>

                <div className="mt-3">
                  <DeveloperBadge tier={dev.tier} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ranks 4-10 Table */}
      {tableDevs.length > 0 && (
        <div className="glass-card rounded-2xl border border-brandDark-800 overflow-hidden shadow-lg max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brandDark-900/60 border-b border-brandDark-800 text-brandDark-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 text-center w-16">Rank</th>
                  <th className="py-4 px-6">Developer</th>
                  <th className="py-4 px-6">Tier</th>
                  <th className="py-4 px-6 text-center">Score</th>
                  <th className="py-4 px-6 text-center">Followers</th>
                  <th className="py-4 px-6 text-center">Repositories</th>
                  <th className="py-4 px-6 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brandDark-900 font-medium text-brandDark-200">
                {tableDevs.map((dev, index) => {
                  const rank = index + 4;
                  return (
                    <tr 
                      key={dev.id}
                      className="hover:bg-brandDark-900/40 transition-colors group"
                    >
                      <td className="py-3.5 px-6 text-center font-extrabold text-brandDark-400">
                        #{rank}
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={dev.avatar_url}
                            alt={dev.username}
                            className="w-8 h-8 rounded-lg object-cover bg-brandDark-950"
                          />
                          <div className="min-w-0">
                            <Link to={`/profiles/${dev.username}`} className="text-xs font-bold text-white hover:text-primary-light block truncate">
                              {dev.name || dev.username}
                            </Link>
                            <span className="text-[10px] text-brandDark-500 block truncate flex items-center space-x-0.5">
                              <FaGithub className="text-[9px]" />
                              <span>@{dev.username}</span>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <DeveloperBadge tier={dev.tier} />
                      </td>
                      <td className="py-3.5 px-6 text-center font-extrabold text-white">
                        {dev.developer_score.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 text-center text-brandDark-300">
                        {dev.followers.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 text-center text-brandDark-300">
                        {dev.public_repos.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <Link 
                          to={`/profiles/${dev.username}`}
                          className="p-1.5 text-brandDark-500 hover:text-white rounded-lg group-hover:translate-x-0.5 transition-all block"
                        >
                          <FaChevronRight className="text-[10px]" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopDevelopers;
