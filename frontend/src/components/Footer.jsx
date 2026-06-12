import React from 'react';
import { FaGithub, FaHeart, FaCodeBranch } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brandDark-950 border-t border-brandDark-900 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <span className="font-heading font-extrabold text-sm tracking-wider text-white">
              GITHUB PROFILE ANALYZER
            </span>
            <p className="text-xs text-brandDark-400 mt-1">
              Analyze public metrics and generate statistics with standard developer tiers.
            </p>
          </div>

          {/* Center Heart Note */}
          <div className="flex items-center space-x-1.5 text-xs text-brandDark-400">
            <span>Built with</span>
            <FaHeart className="text-danger animate-pulse" />
            <span>using React & Tailwind</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-xs text-brandDark-400 hover:text-white transition-colors"
            >
              <FaGithub className="text-sm" />
              <span>GitHub API</span>
            </a>
            <span className="text-brandDark-800">|</span>
            <div className="flex items-center space-x-1 text-xs text-brandDark-400">
              <FaCodeBranch className="text-xs text-secondary-light" />
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-[10px] text-brandDark-600 mt-6 pt-4 border-t border-brandDark-900">
          &copy; {currentYear} GitHub Profile Analyzer API. Open source community licensing.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
