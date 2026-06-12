import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaChartLine, FaTrophy, FaUserCheck, FaAward } from 'react-icons/fa';
import { useProfiles } from '../context/ProfileContext';
import SearchBar from '../components/SearchBar';
import StatCard from '../components/StatCard';

const Home = () => {
  const navigate = useNavigate();
  const { analyze, analytics, fetchAnalytics, loading } = useProfiles();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleSearch = async (username) => {
    try {
      await analyze(username);
      navigate(`/profiles/${username}`);
    } catch (error) {
      // Errors are toasted inside Context
      console.error(error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 py-6 md:py-12"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-extrabold text-primary-light uppercase tracking-wider">
          <FaGithub />
          <span>GitHub API Integration Service</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
          Analyze any <span className="animated-gradient-text">GitHub Profile</span> inside seconds
        </h1>
        <p className="text-sm sm:text-base text-brandDark-400 max-w-xl mx-auto font-medium leading-relaxed">
          Generate deep Insights, compile language frequency distributions, calculate average stars, and map custom developer scoring tiers.
        </p>
      </motion.div>

      {/* Search Bar Section */}
      <motion.div variants={itemVariants} className="relative z-10">
        <SearchBar onSearch={handleSearch} isLoading={loading} />
      </motion.div>

      {/* Quick Statistics Summary */}
      {analytics && analytics.totalProfiles > 0 && (
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-xs font-bold text-brandDark-400 tracking-widest uppercase text-center">
            System Synchronization Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title="Analyzed Developers"
              value={analytics.totalProfiles}
              icon={<FaUserCheck />}
              description="Profiles verified and saved in local cache."
              colorClass="text-primary-light"
            />
            <StatCard
              title="Average Stars Received"
              value={analytics.averageStars}
              icon={<FaChartLine />}
              description="Mean star count computed across databases."
              colorClass="text-secondary-light"
            />
            <StatCard
              title="Top Developer Score"
              value={analytics.topDeveloper?.developer_score || 0}
              icon={<FaTrophy />}
              description={`Currently held by @${analytics.topDeveloper?.username || 'none'}`}
              colorClass="text-warning"
            />
          </div>
        </motion.div>
      )}

      {/* Feature Section */}
      <motion.div variants={itemVariants} className="space-y-8 pt-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-heading text-white">How We Evaluate Developers</h2>
          <p className="text-xs text-brandDark-400">Our calculations are objective, public-metric based formulas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-brandDark-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary-light flex items-center justify-center text-lg">
              <FaAward />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Custom Developer Score</h3>
            <p className="text-xs text-brandDark-400 leading-relaxed">
              We run a multi-variable equation taking followers (weight: 2), repository stars (weight: 3), and public repo counts (weight: 1) to build a unified index.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-brandDark-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary-light flex items-center justify-center text-lg">
              <FaChartLine />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Language Distributions</h3>
            <p className="text-xs text-brandDark-400 leading-relaxed">
              We scan every public repository of the target user, tallying their primary language tags to establish their main stack focus percentages.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-brandDark-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/20 text-warning flex items-center justify-center text-lg">
              <FaTrophy />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Developer Tier Index</h3>
            <p className="text-xs text-brandDark-400 leading-relaxed">
              Based on score brackets, we place users in four distinct levels: <span className="text-zinc-400">Beginner</span>, <span className="text-sky-400">Intermediate</span>, <span className="text-amber-400">Advanced</span>, and <span className="text-indigo-400">Expert</span>.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
