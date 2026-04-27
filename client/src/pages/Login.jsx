import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Map username to a placeholder email for Firebase Auth
      const email = username.includes('@') ? username : `${username.toLowerCase()}@crm.com`;
      await signInWithEmailAndPassword(auth, email, password);
      
      localStorage.setItem('crm_authenticated', 'true');
      localStorage.setItem('crm_user', username);
      if (onLogin) onLogin();
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      // Show more specific error message
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Please check your username and password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password login is not enabled in Firebase Console. Please enable it under Authentication > Sign-in method.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {

      setLoading(false);
    }
  };


  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100vw',
      height: '100vh',
      background: 'var(--bg-dark)',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          padding: '3rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2rem' }}>Admin Access</h1>
          <p style={{ color: 'var(--text-muted)' }}>Enter your secure credentials</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Admin Username</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Master Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '14px' }}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Authorize & Enter'}
          </button>

          <button 
            type="button"
            onClick={async () => {
              if (!username || !password) {
                setError('Please enter a username and password to create the account.');
                return;
              }
              setLoading(true);
              try {
                const { createUserWithEmailAndPassword } = await import('firebase/auth');
                const email = username.includes('@') ? username : `${username.toLowerCase()}@crm.com`;
                await createUserWithEmailAndPassword(auth, email, password);
                alert('Admin account created! You can now log in.');
              } catch (err) {
                setError(`Setup Error: ${err.message}`);
              } finally {
                setLoading(false);
              }
            }}
            className="btn" 
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              marginTop: '1rem', 
              padding: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              fontSize: '0.85rem'
            }}
            disabled={loading}
          >
            First time? Create Admin Account
          </button>
        </form>


        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          CRM Secure Gateway &copy; 2026
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
