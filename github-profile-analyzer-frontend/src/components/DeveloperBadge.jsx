import React from 'react';

const DeveloperBadge = ({ tier }) => {
  const getBadgeStyles = () => {
    switch (tier?.toLowerCase()) {
      case 'expert':
        return {
          bg: 'bg-indigo-500/10',
          text: 'text-indigo-400',
          border: 'border-indigo-500/20',
          label: 'Expert'
        };
      case 'advanced':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/20',
          label: 'Advanced'
        };
      case 'intermediate':
        return {
          bg: 'bg-sky-500/10',
          text: 'text-sky-400',
          border: 'border-sky-500/20',
          label: 'Intermediate'
        };
      case 'beginner':
      default:
        return {
          bg: 'bg-zinc-500/10',
          text: 'text-zinc-400',
          border: 'border-zinc-500/20',
          label: 'Beginner'
        };
    }
  };

  const styles = getBadgeStyles();

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles.bg} ${styles.text} ${styles.border}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
      {styles.label}
    </span>
  );
};

export default DeveloperBadge;
