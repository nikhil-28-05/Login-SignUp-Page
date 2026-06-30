import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Notification from './Notification';

const LoginForm = ({ onToggleView }) => {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [notice, setNotice] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice({ message: '', type: '' });
    setErrors({ email: '', password: '' });

    let hasErrors = false;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = "Enter your email address.";
      hasErrors = true;
    } else if (!isValidEmail(email.trim())) {
      newErrors.email = "Enter a valid email address.";
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = "Enter your password.";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login(email.trim(), password);
      setNotice({ message: response.msg || "Signed in successfully. Redirecting...", type: 'success' });
    } catch (err) {
      setNotice({ message: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="form-panel">
      <div className="form-card">
        <p className="kicker">Sign in</p>
        <h2>Welcome back</h2>
        <p className="sub">
          New to Vaultline? <a href="#" onClick={(e) => { e.preventDefault(); onToggleView('signup'); }}>Create an account</a>
        </p>

        <Notification message={notice.message} type={notice.type} />

        <form onSubmit={handleSubmit} noValidate>
          <div className={`field ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email address</label>
            <div className="field-input">
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="you@company.com" 
                autoComplete="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className={`field ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">Password</label>
            <div className="field-input">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                autoComplete="current-password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button" 
                className="toggle-visibility" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div className="check-row">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Keep this device signed in</label>
          </div>

          <button 
            type="submit" 
            className={`btn-submit ${isSubmitting ? 'loading' : ''}`} 
            disabled={isSubmitting}
          >
            <span className="spinner"></span>
            <span className="btn-label">Sign in</span>
          </button>
        </form>

        <p className="form-foot-note">Protected by token-based authentication. Your password is never stored in plain text.</p>
      </div>
    </main>
  );
};

export default LoginForm;
