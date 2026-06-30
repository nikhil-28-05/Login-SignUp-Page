import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Notification from './Notification';

const SignupForm = ({ onToggleView }) => {
  const { register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });
  const [notice, setNotice] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [strengthLevel, setStrengthLevel] = useState(0);
  const [strengthText, setStrengthText] = useState("Use 8+ characters with a mix of letters, numbers & symbols.");

  const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"];

  const getPasswordStrength = (val) => {
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return Math.min(score, 4);
  };

  useEffect(() => {
    const level = getPasswordStrength(password);
    setStrengthLevel(level);
    if (password) {
      setStrengthText(strengthLabels[level]);
    } else {
      setStrengthText("Use 8+ characters with a mix of letters, numbers & symbols.");
    }
  }, [password]);

  const isValidEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice({ message: '', type: '' });
    setErrors({ email: '', password: '', confirmPassword: '' });

    let hasErrors = false;
    const newErrors = { email: '', password: '', confirmPassword: '' };

    if (!email.trim()) {
      newErrors.email = "Enter your email address.";
      hasErrors = true;
    } else if (!isValidEmail(email.trim())) {
      newErrors.email = "Enter a valid email address.";
      hasErrors = true;
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      hasErrors = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Re-enter your password.";
      hasErrors = true;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords don't match.";
      hasErrors = true;
    }

    if (!agreeTerms) {
      setNotice({ message: "Please agree to the Terms of Service to continue.", type: 'error' });
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await register(email.trim(), password);
      setNotice({ message: response.msg || "Account created. Redirecting to your dashboard...", type: 'success' });
    } catch (err) {
      setNotice({ message: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="form-panel">
      <div className="form-card">
        <p className="kicker">Create account</p>
        <h2>Join Vaultline</h2>
        <p className="sub">
          Already a member? <a href="#" onClick={(e) => { e.preventDefault(); onToggleView('login'); }}>Sign in instead</a>
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
                placeholder="At least 8 characters" 
                autoComplete="new-password" 
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
            <div className="strength" data-level={strengthLevel}>
              <i></i><i></i><i></i><i></i>
            </div>
            <p className="field-hint">{strengthText}</p>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div className={`field ${errors.confirmPassword ? 'has-error' : ''}`}>
            <label htmlFor="confirm">Confirm password</label>
            <div className="field-input">
              <input 
                type={showConfirm ? "text" : "password"} 
                id="confirm" 
                name="confirm" 
                placeholder="Re-enter your password" 
                autoComplete="new-password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
              <button 
                type="button" 
                className="toggle-visibility" 
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>

          <div className="check-row">
            <input 
              type="checkbox" 
              id="terms" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required 
            />
            <label htmlFor="terms">I agree to the Terms of Service and Privacy Policy</label>
          </div>

          <button 
            type="submit" 
            className={`btn-submit ${isSubmitting ? 'loading' : ''}`} 
            disabled={isSubmitting}
          >
            <span className="spinner"></span>
            <span className="btn-label">Create account</span>
          </button>
        </form>

        <p className="form-foot-note">Your password is hashed with bcrypt before it ever touches storage.</p>
      </div>
    </main>
  );
};

export default SignupForm;
