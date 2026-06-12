import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProfileProvider } from './context/ProfileContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages lazy-loading or simple imports
import Home from './pages/Home';
import Profiles from './pages/Profiles';
import ProfileDetails from './pages/ProfileDetails';
import TopDevelopers from './pages/TopDevelopers';
import Analytics from './pages/Analytics';

function App() {
  return (
    <ProfileProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-brandDark-950 text-brandDark-100 selection:bg-primary selection:text-white">
          {/* Global Notification Banner */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#111827',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#22C55E',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          {/* Navigation */}
          <Navbar />

          {/* Main Content Space */}
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/profiles/:username" element={<ProfileDetails />} />
              <Route path="/top-developers" element={<TopDevelopers />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                  <h2 className="text-3xl font-extrabold font-heading text-white">404 - Not Found</h2>
                  <p className="text-sm text-brandDark-400">The page you are looking for does not exist.</p>
                  <a href="/" className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white animated-gradient-btn">
                    Go Home
                  </a>
                </div>
              } />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </ProfileProvider>
  );
}

export default App;
