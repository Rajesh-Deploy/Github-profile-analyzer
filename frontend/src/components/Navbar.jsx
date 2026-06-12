import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaGithub, FaBars, FaTimes, FaHome, FaUsers, FaTrophy, FaChartBar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Profiles', path: '/profiles', icon: <FaUsers /> },
    { name: 'Top Developers', path: '/top-developers', icon: <FaTrophy /> },
    { name: 'Analytics', path: '/analytics', icon: <FaChartBar /> },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-nav shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-primary transition-colors">
              <FaGithub className="text-2xl text-primary-light" />
              <span className="font-heading font-bold text-lg tracking-wider bg-gradient-to-r from-white via-brandDark-100 to-secondary-light bg-clip-text text-transparent">
                GITHUB ANALYZER
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                      : 'text-brandDark-300 hover:bg-brandDark-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-brandDark-300 hover:text-white p-2 rounded-lg focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass-panel border-t border-brandDark-800"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-brandDark-300 hover:bg-brandDark-800 hover:text-white'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
