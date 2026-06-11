import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../context/ProfileContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ScoreChart from '../components/ScoreChart';
import LanguageChart from '../components/LanguageChart';
import { FaUsers, FaStar, FaTrophy, FaChartBar, FaGlobe } from 'react-icons/fa';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Cell 
} from 'recharts';

const Analytics = () => {
  const { 
    analytics, fetchAnalytics, profiles, fetchProfiles, 
    topDevelopers, fetchTopDevelopers, loading, error 
  } = useProfiles();

  const [allProfilesForCharts, setAllProfilesForCharts] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setChartLoading(true);
      try {
        await Promise.all([
          fetchAnalytics(),
          fetchTopDevelopers()
        ]);
        
        // Fetch up to 100 profiles to make the charts statistically interesting
        const { getProfiles } = await import('../services/api');
        const profilesResult = await getProfiles({ limit: 100 });
        if (profilesResult?.success) {
          setAllProfilesForCharts(profilesResult.data.profiles);
        }
      } catch (err) {
        console.error('Error fetching analytics chart details:', err);
      } finally {
        setChartLoading(false);
      }
    };

    loadAnalyticsData();
  }, [fetchAnalytics, fetchTopDevelopers]);

  if (loading || chartLoading) {
    return <LoadingSpinner message="Generating statistics and rendering charts..." fullPage />;
  }

  if (error) {
    return <ErrorMessage message={error} retryAction={fetchAnalytics} />;
  }

  if (!analytics || analytics.totalProfiles === 0) {
    return (
      <div className="glass-card text-center p-12 rounded-2xl border border-brandDark-800 max-w-lg mx-auto my-12">
        <FaChartBar className="text-4xl text-brandDark-600 mx-auto mb-4" />
        <p className="text-brandDark-400 font-medium">No analytics data available.</p>
        <p className="text-xs text-brandDark-500 mt-1">Analyze some GitHub profiles on the Home page to generate statistics.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white animated-gradient-btn">
          Analyze Profile
        </Link>
      </div>
    );
  }

  // 1. Compile Followers Distribution Data
  const followersData = allProfilesForCharts
    .map((p) => ({
      username: p.username,
      followers: p.followers
    }))
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 10); // show top 10 for readability in bar charts

  // 2. Compile Top Languages aggregate distribution
  const aggregatedLanguages = {};
  allProfilesForCharts.forEach((p) => {
    if (p.language_distribution) {
      Object.entries(p.language_distribution).forEach(([lang, count]) => {
        aggregatedLanguages[lang] = (aggregatedLanguages[lang] || 0) + count;
      });
    }
  });

  // 3. Compile Top Developers scores bar chart
  const topDevsChartData = topDevelopers.map((p) => ({
    name: p.username,
    score: p.developer_score
  }));

  return (
    <div className="space-y-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Platform Analytics</h1>
        <p className="text-xs text-brandDark-400 mt-1">Aggregate insights and distributions calculated from analyzed profiles.</p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Profiles"
          value={analytics.totalProfiles}
          icon={<FaUsers />}
          description="Total users stored in local cache."
          colorClass="text-primary-light"
        />
        <StatCard
          title="Average Followers"
          value={analytics.averageFollowers}
          icon={<FaUsers />}
          description="Mean follower counts of cached profiles."
          colorClass="text-secondary-light"
        />
        <StatCard
          title="Average Stars"
          value={analytics.averageStars}
          icon={<FaStar />}
          description="Mean repository star counts."
          colorClass="text-warning"
        />
        <StatCard
          title="Top Developer"
          value={analytics.topDeveloper?.username || 'N/A'}
          icon={<FaTrophy />}
          description={`High score: ${analytics.topDeveloper?.developer_score?.toLocaleString() || 0}`}
          colorClass="text-indigo-400"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Developer Score Curve */}
        <div className="glass-card p-5 rounded-2xl border border-brandDark-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider">
              Developer Score Distribution
            </h3>
            <p className="text-[10px] text-brandDark-500">Distribution curve of developer ratings inside the cache.</p>
          </div>
          <ScoreChart data={allProfilesForCharts} />
        </div>

        {/* Chart 2: Followers Leaderboard Bar */}
        <div className="glass-card p-5 rounded-2xl border border-brandDark-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider">
              Followers Distribution (Top Users)
            </h3>
            <p className="text-[10px] text-brandDark-500">Followers comparison across the top 10 most followed users.</p>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={followersData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                <XAxis dataKey="username" stroke="rgba(255, 255, 255, 0.3)" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255, 255, 255, 0.3)" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="followers" fill="#0EA5E9" radius={[4, 4, 0, 0]}>
                  {followersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#38BDF8' : '#0ea5e9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Language Pie Share */}
        <div className="glass-card p-5 rounded-2xl border border-brandDark-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider flex items-center gap-1.5">
              <FaGlobe className="text-xs text-primary-light" />
              <span>Overall Stack Language Share</span>
            </h3>
            <p className="text-[10px] text-brandDark-500">Aggregated repository primary language distributions.</p>
          </div>
          <LanguageChart distribution={aggregatedLanguages} />
        </div>

        {/* Chart 4: Leaderboard Score Comparison Bar */}
        <div className="glass-card p-5 rounded-2xl border border-brandDark-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider">
              Top 10 Developer Scores
            </h3>
            <p className="text-[10px] text-brandDark-500">Score comparison of the top ten highest ranked developers.</p>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topDevsChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.3)" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255, 255, 255, 0.3)" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="score" fill="#2563EB" radius={[4, 4, 0, 0]}>
                  {topDevsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#60A5FA' : '#2563eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
