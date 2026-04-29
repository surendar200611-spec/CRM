import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddLead from './pages/AddLead';
import Login from './pages/Login';

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [theme, setTheme] = useState(localStorage.getItem('crm_theme') || 'dark');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'surendar110833@gmail.com') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    document.body.className = theme === 'light' ? 'light-mode' : '';
    localStorage.setItem('crm_theme', theme);

    return () => unsubscribe();
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            theme={theme} 
            toggleTheme={toggleTheme} 
          />
        )}
        
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                activeTab === 'dashboard' ? <Dashboard theme={theme} /> : <AddLead onSuccess={() => setActiveTab('dashboard')} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
