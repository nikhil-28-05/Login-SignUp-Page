import React from 'react';

const BrandPanel = ({ isSignup = false }) => {
  const eyebrow = isSignup ? "New member" : "Member access";
  
  const heading = isSignup ? (
    <>Start your<br /><em>private</em> ledger.</>
  ) : (
    <>Your work,<br /><em>quietly</em> secured.</>
  );

  const description = isSignup 
    ? "One account, encrypted from the first keystroke. Set a strong password and your credentials never leave the vault unhashed."
    : "Every session begins with a single verified key. No exceptions, no shortcuts — just the access you've earned.";

  const statNumber = isSignup ? "bcrypt" : "256-bit";
  const statLabel = isSignup ? "password hashing" : "token signing";

  return (
    <aside className="brand-panel">
      <div className="brand-mark">
        <span className="dot"></span> Vaultline
      </div>

      <div className="brand-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{heading}</h1>

        <div className="seal" aria-hidden="true">
          <svg viewBox="0 0 168 168">
            <g className="ring-outer">
              <circle cx="84" cy="84" r="80" fill="none" stroke="rgba(246,243,234,0.18)" strokeWidth="1" strokeDasharray="2 6" />
            </g>
            <g className="ring-inner">
              <circle cx="84" cy="84" r="62" fill="none" stroke="#c8983f" strokeWidth="1.2" strokeDasharray="1 5" />
            </g>
            <circle cx="84" cy="84" r="44" fill="none" stroke="rgba(246,243,234,0.3)" strokeWidth="1" />
            
            {isSignup ? (
              // Checkmark for registration
              <path d="M68 84 L80 96 L102 72" stroke="#e3b563" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              // Clock hands for sessions
              <>
                <path d="M84 64 L84 84 L98 98" stroke="#e3b563" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="84" cy="84" r="3" fill="#e3b563" />
              </>
            )}
          </svg>
        </div>

        <p>{description}</p>
      </div>

      <div className="brand-foot">
        <span>Est. ledger of trusted sessions</span>
        <div className="stat-block">
          <strong>{statNumber}</strong>
          {statLabel}
        </div>
      </div>
    </aside>
  );
};

export default BrandPanel;
